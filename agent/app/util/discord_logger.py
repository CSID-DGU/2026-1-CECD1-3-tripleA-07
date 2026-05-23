import os
import datetime
import requests
from dotenv import load_dotenv

load_dotenv()

DISCORD_API_URL = os.getenv("DISCORD_API_URL")

#디스코드 채널로 메세지 전송
def discord_send_message(text):
    now = datetime.datetime.now()
    message = {"content": f"[{now.strftime('%Y-%m-%d %H:%M:%S')}] {str(text)}"}
    requests.post(DISCORD_API_URL, data=message)
