import os
import requests
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

# POKE_API_URL = os.getenv("POKE_API_URL")
CURRENCY_BEACON_API_KEY = os.getenv("CURRENCY_BEACON_API_KEY")
CURRENCY_BEACON_BASE_URL = os.getenv("CURRENCY_BEACON_BASE_URL")

# 카테고리 → 통화 코드 매핑
CATEGORY_CURRENCY_MAP = {
    "일본":           "JPY",
    "동남아":         "THB",   # 태국 바트 대표
    "유럽":           "EUR",
    "대만·홍콩·마카오": "TWD",
    "중국":           "CNY",
    "미국":           "USD",
    "호주·뉴질랜드":  "AUD",
    "캐나다·중남미":  "CAD",
    "중동·아프리카·인도": "AED",
}

# 통화별 "유리한 환율" 기준 (1외화 = ?원 이하면 유리)
FAVORABLE_RATE_THRESHOLD = {
    "JPY": 9.5,     # 100엔 기준 950원 이하 → 엔저
    "USD": 1350,
    "EUR": 1500,
    "THB": 38,
    "TWD": 42,
    "HKD": 175,
    "AUD": 880,
    "CAD": 1000,
    "CNY": 190,
    "AED": 370,
}

# -------------------------
# TOOL FUNCTION
# -------------------------
# def get_today_date():
#     now = datetime.now()
#
#     return {
#         "date": now.strftime("%Y-%m-%d"),
#         "day": now.strftime("%A"),
#         "timestamp": now.isoformat()
#     }
#
# def get_pokemon_info(pokemon_name: str):
#     """
#     포켓몬 정보를 한글 기준으로 가져온다.
#     - 이름
#     - 분류
#     - 한글 도감 설명 목록
#     """
#
#     url = f"{POKE_API_URL}/api/v2/pokemon-species/{pokemon_name}"
#     response = requests.get(url)
#
#     if response.status_code != 200:
#         raise Exception(f"API 호출 실패: {response.status_code}")
#
#     data = response.json()
#
#     # 한글 이름
#     korean_name = next(
#         (
#             item["name"]
#             for item in data["names"]
#             if item["language"]["name"] == "ko"
#         ),
#         None
#     )
#
#     # 한글 분류
#     korean_genus = next(
#         (
#             item["genus"]
#             for item in data["genera"]
#             if item["language"]["name"] == "ko"
#         ),
#         None
#     )
#
#     # 한글 설명만 추출
#     korean_flavors = [
#         {
#             "version": entry["version"]["name"],
#             "text": entry["flavor_text"]
#                 .replace("\n", " ")
#                 .replace("\f", " ")
#         }
#         for entry in data["flavor_text_entries"]
#         if entry["language"]["name"] == "ko"
#     ]
#
#     ret = {
#         "id": data["id"],
#         "name": korean_name,
#         "genus": korean_genus,
#         "is_legendary": data["is_legendary"],
#         "is_mythical": data["is_mythical"],
#         "flavor_texts": korean_flavors,
#     }
#
#     return ret

def get_exchange_rate(currency: str) -> dict:
    """
    KRW 기준 실시간 환율 조회 (CurrencyBeacon API).
    1외화 = ?원 형태로 반환하고, 유리한 환율 여부도 판단해 반환.
    """
    url = (CURRENCY_BEACON_BASE_URL)
    response = requests.get(url, timeout=5)

    if response.status_code != 200:
        raise Exception(f"환율 API 호출 실패: {response.status_code} {response.text}")

    data = response.json()
    # 응답 구조: { "response": { "rates": { "KRW": 950.12 }, "date": "2026-06-06" } }
    rates = data["response"]["rates"]
    krw_per_unit = round(rates["KRW"], 2)

    threshold = FAVORABLE_RATE_THRESHOLD.get(currency.upper())
    is_favorable = (threshold is not None) and (krw_per_unit <= threshold)

    return {
        "currency": currency.upper(),
        "krw_per_unit": krw_per_unit,          # 예: JPY → 8.91 (1엔 = 8.91원)
        "rate_date": data["response"].get("date"),
        "is_favorable": is_favorable,           # LLM이 광고 문구 여부 판단에 활용
        "threshold": threshold,                 # 기준값도 함께 전달
    }

# -------------------------
# TOOL SCHEMA
# -------------------------
# TOOLS = [
#     {
#         "type": "function",
#         "function": {
#             "name": "get_today_date",
#             "description": (
#                 "Returns current date information. "
#                 "Use this when writing time-sensitive marketing content, urgency-based posts, "
#                 "or when today’s date or weekday is needed in the response."
#             ),
#             "parameters": {
#                 "type": "object",
#                 "properties": {}
#             }
#         }
#     },
#     {
#         "type": "function",
#         "function": {
#             "name": "get_pokemon_info",
#             "description": (
#                 "Get pokemon information by english pokemon name. "
#                 "Use this when creating pokemon collaboration marketing content "
#                 "for newly registered products."
#             ),
#             "parameters": {
#                 "type": "object",
#                 "properties": {
#                     "pokemon_name": {
#                         "type": "string",
#                         "description": "English pokemon name"
#                     }
#                 },
#                 "required": ["pokemon_name"]
#             }
#         }
#     }
# ]
#
# TOOL_MAP = {
#     "get_today_date": get_today_date,
#     "get_pokemon_info": get_pokemon_info
# }

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "get_exchange_rate",
            "description": (
                "원화(KRW) 기준 실시간 환율을 조회합니다. "
                "상품 설명(description)에 '자유 여행', '쇼핑', '면세', '야시장', '시장' 등 "
                "현지 소비와 관련된 키워드가 포함된 경우 반드시 이 툴을 호출하세요. "
                "반환값의 is_favorable이 true인 경우에만 body에 환율 문구를 삽입하고, "
                "false인 경우에는 환율을 언급하지 마세요."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "currency": {
                        "type": "string",
                        "description": (
                            "ISO 4217 통화 코드. 여행지 카테고리별 기본값: "
                            "일본→JPY, 동남아→THB, 유럽→EUR, 대만·홍콩·마카오→TWD, "
                            "중국→CNY, 미국→USD, 호주·뉴질랜드→AUD, 캐나다·중남미→CAD"
                        )
                    }
                },
                "required": ["currency"]
            }
        }
    },
]

TOOL_MAP = {
    "get_exchange_rate": get_exchange_rate
}