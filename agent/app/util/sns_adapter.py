import os
import requests
from dotenv import load_dotenv

load_dotenv()

FACEBOOK_PAGE_ID = os.getenv("FACEBOOK_PAGE_ID")
FACEBOOK_TOKEN = os.getenv("FACEBOOK_TOKEN")
FACEBOOK_API_URL = os.getenv("FACEBOOK_API_URL")

def get_facebook_feed_url(id: str) -> str:
    # 'id': '1234_5678'
    page_id = id.split("_")[0]
    post_id = id.split("_")[1]
    return f"https://www.facebook.com/{page_id}/posts/{post_id}"

def call_facebook_api(message: str) -> str:
    url = f"{FACEBOOK_API_URL}/{FACEBOOK_PAGE_ID}/feed"

    res = requests.post(url, data={
        "message": message,
        "access_token": FACEBOOK_TOKEN
    })

    return get_facebook_feed_url(res.json().get("id", ""))