# combine services

import logging

from exercise.dynamodb_service import create_exercise_recommendation
from exercise.recommender import recommend_exercise
from journal.dynamodb_service import update_journal_mood_exc

from .model_service import predict_mood
from .dynamodb_service import create_mood

logger = logging.getLogger(__name__)

# detect mood --> save mood into db
def detect_store_mood(jrnl_id: str, user_id: str, entry_text: str) -> None:
    """
    Best-effort: never raise. A mood-detection failure should not
    block a journal save.
    """
    # predict mood
    try:
        result = predict_mood(entry_text)
        # returns "mood_name","mood_confidence", "mood_explain", 
    
        # save in mood table
        # mood_item = create_mood(jrnl_id, user_id, result)

        # update mood in journal entry db 
        # update_journal_mood(jrnl_id, mood_item['mood_id'], mood_item['mood_name'])
        # update_journal_mood_exc
    except Exception:
        logger.exception("Mood detection failed for jrnl_id=%s", jrnl_id)
        return

    # recommend exercise
    exercise = None
    try:
        exercise = recommend_exercise(
            user_id=user_id,
            # jrnl_id=jrnl_id,
            mood_name=result['mood_name'],
            mood_confidence=float(result['mood_confidence']),
            # is_mixed=result.get('is_mixed', False),
        )
    except Exception:
        logger.exception("Exercise recommendation failed for jrnl_id=%s", jrnl_id)

    # save mood and exercise
    try:
        # save mood
        mood_item = create_mood(jrnl_id, user_id, result)
        # save exercise
        uex_id = None
        exc_name = None
        if exercise is not None:
            uex_item = create_exercise_recommendation(user_id, jrnl_id, exercise)
            uex_id = uex_item['uex_id']
            exc_name = uex_item['exc_name']

        # update journal
        update_journal_mood_exc(
            jrnl_id,
            mood_item['mood_id'],
            mood_item['mood_name'],
            uex_id,
            exc_name,
        )
    except Exception:
        logger.exception("Saving mood/exercise failed for jrnl_id=%s", jrnl_id)
