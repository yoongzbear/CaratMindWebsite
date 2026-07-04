# convert to local time
from datetime import datetime
from zoneinfo import ZoneInfo

def to_local_date_str(iso_ts: str, tz: str = 'Asia/Kuala_Lumpur') -> str:
    dt = datetime.fromisoformat(iso_ts)
    local_dt = dt.astimezone(ZoneInfo(tz))
    return local_dt.date().isoformat()