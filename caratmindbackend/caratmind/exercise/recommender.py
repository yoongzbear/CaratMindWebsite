# orchestrator: KB lookup -> rule engine -> top-N picks

import logging

from .dynamodb_service import (
    get_exercises_for_mood,
    save_exercise_recommendation,
    get_recent_exc_names,
)
from .rules import pick_best_exercise

logger = logging.getLogger(__name__)


def recommend_exercise(
    *,
    user_id: str,
    jrnl_id: str,
    mood_name: str,
    mood_confidence: float,
    is_mixed: bool,
) -> dict | None:
    candidates = get_exercises_for_mood(mood_name)  # knowledge-based
    recent_names = get_recent_exc_names(user_id, limit=5)

    exercise = pick_best_exercise(
        candidates,
        mood_name=mood_name,
        is_mixed=is_mixed,
        mood_confidence=mood_confidence,
        recent_exc_names=recent_names,
    )  # rule-based

    if exercise is None:
        logger.warning("No exercise candidates found for mood=%s", mood_name)
        return None

    try:
        save_exercise_recommendation(user_id, jrnl_id, mood_name, exercise)
    except Exception:
        logger.exception("Failed to persist exercise recommendation for jrnl_id=%s", jrnl_id)

    return exercise