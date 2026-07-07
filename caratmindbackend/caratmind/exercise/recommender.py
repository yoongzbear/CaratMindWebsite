# orchestrator: db lookup -> rule -> top-N picks

import logging

from .dynamodb_service import (
    get_default_exercise,
    get_exercises_for_mood,
    create_exercise_recommendation,
    get_recent_exc_names,
)
from .rules import pick_best_exercise

logger = logging.getLogger(__name__)

def recommend_exercise(
    *,
    user_id: str,
    mood_name: str,
    mood_confidence: float,
) -> dict | None:
    candidates = get_exercises_for_mood(mood_name)  # knowledge base
    recent_names = get_recent_exc_names(user_id, limit=5)

    # rule-based
    exercise = pick_best_exercise(
        candidates,
        mood_name=mood_name,
        mood_confidence=mood_confidence,
        recent_exc_names=recent_names,
    )

    if exercise is None:
        logger.info("No candidates for mood=%s, falling back to default breathing exercise", mood_name)
        exercise = get_default_exercise()

    # cannot find default exercise
    if exercise is None:
        logger.error("Fallback exercise '%s' not found in table", "Basic Breathing Technique")
        return None

    # try:
    #     create_exercise_recommendation(user_id, jrnl_id, mood_name, exercise)
    # except Exception:
    #     logger.exception("Failed to persist exercise recommendation for jrnl_id=%s", jrnl_id)

    return exercise