import threading
from functools import lru_cache
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

_lock = threading.Lock()
_tokenizer = None
_model = None

MODEL_NAME = "AnasAlokla/multilingual_go_emotions"

def _load():
    global _tokenizer, _model
    if _model is None:
        with _lock:
            if _model is None:  # double-checked locking
                _tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
                _model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)
                _model.eval()
    return _tokenizer, _model

def predict_mood(text: str, threshold: float = 0.3) -> dict:
    """
    Multi-label emotion classification (go_emotions style).
    Returns the dominant label + confidence, plus all labels above threshold.
    """
    tokenizer, model = _load()

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

    top_label, top_score = scored[0]
    above_threshold = [{"label": lbl, "score": s} for lbl, s in scored if s >= threshold]

    return {
        "mood": top_label,
        "mood_confidence": round(top_score, 4),
        "mood_explain": above_threshold,  # full breakdown, useful for UI/debugging
        # TODO: FLAN-T5 small model for clearer explanation
    }
