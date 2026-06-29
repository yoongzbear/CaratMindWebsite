# rule-based filtering/ranking using context (confidence, history, mixed)

"""
Rule-based layer. Knowledge base (DynamoDB exc_mood tags) gives the
candidate pool for a mood; these rules pick the single best exercise
based on situational context — confidence, mixed mood, repetition.

type: 
breathing
positivity
mindfulness
meditation
"""

# Mood -> preferred exc_type priority order (domain/expert judgment).
MOOD_TYPE_PRIORITY = {
    "admiration": ["positivity", "breathing"],
    "amusement": ["positivity", "breathing"],
    "anger": ["mindfulness", "breathing", "meditation"],
    "annoyance": ["mindfulness", "breathing", "meditation"],
    "approval": ["positivity", "breathing", "mindfulness"],
    "caring": ["positivity", "breathing", "mindfulness", "meditation"],
    "confusion": ["mindfulness", "breathing", "meditation"],
    "curiosity": ["positivity", "breathing", "mindfulness", "meditation"],
    "desire": ["positivity", "breathing"],
    "disappointment": ["meditation", "breathing", "mindfulness"],
    "disapproval": ["meditation", "breathing", "mindfulness"],
    "disgust": ["meditation", "breathing", "mindfulness"],
    "embarrassment": ["positivity", "breathing", "mindfulness", "meditation"],
    "excitement": ["positivity", "breathing"],
    "fear": ["breathing", "mindfulness", "meditation"],
    "gratitude": ["positivity", "breathing", "mindfulness", "meditation"],
    "grief": ["breathing", "mindfulness", "meditation"],
    "joy": ["positivity", "breathing", "mindfulness"],
    "love": ["positivity", "breathing", "mindfulness", "meditation"],
    "nervousness": ["positivity", "breathing", "mindfulness", "meditation"],
    "neutral": ["positivity", "breathing", "mindfulness", "meditation"],
    "optimism": ["positivity", "breathing", "mindfulness", "meditation"],
    "pride": ["positivity", "breathing", "mindfulness"],
    "realization": ["positivity", "breathing", "mindfulness", "meditation"],
    "relief": ["positivity", "breathing", "mindfulness", "meditation"],
    "remorse": ["breathing", "mindfulness", "meditation"],
    "sadness": ["breathing", "mindfulness", "meditation"],
    "surprise": ["positivity", "breathing"],
}
DEFAULT_TYPE_PRIORITY = ["breathing", "mindfulness"]

LOW_INTENSITY_TYPES = {"breathing", "mindfulness"}


def _type_rank(exc_type: str, priority_list: list[str]) -> int:
    try:
        return priority_list.index(exc_type)
    except ValueError:
        return len(priority_list)


def pick_best_exercise(
    candidates: list[dict],
    *,
    mood_name: str,
    is_mixed: bool,
    mood_confidence: float,
    recent_exc_names: list[str],
) -> dict | None:
    """
    Rules applied:
    1. Exclude recently-recommended exercises; fall back to allowing
       repeats if everything was filtered out (or pool was empty).
    2. Rank by the mood's preferred exc_type priority order.
    3. If mood is mixed/low-confidence, bias toward low-intensity types.
    Returns the single best match, or None if no candidates exist at all.
    """
    if not candidates:
        return None

    pool = [c for c in candidates if c['exc_name'] not in recent_exc_names]
    if not pool:
        pool = candidates

    priority_list = MOOD_TYPE_PRIORITY.get(mood_name, DEFAULT_TYPE_PRIORITY)
    uncertain = is_mixed or mood_confidence < 0.5

    def score(c: dict) -> tuple:
        type_score = -_type_rank(c.get('exc_type', ''), priority_list)
        uncertainty_bonus = 0.5 if (uncertain and c.get('exc_type') in LOW_INTENSITY_TYPES) else 0
        return (type_score + uncertainty_bonus,)

    ranked = sorted(pool, key=score, reverse=True)
    return ranked[0]