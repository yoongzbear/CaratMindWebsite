# remove all records from table in dynamoDB

import boto3

def clear_table(table_name: str, region: str):
    resource = boto3.resource('dynamodb', region_name=region)
    table = resource.Table(table_name)

    # get the table's key schema so we know what to delete by
    key_names = [k['AttributeName'] for k in table.key_schema]

    scan = table.scan(ProjectionExpression=', '.join(key_names))
    items = scan.get('Items', [])

    while 'LastEvaluatedKey' in scan:
        scan = table.scan(
            ProjectionExpression=', '.join(key_names),
            ExclusiveStartKey=scan['LastEvaluatedKey'],
        )
        items.extend(scan.get('Items', []))

    with table.batch_writer() as batch:
        for item in items:
            key = {k: item[k] for k in key_names}
            batch.delete_item(Key=key)

    print(f"Deleted {len(items)} items from {table_name}")


# resource = boto3.resource('dynamodb', region_name=settings.DYNAMODB_REGION)
# return resource.Table(settings.DYNAMODB_EXERCISE_TABLE)
# clear_table('YourMoodTableName', 'ap-southeast-1')
# clear_table('YourExerciseRecTableName', 'ap-southeast-1')