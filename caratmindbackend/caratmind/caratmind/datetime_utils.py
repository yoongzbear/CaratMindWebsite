# convert to local time
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo

LOCAL_TZ = ZoneInfo('Asia/Kuala_Lumpur')

def to_local_date_str(iso_ts: str, tz: ZoneInfo = LOCAL_TZ) -> str:
    dt = datetime.fromisoformat(iso_ts)
    local_dt = dt.astimezone(tz)
    return local_dt.date().isoformat()

# return timestamp of today
def today_local() -> str:
    return datetime.now(LOCAL_TZ).date()

def local_month_bounds_utc(year: int, month: int) -> tuple[str, str]:
    """Local calendar month -> UTC ISO bounds for the DynamoDB query."""
    local_start = datetime(year, month, 1, tzinfo=LOCAL_TZ)
    if month == 12:
        next_month_start = datetime(year + 1, 1, 1, tzinfo=LOCAL_TZ)
    else:
        next_month_start = datetime(year, month + 1, 1, tzinfo=LOCAL_TZ)
    local_end = next_month_start - timedelta(microseconds=1)
    return (
        local_start.astimezone(timezone.utc).isoformat(),
        local_end.astimezone(timezone.utc).isoformat(),
    )

def to_local_date(iso_timestamp: str) -> str:
    """UTC ISO timestamp -> local (Asia/KL) calendar date string."""
    dt = datetime.fromisoformat(iso_timestamp)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(LOCAL_TZ).date().isoformat()

def local_day_bounds_utc(date_str: str) -> tuple[str, str]:
    """Local calendar day 00:00:00-23:59:59.999999 -> UTC ISO bounds."""
    local_start = datetime.fromisoformat(date_str).replace(tzinfo=LOCAL_TZ)
    local_end = local_start + timedelta(days=1) - timedelta(microseconds=1)
    return local_start.astimezone(timezone.utc).isoformat(), local_end.astimezone(timezone.utc).isoformat()