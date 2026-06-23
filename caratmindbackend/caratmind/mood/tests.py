from django.test import TestCase

from mood.model_service import predict_mood

# Create your tests here.

# python manage.py shell < mood/test_local.py
# exit()

samples = [
    "Today I went to my class and learned something new. I only have one class today and I had to spend more than 2 hours to go to class. It is so tiring to go to only one class a day.", 
    "I am very happy today because I got to eat potato chips.", 
    "I will get my semester results later this week, I am so afraid of the results"
]

# annoyance
# happy
# anxious 

for text in samples:
    result = predict_mood(text)
    print(result)
    print(f"  Text: {text}")
    print(f"  Mood: {result['mood']} ({result['mood_confidence']})")
    print(f"  All above threshold: {result['mood_explain']}")