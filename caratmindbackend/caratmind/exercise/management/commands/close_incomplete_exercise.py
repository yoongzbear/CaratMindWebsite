from django.core.management.base import BaseCommand

from caratmind.datetime_utils import today_local
from exercise.dynamodb_service import close_daily_incomplete_exercises, close_prev_incomplete_exercises
class Command(BaseCommand):
    def handle(self, *args, **options):
        today_str = today_local().isoformat()
        today_count = close_daily_incomplete_exercises(today_str)
        self.stdout.write(f"Closed out {today_count} incomplete exercises for {today_str}")
        prev_count = close_prev_incomplete_exercises(today_str)
        self.stdout.write(f"Closed out {prev_count} incomplete exercises before {today_str}")