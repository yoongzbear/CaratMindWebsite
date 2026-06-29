# combine services

import logging

from exercise.recommender import recommend_exercise
from journal.dynamodb_service import update_journal_mood

from .model_service import predict_mood
from .dynamodb_service import create_mood

logger = logging.getLogger(__name__)

# detect mood --> save mood into db
def detect_store_mood(jrnl_id: str, user_id: str, entry_text: str) -> None:
    """
    Best-effort: never raise. A mood-detection failure should not
    block a journal save.
    """
    try:
        result = predict_mood(entry_text)
        # returns "mood_name","mood_confidence", "mood_explain", 
    
        # save in mood table
        mood_item = create_mood(jrnl_id, user_id, result)

        # update mood in journal entry db 
        update_journal_mood(jrnl_id, mood_item['mood_id'], mood_item['mood_name'])
    except Exception:
        logger.exception("Mood detection failed for jrnl_id=%s", jrnl_id)
        return

    # TODO: call exercise recommender here
    try:
        recommend_exercise(
            user_id=user_id,
            jrnl_id=jrnl_id,
            mood_name=mood_item['mood_name'],
            mood_confidence=float(mood_item['mood_confidence']),
            is_mixed=result.get('is_mixed', False),
        )
    except Exception:
        logger.exception("Exercise recommendation failed for jrnl_id=%s", jrnl_id)
