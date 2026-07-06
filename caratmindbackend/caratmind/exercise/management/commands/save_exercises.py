# upload coping exercises to dynamodb
# python manage.py save_exercise
from django.core.management.base import BaseCommand
import boto3
import uuid

from caratmind import settings

def _get_table():
        resource = boto3.resource('dynamodb', region_name=settings.DYNAMODB_REGION)
        return resource.Table(settings.DYNAMODB_EXERCISE_TABLE)

class Command(BaseCommand):
    help = "Save EXERCISE table in DynamoDB"

    def handle(self, *args, **kwargs):
        table = _get_table()

        items = [
            {
                "exc_name": "Basic Breathing Technique",
                "exc_type": "breathing",
                "exc_mood": [
                    "admiration",
                    "amusement",
                    "anger",
                    "annoyance",
                    "approval",
                    "caring",
                    "confusion",
                    "curiosity",
                    "desire",
                    "disappointment",
                    "disapproval",
                    "disgust",
                    "embarrassment",
                    "excitement",
                    "fear",
                    "gratitude",
                    "grief",
                    "joy",
                    "love",
                    "nervousness",
                    "neutral",
                    "optimism",
                    "pride",
                    "realization",
                    "relief",
                    "remorse",
                    "sadness",
                    "surprise"      
                ],
                "exc_desc": "A breathing technique to help calm the body by focusing on slow, controlled breathing that relaxes muscles and reduces tension. Practicing it every 1 to 2 hours can improve focus and ease stress.",
                "exc_steps": [
                    "Sit comfortably with your shoulders, head and neck relaxed.",
                    "Breathe out deeply through your mouth to exhale leftover air.",
                    "Breathe in through your nose for 4 to 5 seconds.",
                    "Breathe out for 4 to 5 seconds through your nose or mouth.",
                    "Repeat 5 times in a set."                    
                ]                
            },
            {
                "exc_name": "Deep Breathing Technique",
                "exc_type": "breathing",
                "exc_mood": [
                    "anger",
                    "annoyance",
                    "caring",
                    "confusion",
                    "curiosity",
                    "disappointment",
                    "disapproval",
                    "disgust",
                    "embarrassment",
                    "fear",
                    "grief",                    
                    "joy",
                    "love",
                    "nervousness",
                    "neutral",
                    "relief",
                    "remorse",
                    "sadness",
                ],
                "exc_desc": "A breathing technique that uses slow, measured breathing with a longer breath-hold to deepen relaxation and improve lung capacity. It helps regulate stress and promotes calm focus.",
                "exc_steps": [
                    "Sit comfortably with your shoulders, head and neck relaxed.",
                    "Breathe out deeply through your mouth to exhale leftover air.",
                    "Breathe in for 4 seconds.",
                    "Hold your breath for 16 seconds.",
                    "Breathe out for 8 seconds through your mouth.",
                    "Repeat 3 times in a set."
                ]  
            }, 
            {
                "exc_name": "Cyclic Sighing",
                "exc_type": "breathing",
                "exc_mood": [
                    "anger",
                    "annoyance",
                    "caring",
                    "confusion",
                    "curiosity",
                    "disappointment",
                    "disapproval",
                    "disgust",
                    "embarrassment",
                    "fear",
                    "grief",                    
                    "joy",
                    "love",
                    "nervousness",
                    "neutral",
                    "relief",
                    "remorse",
                    "sadness",
                ],
                "exc_desc": "A breathing technique that involves double deep inhalations followed by relatively longer exhalations. It resets the respiratory rate and provides psychological relief.",
                "exc_steps": [
                    "Sit comfortably with your shoulders, head and neck relaxed.",
                    "Breathe out deeply through your mouth to exhale leftover air.",
                    "Breathe in through your nose.",
                    "Without breathing out, take another deeper breath to fully expand your lungs.",
                    "Slowly breathe out all the air through your mouth.",
                    "Repeat for 5 minutes."
                ]  
            }, 
            {
                "exc_name": "Box Breathing",
                "exc_type": "breathing",
                "exc_mood": [
                    "anger",
                    "annoyance",
                    "disappointment",
                    "disapproval",
                    "disgust",
                    "embarrassment",
                    "fear",
                    "grief",
                    "nervousness",
                    "neutral",
                    "remorse",
                    "sadness",
                ],
                "exc_desc": "A breathing technique that uses equal inhale, hold, and exhale ratios. It improves mood and stress regulation.",
                "exc_steps": [
                    "Sit comfortably with your shoulders, head and neck relaxed.",
                    "Breathe out deeply through your mouth to exhale leftover air.",
                    "Breathe in for 4 seconds.",
                    "Hold your breath for 4 seconds.",
                    "Slowly breathe out for 4 seconds.",
                    "Wait for 4 seconds before breathing in again.",
                    "Repeat until you feel re-centered."
                ]  
            }, 
            {
                "exc_name": "Coherent Breathing",
                "exc_type": "breathing",
                "exc_mood": [
                    "anger",
                    "annoyance",
                    "confusion",
                    "curiosity",
                    "disappointment",
                    "disgust",
                    "fear",
                    "grief",
                    "joy",
                    "nervousness",
                    "neutral",
                    "optimism",
                    "realization",
                    "relief",
                    "remorse",
                    "sadness",
                ],
                "exc_desc": "A breathing technique that involves taking five to six times of breathing in and out per minute. It helps to increase alertness and improve anxiety and depressive symptoms.",
                "exc_steps": [
                    "Sit comfortably with your shoulders, head and neck relaxed.",
                    "Breathe in and out normally and count the length of each inhale and exhale.",
                    "Breathe in for 4 seconds and out for 4 seconds. Repeat for 1 minute.",
                    "Repeat but extend breathing in and out to 5 seconds.",
                    "Repeat but extend breathing in and out to 6 seconds."
                ]  
            }, 
            {
                "exc_name": "Diaphragmatic Breathing",
                "exc_type": "breathing",
                "exc_mood": [
                    "anger",
                    "annoyance",
                    "confusion",
                    "curiosity",
                    "disappointment",
                    "embarrassment",
                    "fear",
                    "nervousness",
                    "neutral",
                    "optimism",
                    "realization",
                    "relief",
                    "remorse",
                    "sadness",
                ],
                "exc_desc": "A breathing technique that uses deep inhalation focusing on the inhaling with maximum diaphragm movement. It increases sustained attention and reduces stress.",
                "exc_steps": [
                    "Sit comfortably with your shoulders, head and neck relaxed.",
                    "Breathe out deeply through your mouth to exhale leftover air.",
                    "Place one hand on your upper chest and the other just below your rib cage to feel your diaphragm move as you breathe.",
                    "Breathe in slowly through your nose so that your stomach moves out against your hand. The hand on your chest should remain as still as possible.",
                    "Tighten your stomach muscles, so that your stomach moves back in, as you breathe out through pursed lips. The hand on your upper chest must remain as still as possible.",
                    "Repeat for 5 to 10 minutes."
                ]  
            }, 
            {
                "exc_name": "4-7-8 Breathing",
                "exc_type": "breathing",
                "exc_mood": [
                    "anger",
                    "annoyance",
                    "confusion",
                    "curiosity",
                    "disappointment",
                    "embarrassment",
                    "fear",
                    "nervousness",
                    "neutral",
                    "optimism",
                    "realization",
                    "relief",
                    "remorse",
                    "sadness",
                ],
                "exc_desc": "A breathing pattern with four seconds of inhalation, seven seconds of holding breath, and eight seconds of exhalation. It reduces anxiety levels.",
                "exc_steps": [
                    "Sit comfortably with your shoulders, head and neck relaxed.",
                    "Breathe out deeply through your mouth to exhale leftover air.",
                    "Breathe in through your nose for 4 seconds.",
                    "Hold your breath for 7 seconds.",
                    "Breathe out through your mouth for 8 seconds.",
                    "Repeat for 3 more times."
                ]  
            }, 
            {
                "exc_name": "Gratitude Letter Writing",
                "exc_type": "positivity",
                "exc_mood": [
                    "admiration",
                    "amusement",
                    "approval",
                    "caring",
                    "curiosity",
                    "desire",
                    "excitement",
                    "gratitude",
                    "joy",
                    "love",
                    "neutral",
                    "optimism",
                    "pride",
                    "realization",
                    "relief",
                    "surprise"      
                ],
                "exc_desc": "Reflect and express your appreciation toward someone who has positively impacted your life. It helps to increase well-being, strengthen social bonds, and enhance positive emotions.",
                "exc_steps": [
                    "Think of a person who has made a meaningful positive impact on your life but you may not have properly thanked.",
                    "Reflect on specific things they did and how it affected you emotionally or personally.",
                    "Write a heartfelt letter expressing your gratitude in detail.",
                    "Describe specific actions and why they were important to you.",
                    "If possible, read the letter to them in person or send it to them."
                ]  
            }, 
            {
                "exc_name": "Act of Kindness",
                "exc_type": "positivity",
                "exc_mood": [
                    "admiration",
                    "amusement",
                    "approval",
                    "caring",
                    "curiosity",
                    "excitement",
                    "gratitude",
                    "joy",
                    "love",
                    "neutral",
                    "optimism",
                    "pride",
                ],
                "exc_desc": "Intentionally do something helpful or thoughtful for another person without expecting a reward in return. It helps to boost happiness, empathy, and overall life satisfaction.",
                "exc_steps": [
                    "Choose a simple kind action you can do today (e.g., helping someone or giving a compliment).",
                    "Be mindful of the person’s needs or situation before acting.",
                    "Perform the act sincerely without expecting reward or recognition.",               
                ]  
            }, 
            {
                "exc_name": "Body Scan",
                "exc_type": "mindfulness",
                "exc_mood": [
                    "anger",
                    "annoyance",
                    "approval",
                    "caring",
                    "confusion",
                    "curiosity",
                    "disappointment",
                    "disapproval",
                    "disgust",
                    "embarrassment",
                    "fear",
                    "gratitude",
                    "grief",
                    "love",
                    "nervousness",
                    "neutral",
                    "optimism",
                    "realization",
                    "relief",
                    "remorse",
                    "sadness",
                ],
                "exc_desc": "Mentally scan body and notice tense body parts to relax.",
                "exc_steps": [
                    "Sit comfortably in a space with no distractions.",
                    "Mentally scan your body from the head to toe.",
                    "Once identifying a tense, uncomfortable sensations, or aches on the body part, relax the muscles around it.",
                    "Repeat until the entire body has been mentally scanned through."
                ]  
            }, 
            {
                "exc_name": "Music Meditation",
                "exc_type": "meditation",
                "exc_mood": [
                    "anger",
                    "annoyance",
                    "caring",
                    "confusion",
                    "curiosity",
                    "disappointment",
                    "disapproval",
                    "disgust",
                    "embarrassment",
                    "fear",
                    "gratitude",
                    "grief",
                    "love",
                    "nervousness",
                    "neutral",
                    "optimism",
                    "realization",
                    "relief",
                    "remorse",
                    "sadness",
                ],
                "exc_desc": "Listen to music to help meditating if silence causes discomfort or restlessness.",
                "exc_steps": [
                    "Play suitable music that calms your mind such as 432 Hz music or white noise.",
                    "Sit or lie down comfortably in a relaxed state.",
                    "Focus on the rhythm, instruments and melody in the music.",
                    "If you get distracting thoughts, gently bring your focus back to the music.",
                    "Continue for 5 to 15 minutes."
                ]  
            }, 
            {
                "exc_name": "Grateful Listing",
                "exc_type": "positivity",
                "exc_mood": [
                    "admiration",
                    "amusement",
                    "approval",
                    "caring",
                    "curiosity",
                    "desire",
                    "embarrassment",
                    "excitement",
                    "gratitude",
                    "joy",
                    "love",
                    "nervousness",
                    "neutral",
                    "optimism",
                    "pride",
                    "realization",
                    "relief",
                    "surprise"      
                ],
                "exc_desc": "Write down things you are grateful for, including both positive experiences and challenges that have helped you grow. It encourages a balanced perspective, fosters appreciation, and promotes emotional well-being.",
                "exc_steps": [
                    "Sit comfortably in a space with no distractions.",
                    "Write down 3 to 5 things you are grateful for today, no matter how small or bad.",
                    "Include at least one challenge or difficult experience that taught you something or helped you grow.",
                    "For each grateful item, write one or two sentences explaining why you are grateful for it and how it has impacted you.",
                    "Read over your list and appreciate the positive aspects and lessons in your life."
                ]  
            },
            {
                "exc_name": "5-4-3-2-1 Grouding",
                "exc_type": "mindfulness",
                "exc_mood": [
                    "anger",
                    "annoyance",
                    "confusion",
                    "curiosity",
                    "disappointment",
                    "disapproval",
                    "disgust",
                    "embarrassment",
                    "fear",
                    "grief",
                    "nervousness",
                    "neutral",
                    "realization",
                    "relief",
                    "remorse",
                    "sadness",
                ],
                "exc_desc": "Pull your focus back from distracting thoughts to the present moment. It helps regulate your 5 senses including sight, hearing, touch, smell and taste.",
                "exc_steps": [
                    "Stay in a relaxed state. You can be standing, sitting, or lying down.",
                    "Name 5 things you can see.",
                    "Close your eyes and name 4 things you can hear.",
                    "Name 3 things you can feel.",
                    "Take a deep breath and name 2 things you can smell.",
                    "Name 1 thing you can taste."
                ]  
            },
            {
                "exc_name": "15 Minute Walk",
                "exc_type": "mindfulness",
                "exc_mood": [
                    "anger",
                    "annoyance",
                    "confusion",
                    "curiosity",
                    "disappointment",
                    "embarrassment",
                    "fear",
                    "gratitude",
                    "grief",
                    "joy",
                    "nervousness",
                    "neutral",
                    "optimism",
                    "pride",
                    "realization",
                    "relief",
                    "remorse",
                    "sadness",
                ],
                "exc_desc": "Go on a 15 minute break by walking to clear up your mind. It helps to reduce distracting and disorganized thoughts.",
                "exc_steps": [
                    "Choose a safe and comfortable place to walk.",
                    "Walk at a comfortable pace for 15 minutes.",
                    "Focus on your surroundings by noticing the view, sounds, and sensations around you.",
                    "Maintain steady and natural breathing as you walk."                    
                ]  
            }            
        ]

        with table.batch_writer() as batch:
            for item in items:
                item["exc_id"] = str(uuid.uuid4())
                batch.put_item(Item=item)

        self.stdout.write(self.style.SUCCESS("EXERCISE table saved successfully"))