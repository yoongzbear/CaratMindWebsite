# park here first

# SES email templates

# send_notification(user["email"], "TemplateName", {"name": user.get("name", "")})

import boto3

from caratmind import settings

ses = boto3.client("ses", region_name=settings.AWS_DEFAULT_REGION)

# journal 
ses.create_template(Template={
    "TemplateName": "journal-reminder",
    "SubjectPart": "A few minutes for yourself today?",
    "HtmlPart": """
    <html>
      <body style="font-family: -apple-system, sans-serif; background:#f7f5f2; padding:24px;">
        <div style="max-width:480px; margin:0 auto; background:#fff; border-radius:12px; padding:32px;">
          <h2 style="color:#2d2a26;">Hi {{name}},</h2>
          <p style="color:#5a5652; line-height:1.6;">
            You haven't journaled yet today. Even a couple of sentences can help
            you notice patterns in how you're feeling.
          </p>
          <a href="https://caratmind.app/journal/new"
             style="display:inline-block; margin-top:16px; padding:12px 24px;
                    background:#6b5b95; color:#fff; text-decoration:none; border-radius:8px;">
            Write today's entry
          </a>
          <p style="color:#a8a29c; font-size:12px; margin-top:32px;">
            <a href="https://caratmind.app/settings/notifications" style="color:#a8a29c;">
              Manage notification preferences
            </a>
          </p>
        </div>
      </body>
    #   
    </html>
    """,
    "TextPart": "Hi {{name}}, you haven't journaled yet today. Take a few minutes: https://caratmind.app/journal/new",
})
# TODO: add unsubscribe footer --> make notification_pref all false 

# exercise

# negative mood

# summary habit

# habit reminder

# streak badge 