# park here first

# SES email templates

# send_notification(user["email"], "TemplateName", {"name": user.get("name", "")})

import boto3
from botocore.exceptions import ClientError

# from caratmind import settings

ses = boto3.client("ses", region_name="ap-southeast-5")

TEMPLATES = [ 
    {
      "TemplateName": "journal_reminder",
      "SubjectPart": "Don't forget to journal today!",
      "HtmlPart": """
      <html>
        <body style="font-family: -apple-system, sans-serif; background:#f7f5f2; padding:24px;">
          <div style="max-width:480px; margin:0 auto; background:#fff; border-radius:12px; padding:32px;">
            <h2 style="color:#2d2a26;">Hello {{name}},</h2>
            <p style="color:#5a5652; line-height:1.6;">
              You haven't written a journal entry today. Even a couple of sentences can help
              you notice patterns in your mood and get a recommended coping exercise to relieve your well-being.
            </p>
            <a href="https://caratmind.app/journal/new"
              style="display:inline-block; margin-top:16px; padding:12px 24px;
                      background:#6b5b95; color:#fff; text-decoration:none; border-radius:8px;">
              Write an entry
            </a>
            <p style="color:#a8a29c; font-size:12px; margin-top:32px;">
              <a href="https://caratmind.app/profile" style="color:#a8a29c;">
                Manage notification preferences
              </a>
            </p>
          </div>
        </body>
      #   
      </html>
      """,
      "TextPart": "Hi {{name}}, you haven't journaled yet today. Take a few minutes: https://caratmind.app/journal/new",
    },
    {
      "TemplateName": "exercise_reminder",
      "SubjectPart": "Don't forget to do coping exercise today!",
      "HtmlPart": """
      <html>
        <body style="font-family: -apple-system, sans-serif; background:#f7f5f2; padding:24px;">
          <div style="max-width:480px; margin:0 auto; background:#fff; border-radius:12px; padding:32px;">
            <h2 style="color:#2d2a26;">Hello {{name}},</h2>
            <p style="color:#5a5652; line-height:1.6;">
              You haven't performed your recommended coping exercise today. Take a few minutes to complete and rate it.
              It will help to relieve your well-being!
            </p>
            <a href="https://caratmind.app/exercise/tracking"
              style="display:inline-block; margin-top:16px; padding:12px 24px;
                      background:#6b5b95; color:#fff; text-decoration:none; border-radius:8px;">
              Perform coping exercise
            </a>
            <p style="color:#a8a29c; font-size:12px; margin-top:32px;">
              <a href="https://caratmind.app/profile" style="color:#a8a29c;">
                Manage notification preferences
              </a>
            </p>
          </div>
        </body>
      #   
      </html>
      """,
      "TextPart": "Hi {{name}}, you haven't completed coping exercise today. Take a few minutes: https://caratmind.app/exercise/tracking",
    },
    {
      "TemplateName": "mood_helpline",
      "SubjectPart": "Get urgent support from helplines.",
      "HtmlPart": """
      <html>
        <body style="font-family: -apple-system, sans-serif; background:#f7f5f2; padding:24px;">
          <div style="max-width:480px; margin:0 auto; background:#fff; border-radius:12px; padding:32px;">
            <h2 style="color:#2d2a26;">Hello {{name}},</h2>
            <p style="color:#5a5652; line-height:1.6;">
              It seems you have been experiencing poor moods for 3 days or more.
              Please contact professional help for further advice as soon as you can. You are not alone in this struggle.
            </p>
            <a href="https://caratmind.app/helpline"
              style="display:inline-block; margin-top:16px; padding:12px 24px;
                      background:#6b5b95; color:#fff; text-decoration:none; border-radius:8px;">
              Contact emergency helpline
            </a>
            <p style="color:#a8a29c; font-size:12px; margin-top:32px;">
              <a href="https://caratmind.app/profile" style="color:#a8a29c;">
                Manage notification preferences
              </a>
            </p>
          </div>
        </body>
      #   
      </html>
      """,
      "TextPart": "Hi {{name}}, contact a helpline to get urgent support: https://caratmind.app/helpline",
    },
    {
      "TemplateName": "habit_summary",
      "SubjectPart": "Your habits for the past week.",
      "HtmlPart": """
      <html>
        <body style="font-family: -apple-system, sans-serif; background:#f7f5f2; padding:24px;">
          <div style="max-width:480px; margin:0 auto; background:#fff; border-radius:12px; padding:32px;">
            <h2 style="color:#2d2a26;">Hello {{name}},</h2>
            <p style="color:#5a5652; line-height:1.6;">
              Here's a look at your habits over the past week:
            </p>

            {{#each days}}
            <div style="margin-top:20px;">
              <p style="color:#2d2a26; font-weight:600; margin-bottom:6px;">{{this.date}}</p>
              {{#each this.habits}}
              <p style="color:#5a5652; margin:2px 0; padding-left:12px;">
                • {{this.hab_question}} — {{this.action}}
              </p>
              {{/each}}
            </div>
            {{/each}}

            <a href="https://caratmind.app/home"
              style="display:inline-block; margin-top:24px; padding:12px 24px;
                      background:#6b5b95; color:#fff; text-decoration:none; border-radius:8px;">
              Track new habits today
            </a>
            <p style="color:#a8a29c; font-size:12px; margin-top:32px;">
              <a href="https://caratmind.app/profile" style="color:#a8a29c;">
                Manage notification preferences
              </a>
            </p>
          </div>
        </body>
      </html>
      """,
      "TextPart": "Hi {{name}}, view your habit summary for the week!",
    },
    {
      "TemplateName": "habit_reminder",
      "SubjectPart": "Track your habits to improve well-being.",
      "HtmlPart": """
      <html>
        <body style="font-family: -apple-system, sans-serif; background:#f7f5f2; padding:24px;">
          <div style="max-width:480px; margin:0 auto; background:#fff; border-radius:12px; padding:32px;">
            <h2 style="color:#2d2a26;">Hello {{name}},</h2>
            <p style="color:#5a5652; line-height:1.6;">
              You haven't tracked any habits today. Take a few minutes to track your habit as a step to improve your well-being.
            </p>
            <a href="https://caratmind.app/home"
              style="display:inline-block; margin-top:16px; padding:12px 24px;
                      background:#6b5b95; color:#fff; text-decoration:none; border-radius:8px;">
              Track daily habit
            </a>
            <p style="color:#a8a29c; font-size:12px; margin-top:32px;">
              <a href="https://caratmind.app/profile" style="color:#a8a29c;">
                Manage notification preferences
              </a>
            </p>
          </div>
        </body>
      #   
      </html>
      """,
      "TextPart": "Hi {{name}}, track a habit today: https://caratmind.app/home",
    },
    {
      "TemplateName": "new_badge",
      "SubjectPart": "Congratulations, you earned a streak badge!",
      "HtmlPart": """
      <html>
        <body style="font-family: -apple-system, sans-serif; background:#f7f5f2; padding:24px;">
          <div style="max-width:480px; margin:0 auto; background:#fff; border-radius:12px; padding:32px;">
            <h2 style="color:#2d2a26;">Hello {{name}},</h2>
            <img src="https://caratmind-assets.s3.ap-southeast-5.amazonaws.com/badge{{type}}_{{streak}}.png"
            alt="{{streak}}-day {{type}} streak badge" width="120" style="display:block; margin:16px auto;" />    
            <p style="color:#5a5652; line-height:1.6;">
              You have earned a {{type}} streak badge for {{streak}} days! 
              Keep it up to unlock more badges and display them on your profile.
            </p>
            <a href="https://caratmind.app/profile"
              style="display:inline-block; margin-top:16px; padding:12px 24px;
                      background:#6b5b95; color:#fff; text-decoration:none; border-radius:8px;">
              View badges
            </a>
            <p style="color:#a8a29c; font-size:12px; margin-top:32px;">
              <a href="https://caratmind.app/profile" style="color:#a8a29c;">
                Manage notification preferences
              </a>
            </p>
          </div>
        </body>
      #   
      </html>
      """,
      "TextPart": "Hi {{name}}, you have unlocked {{streak}}-day {{type}} streak badge! View it here: https://caratmind.app/profile",
    }
]

for tpl in TEMPLATES:
    try:
        ses.create_template(Template=tpl)
        print(f"Created: {tpl['TemplateName']}")
    except ClientError as e:
        if e.response["Error"]["Code"] == "AlreadyExists":
            ses.update_template(Template=tpl)
            print(f"Updated: {tpl['TemplateName']}")
        else:
            raise