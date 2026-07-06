# upload habit to dynamodb
# python manage.py save_habit
from django.core.management.base import BaseCommand
import boto3
import uuid

from caratmind import settings

def _get_table():
        resource = boto3.resource('dynamodb', region_name=settings.DYNAMODB_REGION)
        return resource.Table(settings.DYNAMODB_HABIT_TABLE)

class Command(BaseCommand):
    help = "Save HABIT table in DynamoDB"

    def handle(self, *args, **kwargs):
        table = _get_table()

        items = [
            {                
                "hab_question": "Have you drunk 8 cups of water today?",
                "hab_actions": [
                    {
                        "action": "Yes",
                        "status": "completed"
                    }, 
                    {
                        "action": "Halfway",
                        "status": "ongoing"
                    }, 
                    {
                        "action": "No",
                        "status": "incomplete"
                    }
                ]
            },
            {                
                "hab_question": "Did you get 8 hours of sleep?",
                "hab_actions": [
                    {
                        "action": "Yes",
                        "status": "completed"
                    }, 
                    {
                        "action": "No",
                        "status": "ongoing"
                    }
                ]
            },
            {                
                "hab_question": "Have you taken a 15-minute walk outdoor today?",
                "hab_actions": [
                    {
                        "action": "Yes",
                        "status": "completed"
                    }, 
                    {
                        "action": "Halfway",
                        "status": "ongoing"
                    }, 
                    {
                        "action": "No",
                        "status": "incomplete"
                    }
                ]
            },            
            {                
                "hab_question": "Did you perform a hobby today?",
                "hab_actions": [
                    {
                        "action": "Yes",
                        "status": "completed"
                    },  
                    {
                        "action": "No",
                        "status": "incomplete"
                    }
                ]
            },
            {                
                "hab_question": "Have you done a breathing exercise today?",
                "hab_actions": [
                    {
                        "action": "Yes",
                        "status": "completed"
                    }, 
                    {
                        "action": "Halfway",
                        "status": "ongoing"
                    }, 
                    {
                        "action": "No",
                        "status": "incomplete"
                    }
                ]
            },     
            {                
                "hab_question": "Have you talked or connected with another person today?",
                "hab_actions": [
                    {
                        "action": "Yes",
                        "status": "completed"
                    }, 
                    {
                        "action": "No",
                        "status": "incomplete"
                    }
                ]
            }, 
            {                
                "hab_question": "Did you perform an act of kindness today?",
                "hab_actions": [
                    {
                        "action": "Yes",
                        "status": "completed"
                    }, 
                    {
                        "action": "No",
                        "status": "incomplete"
                    }
                ]
            },  
            {                
                "hab_question": "Did you exercise for at least 30 minutes today?",
                "hab_actions": [
                    {
                        "action": "Yes",
                        "status": "completed"
                    }, 
                    {
                        "action": "Halfway",
                        "status": "ongoing"
                    }, 
                    {
                        "action": "No",
                        "status": "incomplete"
                    }
                ]
            }                     
        ]

        with table.batch_writer() as batch:
            for item in items:
                item["hab_id"] = str(uuid.uuid4())
                batch.put_item(Item=item)

        self.stdout.write(self.style.SUCCESS("HABIT table saved successfully"))
