import boto3
from django.conf import settings

def _get_s3_client():
    return boto3.client('s3', region_name=settings.AWS_S3_REGION)

# upload/update into S3
def upload_entry_text(entry_key: str, content: str) -> None:
    client = _get_s3_client()
    client.put_object(
        Bucket=settings.AWS_S3_JOURNAL_BUCKET,
        Key=entry_key,
        Body=content.encode('utf-8'),
        ContentType='text/plain; charset=utf-8',
    )

# retrieve entry
def get_entry_text(entry_key: str) -> str:
    client = _get_s3_client()
    obj = client.get_object(Bucket=settings.AWS_S3_JOURNAL_BUCKET, Key=entry_key)
    return obj['Body'].read().decode('utf-8')
