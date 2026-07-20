import json

import boto3
from django.conf import settings

ses = boto3.client("ses", region_name=settings.AWS_DEFAULT_REGION)

def send_notification(to_email, template_name, template_data):
    # change Source when own a domain
    return ses.send_templated_email(
        Source="CaratMind <caratmind04@gmail.com>",
        Destination={"ToAddresses": [to_email]},
        Template=template_name,
        TemplateData=json.dumps(template_data),
        ConfigurationSetName="caratmind-notifications",
    )