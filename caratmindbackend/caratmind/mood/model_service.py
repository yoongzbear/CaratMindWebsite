import logging
import re
import requests
import threading
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
from caratmind import settings

# detect mood
_lockDetect = threading.Lock()
_tokenizerDetect = None
_modelDetect = None

DETECT_MODEL_NAME = "AnasAlokla/multilingual_go_emotions"
NEUTRAL_LABEL = "neutral"
SECONDARY_THRESHOLD = 0.10 # below value considered as neutral
CONFIDENCE_THRESHOLD = 0.5 # below value considered as mixed feelings 

def _loadDetect():
    global _tokenizerDetect, _modelDetect
    if _modelDetect is None:
        with _lockDetect:
            if _modelDetect is None:  # double-checked locking
                _tokenizerDetect = AutoTokenizer.from_pretrained(DETECT_MODEL_NAME)
                _modelDetect = AutoModelForSequenceClassification.from_pretrained(DETECT_MODEL_NAME)
                _modelDetect.eval()
    return _tokenizerDetect, _modelDetect

def predict_mood(text: str) -> dict:
    tokenizer, model = _loadDetect()

    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        max_length=512,
    )

    with torch.no_grad():
        logits = model(**inputs).logits
        probs = torch.sigmoid(logits)[0]  # multi-label -> sigmoid, not softmax

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

    is_mixed = top_score < CONFIDENCE_THRESHOLD 
    # true if the label with highest score has less than confidence threshold 

    explanation = generate_mood_explanation(
        text,
        top_label, 
        top_score, 
        is_mixed
    )

    return {
        "mood_name": top_label,
        "mood_confidence": round(top_score, 4),
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
            timeout=90,
        )
        response.raise_for_status()
        return response.json()["explanation"]
    except requests.RequestException:
        logger.exception("LLM explanation service call failed")
        return "Unable to generate an explanation right now."