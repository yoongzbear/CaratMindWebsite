from django.test import TestCase

# Create your tests here.
from exercise.recommender import recommend_exercise

# python manage.py shell < mood/test_local.py
# exit()

# (mood_name, mood_confidence)
samples = [
    ("joy", 0.91),
    ("anger", 0.85),
    ("sadness", 0.42),       # low confidence + mixed -> should bias low-intensity
    ("fear", 0.78),
    ("nonexistent_mood", 0.5),  # forces fallback path
]

for mood_name, confidence in samples:
    exercise = recommend_exercise(
        user_id="test-user-local",
        jrnl_id=f"test-jrnl-{mood_name}",
        mood_name=mood_name,
        mood_confidence=confidence,
    )
    print(f"\nmood={mood_name} confidence={confidence}")
    print("recommended:", exercise.get('exc_name') if exercise else None)