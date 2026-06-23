import re
import threading
from functools import lru_cache
from transformers import AutoModelForCausalLM, AutoModelForSeq2SeqLM, AutoTokenizer, AutoModelForSequenceClassification
import torch

# detect mood
_lockDetect = threading.Lock()
_tokenizerDetect = None
_modelDetect = None
# generate explanation
_lockExplain = threading.Lock()
_tokenizerExplain = None
_modelExplain = None
_llmExplain = None

DETECT_MODEL_NAME = "AnasAlokla/multilingual_go_emotions"
# EXPLAIN_MODEL_NAME = "Qwen/Qwen2.5-1.5B-Instruct"
EXPLAIN_MODEL_PATH = "./models/qwen2.5-1.5b-instruct-q4_k_m.gguf"
NEUTRAL_LABEL = "neutral"
SECONDARY_THRESHOLD = 0.10 # below value considered as neutral
CONFIDENCE_THRESHOLD = 0.5 # below value considered as mixed feelings 
EXPLAIN_THRESHOLD = 0.3 # mood included in explanation 

def _loadDetect():
    global _tokenizerDetect, _modelDetect
    if _modelDetect is None:
        with _lockDetect:
            if _modelDetect is None:  # double-checked locking
                _tokenizerDetect = AutoTokenizer.from_pretrained(DETECT_MODEL_NAME)
                _modelDetect = AutoModelForSequenceClassification.from_pretrained(DETECT_MODEL_NAME)
                _modelDetect.eval()
    return _tokenizerDetect, _modelDetect

def _loadExplain():
    global _llmExplain
    if _llmExplain is None:
        with _lockExplain:
            if _llmExplain is None:
                _llmExplain = Llama(
                    model_path=EXPLAIN_MODEL_PATH,
                    n_ctx=2048,        # context window
                    n_threads=4,       # tune to EC2 vCPU count
                    verbose=False,
                )
    return _llmExplain

# def _loadExplain():
#     global _tokenizerExplain, _modelExplain
#     if _modelExplain is None:
#         with _lockExplain:
#             if _modelExplain is None:  # double-checked locking
#                 _tokenizerExplain = AutoTokenizer.from_pretrained(EXPLAIN_MODEL_NAME, trust_remote_code=True)
#                 _modelExplain = AutoModelForCausalLM.from_pretrained(
#                     EXPLAIN_MODEL_NAME,
#                     torch_dtype=torch.float32,
#                     device_map=None, 
#                     trust_remote_code=True
#                 )
#                 _modelExplain.eval()
#                 _modelExplain.to("cpu")
#     return _tokenizerExplain, _modelExplain

def predict_mood(text: str, threshold: float = EXPLAIN_THRESHOLD) -> dict:
    """
    Multi-label emotion classification (go_emotions style).
    - If the model is confident (top score >= CONFIDENCE_THRESHOLD), returns
      a single dominant mood.
    - If not confident, returns is_mixed=True with the top 3 labels instead
      of forcing one label.
    """
    tokenizer, model = _loadDetect()

    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        max_length=512,
    )

    with torch.no_grad():
        logits = model(**inputs).logits
        probs = torch.sigmoid(logits)[0]  # multi-label (an instance can have multiple classes simultaneously) -> sigmoid, not softmax

    id2label = model.config.id2label
    scored = sorted(
        ((id2label[i], float(p)) for i, p in enumerate(probs)),
        key=lambda x: x[1],
        reverse=True,
    )

    # reduce neutral mood 
    non_neutral = [(lbl, s) for lbl, s in scored if lbl != NEUTRAL_LABEL]
    if non_neutral and non_neutral[0][1] >= SECONDARY_THRESHOLD:
        top_label, top_score = non_neutral[0]
    else:
        top_label, top_score = scored[0]

    above_threshold = [{"label": lbl, "score": round(s, 4)} for lbl, s in scored if s >= threshold]

    is_mixed = top_score < CONFIDENCE_THRESHOLD
    top_3 = [{"label": lbl, "score": round(s, 4)} for lbl, s in non_neutral[:3]]

    explanation = generate_mood_explanation(
        text,
        top_3
    )

    return {
        "mood": top_label if not is_mixed else None,
        "mood_confidence": round(top_score, 4),
        "is_mixed": is_mixed,
        "mood_top3": top_3,           
        # "mood_explain": above_threshold,  # TODO: FLAN-T5 small model for clearer explanation
        "mood_explain": explanation, 
    }

# analyze based on each sentence in entry instead of whole entry at once
def predict_mood_aggregated(text: str, threshold: float = 0.3) -> dict:
    sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', text) if s.strip()]
    tokenizer, model = _loadDetect()
    all_probs = []

    for sent in sentences:
        inputs = tokenizer(sent, return_tensors="pt", truncation=True, max_length=512)
        with torch.no_grad():
            logits = model(**inputs).logits
            all_probs.append(torch.sigmoid(logits)[0])

    avg_probs = torch.stack(all_probs).mean(dim=0)
    id2label = model.config.id2label
    scored = sorted(
        ((id2label[i], float(p)) for i, p in enumerate(avg_probs)),
        key=lambda x: x[1], reverse=True,
    )
    top_label, top_score = scored[0]
    return {
        "mood": top_label,
        "mood_confidence": round(top_score, 4),
        "mood_explain": [{"label": l, "score": s} for l, s in scored if s >= threshold],
    }

# prompt feedback generation
# def build_prompt(text, moods):
#     mood_text = ", ".join(
#         [f"{m['label']} ({m['score']:.2f})" for m in moods]
#     )


# generate feedback
def generate_mood_explanation(text, moods):
    llm = _loadExplain()

    mood_text = ", ".join(
        [f"{m['label']} ({m['score']:.2f})" for m in moods]
    )

    messages = [
        {
            "role": "system",
            "content": "You are a strict emotion analyst. You explain emotions only using evidence from the text."
        },
        {
            "role": "user",
            "content": (
                f"Journal Entry:\n{text}\n\n"
                f"Detected emotions:\n{mood_text}\n\n"
                "Task:\n"
                "Explain why these emotions appear.\n\n"
                "Rules:\n"
                "- 1 to 2 sentences only\n"
                "- Must reference or quote exact phrases from the journal\n"
            )
        }
    ]

    output = llm.create_chat_completion(
        messages=messages,
        max_tokens=120,
        temperature=0.7,
        top_p=0.9,
    )

    return output["choices"][0]["message"]["content"]

# def generate_mood_explanation(text, moods):
#     tokenizer, model = _loadExplain()

#     mood_text = ", ".join(
#         [f"{m['label']} ({m['score']:.2f})" for m in moods]
#     )

#     messages = [
#         {
#             "role": "system",
#             "content": "You are a strict emotion analyst. You explain emotions only using evidence from the text."
#         },
#         {
#             "role": "user",
#             "content": (
#                 f"Journal Entry:\n{text}\n\n"
#                 f"Detected emotions:\n{mood_text}\n\n"
#                 "Task:\n"
#                 "Explain why these emotions appear.\n\n"
#                 "Rules:\n"
#                 "- 1 to 2 sentences only\n"
#                 "- Must reference or quote exact phrases from the journal\n"
#             )
#         }
#     ]

#     # Qwen chat template
#     input_ids = tokenizer.apply_chat_template(
#         messages,
#         tokenize=True,
#         add_generation_prompt=True,
#         return_tensors="pt"
#     ).to(model.device)

#     with torch.no_grad():
#         outputs = model.generate(
#             input_ids,
#             max_new_tokens=120,
#             temperature=0.7,
#             top_p=0.9,
#             do_sample=True
#         )

#     return tokenizer.decode(
#         outputs[0][input_ids.shape[-1]:],
#         skip_special_tokens=True
#     )

# def generate_mood_explanation(text, moods):
#     tokenizer, model = _loadExplain()
#     # prompt = build_prompt(text, moods)
#     # print("Prompt:", prompt)

#     mood_text = ", ".join(
#         [f"{m['label']} ({m['score']:.2f})" for m in moods]
#     )

#     messages = [
#         {
#             "role": "system",
#             "content": "You explain emotions strictly based on provided journal entries."
#         },
#         {
#             "role": "user",
#             "content": f"""
# Journal Entry:
# {text}

# Detected emotions:
# {mood_text}

# Task:
# Explain why these emotions appear using only evidence from the journal.

# Rules:
# - 1 to 2 sentences
# - must quote or refer to phrases in text
# """
#         }
#     ]

#     inputs = tokenizer.apply_chat_template(
#         messages,
#         add_generation_prompt=True,
#         return_tensors="pt"
#     ).to(model.device)

#     outputs = model.generate(
#         inputs,
#         max_new_tokens=120,
#         do_sample=True,
#         temperature=0.7
#     )

#     return tokenizer.decode(
#         outputs[0][inputs.shape[-1]:],
#         skip_special_tokens=True
#     )