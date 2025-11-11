import os
from datetime import datetime
from dotenv import load_dotenv


load_dotenv()


DATA_DIR = os.getenv("DATA_DIR", "./data")


os.makedirs(DATA_DIR, exist_ok=True)




def iso_ts(ts: int) -> str:
    return datetime.utcfromtimestamp(ts).isoformat() + "Z"