import threading
from functools import lru_cache
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

_lock = threading.Lock()
_tokenizer = None
_model = None

MODEL_NAME = "AnasAlokla/multilingual_go_emotions"
NEUTRAL_LABEL = "neutral"
SECONDARY_THRESHOLD = 0.10 # below value considered as neutral
CONFIDENCE_THRESHOLD = 0.5 # below value considered as mixed feelings 
EXPLAIN_THRESHOLD = 0.3 # mood included in explanation 

def _load():
    global _tokenizer, _model
    if _model is None:
        with _lock:
            if _model is None:  # double-checked locking
                _tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
                _model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)
                _model.eval()
    return _tokenizer, _model

def predict_mood(text: str, threshold: float = EXPLAIN_THRESHOLD) -> dict:
    """
    Multi-label emotion classification (go_emotions style).
    - If the model is confident (top score >= CONFIDENCE_THRESHOLD), returns
      a single dominant mood.
    - If not confident, returns is_mixed=True with the top 3 labels instead
      of forcing one label.
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
        probs = torch.sigmoid(logits)[0]  # multi-label (an instance can have multiple classes simultaneously) -> sigmoid, not softmax

    id2label = model.config.id2label
    scored = sorted(
        ((id2label[i], float(p)) for i, p in enumerate(probs)),
        key=lambda x: x[1],
        reverse=True,
    )

    # result_full = sorted(
    #     ((id2label[i], float(p)) for i, p in enumerate(probs)),
    #     key=lambda x: x[1],
    #     reverse=True,
    # )
    # print(result_full[:5])  # top 5 labels with raw scores

    # top_label, top_score = scored[0]    

    # non_neutral = [(lbl, s) for lbl, s in scored if lbl != NEUTRAL_LABEL]
    # if non_neutral and non_neutral[0][1] >= SECONDARY_THRESHOLD:
    #     top_label, top_score = non_neutral[0]
    # else:
    #     top_label, top_score = scored[0]

    # above_threshold = [{"label": lbl, "score": s} for lbl, s in scored if s >= threshold]

    # Don't let "neutral" auto-win over a weak-but-present specific emotion
    non_neutral = [(lbl, s) for lbl, s in scored if lbl != NEUTRAL_LABEL]
    if non_neutral and non_neutral[0][1] >= SECONDARY_THRESHOLD:
        top_label, top_score = non_neutral[0]
    else:
        top_label, top_score = scored[0]

    above_threshold = [{"label": lbl, "score": round(s, 4)} for lbl, s in scored if s >= threshold]

    is_mixed = top_score < CONFIDENCE_THRESHOLD
    top_3 = [{"label": lbl, "score": round(s, 4)} for lbl, s in non_neutral[:3]]

    return {
        "mood": top_label if not is_mixed else None,
        "mood_confidence": round(top_score, 4),
        "is_mixed": is_mixed,
        "mood_top3": top_3,           # always populated, use when is_mixed=True
        "mood_explain": above_threshold,  # full breakdown for debugging/UI detail view
    }

    # return {
    #     "mood": top_label,
    #     "mood_confidence": round(top_score, 4),
    #     "mood_explain": above_threshold,  # full breakdown, useful for UI/debugging
    #     # TODO: FLAN-T5 small model for clearer explanation
    # }
