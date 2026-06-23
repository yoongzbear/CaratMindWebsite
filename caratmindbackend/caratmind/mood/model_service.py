import re
import threading
from functools import lru_cache
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer, AutoModelForSequenceClassification, AutoModelForMultimodalLM
import torch

# detect mood
_lockDetect = threading.Lock()
_tokenizerDetect = None
_modelDetect = None
# generate explanation
_lockExplain = threading.Lock()
_tokenizerExplain = None
_modelExplain = None

DETECT_MODEL_NAME = "AnasAlokla/multilingual_go_emotions"
EXPLAIN_MODEL_NAME = "google/flan-t5-base"
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
    global _tokenizerExplain, _modelExplain
    if _modelExplain is None:
        with _lockExplain:
            if _modelExplain is None:  # double-checked locking
                _tokenizerExplain = AutoTokenizer.from_pretrained(EXPLAIN_MODEL_NAME)
                _modelExplain = AutoModelForSeq2SeqLM.from_pretrained(EXPLAIN_MODEL_NAME)
                _modelExplain.eval()
    return _tokenizerExplain, _modelExplain

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
def build_prompt(text, moods):
    mood_text = ", ".join(
        [f"{m['label']} ({m['score']:.2f})" for m in moods]
    )

    return f"""
Question: Why is the sky blue?

Answer:
"""

#     return f"""
# Journal Entry:
# {text}

# Detected emotions:
# {mood_text}

# Explain why these emotions were detected in 2-3 sentences.
# Focus only on evidence found in the journal entry.
# """

# generate feedback
def generate_mood_explanation(text, moods):
    tokenizer, model = _loadExplain()
    prompt = build_prompt(text, moods)
    print("Prompt:", prompt)

    inputs = tokenizer(
        prompt,
        return_tensors="pt",
        truncation=True,
        max_length=512
    )

    outputs = model.generate(
        **inputs,
        max_new_tokens=80,
        do_sample=False,
        num_beams=4,
        early_stopping=True
    )

    return tokenizer.decode(
        outputs[0],
        skip_special_tokens=True
    )