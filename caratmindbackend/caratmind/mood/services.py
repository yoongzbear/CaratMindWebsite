# combine services

import logging

from .model_service import predict_mood
from .dynamodb_service import create_mood_entry

logger = logging.getLogger(__name__)

# detect mood --> save mood into db
def detect_store_mood(jrnl_id: str, user_id: str, entry_text: str) -> None:
    """
    Best-effort: never raise. A mood-detection failure should not
    block a journal save.
    """
    try:
        result = predict_mood(entry_text)
        create_mood_entry(jrnl_id, user_id, result)
    except Exception:
        logger.exception("Mood detection failed for jrnl_id=%s", jrnl_id)