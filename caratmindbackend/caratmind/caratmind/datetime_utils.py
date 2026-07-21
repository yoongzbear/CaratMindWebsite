# convert to local time
from datetime import datetime
from zoneinfo import ZoneInfo

TIMEZONE = 'Asia/Kuala_Lumpur'

def to_local_date_str(iso_ts: str, tz: str = TIMEZONE) -> str:
    dt = datetime.fromisoformat(iso_ts)
    local_dt = dt.astimezone(ZoneInfo(tz))
    return local_dt.date().isoformat()

# return timestamp of today
def today_local() -> str:
    return datetime.now(ZoneInfo(TIMEZONE)).date()