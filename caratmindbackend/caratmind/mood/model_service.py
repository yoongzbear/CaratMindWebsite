import logging
import os
import re
import requests
import threading
from functools import lru_cache
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
from llama_cpp import Llama
from django.conf import settings

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
# EXPLAIN_MODEL_PATH = "./models/qwen2.5-1.5b-instruct-q4_k_m.gguf"
NEUTRAL_LABEL = "neutral"
SECONDARY_THRESHOLD = 0.10 # below value considered as neutral
CONFIDENCE_THRESHOLD = 0.5 # below value considered as mixed feelings 
EXPLAIN_THRESHOLD = 0.3 # mood included in explanation = 0.15/0.2

def _loadDetect():
    global _tokenizerDetect, _modelDetect
    if _modelDetect is None:
        with _lockDetect:
            if _modelDetect is None:  # double-checked locking
                _tokenizerDetect = AutoTokenizer.from_pretrained(DETECT_MODEL_NAME)
                _modelDetect = AutoModelForSequenceClassification.from_pretrained(DETECT_MODEL_NAME)
                _modelDetect.eval()
    return _tokenizerDetect, _modelDetect

# def _loadExplain():
#     global _llmExplain
#     if _llmExplain is None:
#         with _lockExplain:
#             if _llmExplain is None:
#                 _llmExplain = Llama(
#                     model_path=EXPLAIN_MODEL_PATH,
#                     n_ctx=2048,        # context window
#                     # n_threads=4,       # tune to EC2 vCPU count
#                     n_threads=os.cpu_count(),
#                     verbose=False,
#                 )
#     return _llmExplain

def predict_mood(text: str, threshold: float = EXPLAIN_THRESHOLD) -> dict:
    """
    Multi-label emotion classification (go_emotions style).
    - returns a single dominant mood
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

    # above_threshold = [{"label": lbl, "score": round(s, 4)} for lbl, s in scored if s >= threshold]

    is_mixed = top_score < CONFIDENCE_THRESHOLD # true if the label with highest score has less than confidence threshold 
    # top_3 = [
    #     {"label": lbl, "score": round(s, 4)}
    #     for lbl, s in non_neutral
    #     if s >= threshold
    # ][:3]

    # if not top_3 and non_neutral:
    #     # fallback: still show the single highest-scoring non-neutral emotion
    #     top_3 = [{"label": non_neutral[0][0], "score": round(non_neutral[0][1], 4)}]

    explanation = generate_mood_explanation(
        text,
        top_label, 
        top_score, 
        is_mixed
    )

    return {
        "mood_name": top_label,
        "mood_confidence": round(top_score, 4),
        # "is_mixed": is_mixed,
        # "mood_top3": top_3,           
        "mood_explain": explanation, 
    }

# help clean feedback
def _clean_explanation(text: str) -> str:
    markers = ["Task:", "Rules:", "Journal Entry:", "Detected mood", "Is mood mixed:"]
    for marker in markers:
        idx = text.find(marker)
        if idx != -1:
            text = text[:idx]
    return text.strip()

# 2 sentence feedback
def cut_two_sentences(text: str) -> str:
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    return " ".join(sentences[:2])

# trim last incomplete sentence
def trim_explanation(text: str) -> str:
    text = text.strip()

    if text.endswith((".", "!", "?")):
        return text

    # get all complete sentences
    matches = list(re.finditer(r'[^.!?]+[.!?]', text))

    if matches:
        # keep everything up to the end of the last complete sentence
        return text[:matches[-1].end()].strip()

    # if no complete sentence at all
    return text

logger = logging.getLogger(__name__)

# generate feedback
def generate_mood_explanation(text, mood_label, mood_score, is_mixed):
    try:
        response = requests.post(
            f"{settings.LLM_SERVICE_URL}/explain",
            json={
                "text": text,
                "mood_label": mood_label,
                "mood_score": mood_score,
                "is_mixed": is_mixed,
            },
            timeout=30,
        )
        response.raise_for_status()
        return response.json()["explanation"]
    except requests.RequestException:
        logger.exception("LLM explanation service call failed")
        return "Unable to generate an explanation right now."
    # # short entry (10 words)
    # word_count = len(text.split())
    # if word_count < 10:
    #     return (
    #         f"Your entry is short, but it carries a tone that leans towards {mood_label}. "
    #         "Consider writing more next time for a deeper mood insight!"
    #     )

    # llm = _loadExplain()

    # messages = [
    #     {
    #         "role": "system",
    #         "content": (
    #             f"You explain the output of a mood classifier. The classifier has already selected the mood.\n"
    #             "Never disagree with the classifier. Do not evaluate whether the classifier is correct.\n"
    #             "Your only task is to explain which words or events in the journal support the detected mood."
    #         )
    #     },
    #     {
    #         "role": "user",
    #         "content": (
    #             f"Journal Entry:\n{text}\n\n"
    #             f"Detected mood:\n{mood_label}\n\n"
    #             # f"Detected mood confidence score:\n{mood_score}\n\n"
    #             # f"Is mood mixed:\n{is_mixed}\n\n"
    #             "Task:\n"
    #             "Explain what parts of the journal support this detected mood. Your only task is to explain which words or events in the journal support the detected mood.\n"
    #             "Rules:\n"
    #             "- Write exactly two sentences.\n"
    #             "- Only use information written in the journal.\n"
    #             "- Do not use bullet points.\n"
    #             "- Do not use numbered lists.\n"
    #             "- Do not write headings.\n"
    #             "- End after the second sentence.\n"
    #             "- End with a period.\n"
    #             "- Refer to the author as 'you'\n"
    #             "- Ensure the grammar is proper."
    #         )
    #     }
    # ]

    # output = llm.create_chat_completion(
    #     messages=messages,
    #     # max_tokens=120,
    #     max_tokens= 100, # lower token
    #     temperature=0.4,
    #     top_p=0.9,
    #     repeat_penalty=1.3,
    #     stop=["\nTask:", "\nRules:", "\nJournal Entry:", "\nDetected mood"], # stop when it starts to generate prompts
    # )

    # # return output["choices"][0]["message"]["content"]
    # raw_text = output["choices"][0]["message"]["content"]
    # cleaned = _clean_explanation(raw_text)
    # print(cleaned)
    # return trim_explanation(cleaned)
