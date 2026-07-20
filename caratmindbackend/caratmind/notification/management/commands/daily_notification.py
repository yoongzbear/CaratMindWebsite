# journal and exercise reminders

from django.core.management.base import BaseCommand

from notification.dynamodb_service import check_exercise_reminder, check_journal_reminder, check_mood_helpline, get_enabled_users, maybe_send_weekly_habit_digest
# from notifications.service import NotificationService

class Command(BaseCommand):
    def handle(self, *args, **options):
        for user in get_enabled_users():
            check_journal_reminder(user)
            check_exercise_reminder(user)
            check_mood_helpline(user)
            maybe_send_weekly_habit_digest(user)