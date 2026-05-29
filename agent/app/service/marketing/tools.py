import os
import requests
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

POKE_API_URL = os.getenv("POKE_API_URL")

# -------------------------
# TOOL FUNCTION
# -------------------------
def get_today_date():
    now = datetime.now()

    return {
        "date": now.strftime("%Y-%m-%d"),
        "day": now.strftime("%A"),
        "timestamp": now.isoformat()
    }

def get_pokemon_info(pokemon_name: str):
    """
    포켓몬 정보를 한글 기준으로 가져온다.
    - 이름
    - 분류
    - 한글 도감 설명 목록
    """

    url = f"{POKE_API_URL}/api/v2/pokemon-species/{pokemon_name}"
    response = requests.get(url)

    if response.status_code != 200:
        raise Exception(f"API 호출 실패: {response.status_code}")

    data = response.json()

    # 한글 이름
    korean_name = next(
        (
            item["name"]
            for item in data["names"]
            if item["language"]["name"] == "ko"
        ),
        None
    )

    # 한글 분류
    korean_genus = next(
        (
            item["genus"]
            for item in data["genera"]
            if item["language"]["name"] == "ko"
        ),
        None
    )

    # 한글 설명만 추출
    korean_flavors = [
        {
            "version": entry["version"]["name"],
            "text": entry["flavor_text"]
                .replace("\n", " ")
                .replace("\f", " ")
        }
        for entry in data["flavor_text_entries"]
        if entry["language"]["name"] == "ko"
    ]

    ret = {
        "id": data["id"],
        "name": korean_name,
        "genus": korean_genus,
        "is_legendary": data["is_legendary"],
        "is_mythical": data["is_mythical"],
        "flavor_texts": korean_flavors,
    }

    return ret

# -------------------------
# TOOL SCHEMA
# -------------------------
TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "get_today_date",
            "description": (
                "Returns current date information. "
                "Use this when writing time-sensitive marketing content, urgency-based posts, "
                "or when today’s date or weekday is needed in the response."
            ),
            "parameters": {
                "type": "object",
                "properties": {}
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_pokemon_info",
            "description": (
                "Get pokemon information by english pokemon name. "
                "Use this when creating pokemon collaboration marketing content "
                "for newly registered products."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "pokemon_name": {
                        "type": "string",
                        "description": "English pokemon name"
                    }
                },
                "required": ["pokemon_name"]
            }
        }
    }
]

TOOL_MAP = {
    "get_today_date": get_today_date,
    "get_pokemon_info": get_pokemon_info
}