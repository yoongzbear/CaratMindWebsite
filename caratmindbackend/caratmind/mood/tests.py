from django.test import TestCase

from exercise.recommender import recommend_exercise
from mood.model_service import predict_mood

# Create your tests here.

# python manage.py shell < mood/test_local.py
# exit()

samples_1 = [
    "Today I went to my class and learned something new. I only have one class today and I had to spend more than 2 hours to go to class. It is so tiring to go to only one class a day.", 
    "I am very happy today because I got to eat potato chips.", # joy
    "I will get my semester results later this week, I am so afraid of the results", 
    "hello my name is vernon"
]

samples = [    
    "I got chocolate as reward from my lecturer for answering the questions, but I feel a bit bad for stealing my classmate's chance of getting one because I answered the question he was answering"
]

def run_samples(samples):
    for text in samples:
        result = predict_mood(text)
        print("predict mood", result)
        exercise = recommend_exercise(user_id="test-user-local", mood_name=result['mood_name'], mood_confidence=result['mood_confidence'])
        print("recommended:", exercise.get('exc_name') if exercise else None)

run_samples(samples_1)

def run_test(text):
    result = predict_mood(text)
    # print("predict mood", result)
    exercise = recommend_exercise(user_id="a5edc5c8-2021-70d7-750c-8b2ca8096def", mood_name=result['mood_name'], mood_confidence=result['mood_confidence'])
    print("recommended:", exercise.get('exc_name') if exercise else None)

run_test("hello my name is vernon")

# 160 words
samples = [    
    "I woke up very early today at 6AM and got ready with makeup on. After having breakfast, we went to Singapore and crossed the border. The view was stunning across Johor Bahru and Singapore. Then, we went straight to Singapore Oceanarium where I saw so many aquatic animals like jellyfish and sharks. Love them very much, except for one jellyfish that looked like they had too many tangled plastics around them and made me feel sick. Other than that, I felt content from that trip. We then went to eat our favorite rojak at Ayer Rajah Food Court. It costed $30 which was like RM100 but it was delicious! After our lunch, we went to meet our grandmother who was recently discharged from hospital because of sudden inability to breathe. Cannot believe she is 90 years old. She was excited to meet us since it has been a year since we met her. Hope I can still meet her soon."
]
