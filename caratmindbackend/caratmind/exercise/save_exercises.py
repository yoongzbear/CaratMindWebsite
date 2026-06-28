# upload coping exercises to dynamodb
# python manage.py seed_exercise
from django.core.management.base import BaseCommand
import boto3
import uuid

from caratmind import settings

def _get_table():
        resource = boto3.resource('dynamodb', region_name=settings.DYNAMODB_REGION)
        return resource.Table(settings.DYNAMODB_EXERCISE_TABLE)

class Command(BaseCommand):
    help = "Seed Exercise table in DynamoDB"

    def handle(self, *args, **kwargs):
        table = _get_table()

        items = [
            {
                "exc_id": "value-auto generate",
                "exc_name": "Basic Breathing Technique",
                "exc_type": "breathing",
                "exc_mood": "all",
                "exc_desc": "A breathing technique to help calm the body by focusing on slow, controlled breathing that relaxes muscles and reduces tension. Practicing it every 1 to 2 hours can improve focus and ease stress.",
                "exc_steps": [
                    "Stay in a relaxed state and drop your shoulders.",
                    "Breathe in through your nose and inflate your stomach in 4 to 5 seconds.",
                    "Breathe out in 4 to 5 seconds through your nose or mouth and deflate your stomach.",
                    "Repeat 5 times in a set."                    
                ]                
            },
            {
                "exc_id": "EX002",
                "exc_name": "4-7-8 Breathing",
                "exc_desc": "A breathing pattern..."
            }
        ]

        with table.batch_writer() as batch:
            for item in items:
                item["exc_id"] = str(uuid.uuid4())
                batch.put_item(Item=item)

        self.stdout.write(self.style.SUCCESS("Exercise table seeded successfully"))