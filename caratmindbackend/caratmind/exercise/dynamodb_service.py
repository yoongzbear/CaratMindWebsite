import boto3

from caratmind import settings


def _get_table():
    resource = boto3.resource('dynamodb', region_name=settings.DYNAMODB_REGION)
    return resource.Table(settings.DYNAMODB_EXERCISE_TABLE)

# filter using date 
def get_all_exercises() -> list[dict]:
    table = _get_table()
    # response = table.scan(
    #     FilterExpression=(
    #         Attr('user_id').eq(user_id) & Attr('jrnl_created_at').begins_with(date_str)
    #     )
    # )
    # items = response.get('Items', [])
    items = []
    response = table.scan()
    items.extend(response.get("Items", []))

    while "LastEvaluatedKey" in response:
        response = table.scan(
            ExclusiveStartKey=response["LastEvaluatedKey"]
        )
        items.extend(response.get("Items", []))

    # while 'LastEvaluatedKey' in response:
    #     response = table.scan(
    #         FilterExpression=(
    #             Attr('user_id').eq(user_id) & Attr('jrnl_created_at').begins_with(date_str)
    #         ),
    #         ExclusiveStartKey=response['LastEvaluatedKey'],
    #     )
    #     items.extend(response.get('Items', []))

    return items

# get coping exercise by ID
def get_exercise_by_id(exc_id: str) -> dict | None:
    table = _get_table()
    response = table.get_item(Key={'exc_id': exc_id})
    return response.get('Item')

