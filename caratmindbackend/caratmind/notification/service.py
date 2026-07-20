# import boto3
# import logging
# from datetime import datetime, timedelta
# from zoneinfo import ZoneInfo
# from boto3.dynamodb.conditions import Key
# from django.conf import settings
# # from notifications.ses_service import send_notification

# logger = logging.getLogger(__name__)
# dynamodb = boto3.resource("dynamodb", region_name=settings.AWS_REGION)

# MYT = ZoneInfo("Asia/Kuala_Lumpur")


# class NotificationService:
#     def __init__(self):
#         self.users_table = dynamodb.Table("Users")
#         self.journals_table = dynamodb.Table("Journals")
#         self.exercises_table = dynamodb.Table("ExerciseLogs")
#         self.log_table = dynamodb.Table("NotificationLog")

#     # ---------- user iteration ----------

#     def get_active_users(self):
#         """Scan Users table for users with notifications enabled.
#         Swap for a GSI query if this table grows large enough that
#         a full scan becomes slow/expensive."""
#         response = self.users_table.scan(
#             FilterExpression="attribute_exists(email) AND notification_prefs.journal = :true_val",
#             ExpressionAttributeValues={":true_val": True},
#         )
#         return response.get("Items", [])

#     # ---------- dedup ----------

#     def already_notified(self, user, notif_type, window="daily"):
#         today = self._local_today(user)
#         sk = f"{notif_type}#{today.isoformat()}" if window == "daily" else f"{notif_type}#{self._local_week(user)}"
#         result = self.log_table.get_item(Key={"user_id": user["user_id"], "notif_type_date": sk})
#         return "Item" in result

#     def _mark_notified(self, user, notif_type, window="daily"):
#         today = self._local_today(user)
#         sk = f"{notif_type}#{today.isoformat()}" if window == "daily" else f"{notif_type}#{self._local_week(user)}"
#         ttl = int((datetime.now(MYT) + timedelta(days=30)).timestamp())
#         self.log_table.put_item(Item={
#             "user_id": user["user_id"],
#             "notif_type_date": sk,
#             "sent_at": datetime.now(MYT).isoformat(),
#             "ttl": ttl,
#         })

#     def _local_today(self, user):
#         tz = ZoneInfo(user.get("timezone", "Asia/Kuala_Lumpur"))
#         return datetime.now(tz).date()

#     def _local_week(self, user):
#         # ISO year-week string, e.g. "2026-W29"
#         d = self._local_today(user)
#         return f"{d.isocalendar()[0]}-W{d.isocalendar()[1]}"

#     # ---------- checks ----------

#     def check_journal_reminder(self, user):
#         today = self._local_today(user)
#         result = self.journals_table.query(
#             KeyConditionExpression=Key("user_id").eq(user["user_id"]) & Key("date").eq(today.isoformat())
#         )
#         if not result.get("Items"):
#             send_notification_email(user["email"], "journal-reminder", {"name": user.get("name", "")})
#             self._mark_notified(user, "journal_reminder")

#     def check_exercise_reminder(self, user):
#         today = self._local_today(user)
#         has_journal = self.journals_table.query(
#             KeyConditionExpression=Key("user_id").eq(user["user_id"]) & Key("date").eq(today.isoformat())
#         ).get("Items")
#         if not has_journal:
#             return  # only nudge exercise if they've journaled today
#         has_exercise = self.exercises_table.query(
#             KeyConditionExpression=Key("user_id").eq(user["user_id"]) & Key("date").eq(today.isoformat())
#         ).get("Items")
#         if not has_exercise:
#             send_notification_email(user["email"], "exercise-reminder", {"name": user.get("name", "")})
#             self._mark_notified(user, "exercise_reminder")

#     def check_mood_helpline(self, user):
#         # Called from the daily batch as a safety net in case the
#         # event-triggered send (on journal submit) was ever missed.
#         if self.already_notified(user, "mood_helpline"):
#             return
#         # ... reuse your existing has_negative_streak() logic here

#     def maybe_send_weekly_habit_digest(self):
#         if datetime.now(MYT).weekday() != 6:  # Sunday
#             return
#         for user in self.get_active_users():
#             if self.already_notified(user, "habit_digest", window="weekly"):
#                 continue
#             stats = self._get_habit_stats(user)
#             send_notification_email(user["email"], "habit-digest", stats)
#             self._mark_notified(user, "habit_digest", window="weekly")

#     def _get_habit_stats(self, user):
#         # ... pull from your habit streak logic
#         return {"name": user.get("name", "")}