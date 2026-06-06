import os
import math
import requests
from datetime import date, timedelta
from dotenv import load_dotenv

load_dotenv()


def _sig(x: float, figures: int = 4) -> float:
    if x == 0:
        return 0.0
    d = math.ceil(math.log10(abs(x)))
    factor = 10 ** (figures - d)
    return round(x * factor) / factor

CURRENCY_BEACON_API_KEY = os.getenv("CURRENCY_BEACON_API_KEY")
CURRENCY_BEACON_BASE_URL = "https://api.currencybeacon.com/v1"


# -------------------------
# TOOL FUNCTION
# -------------------------
def get_exchange_rate(destination_currency: str) -> dict:
    today = date.today()
    past  = today - timedelta(days=30)

    def _fetch(endpoint: str, target_date: str | None = None) -> float:
        params = {
            "api_key": CURRENCY_BEACON_API_KEY,
            "base":    "KRW",
            "symbols": destination_currency,
        }
        if target_date:
            params["date"] = target_date

        resp = requests.get(f"{CURRENCY_BEACON_BASE_URL}/{endpoint}", params=params)
        resp.raise_for_status()
        return resp.json()["response"]["rates"][destination_currency]

    current_rate = _fetch("latest")
    past_rate    = _fetch("historical", str(past))

    change_pct = (current_rate / past_rate - 1) * 100

    if   change_pct >=  5: trend = "원화 매우 강세"
    elif change_pct >=  2: trend = "원화 강세"
    elif change_pct >= -2: trend = "보통"
    else:                  trend = "원화 약세"

    return {
        "trend":                trend, # 작동 되는지 테스트해보고 싶다면 "원화 강세",
        "destination_currency": destination_currency,
        "current_rate":         _sig(current_rate),
        "past_rate":            _sig(past_rate),
        "change_pct":           round(change_pct, 2),
    }

# -------------------------
# TOOL SCHEMA
# -------------------------
TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "get_exchange_rate",
            "description": (
                """
Returns current KRW exchange rate trend vs the destination country's currency.

Call this tool BEFORE generating ad copy when the product description
contains shopping/travel-related keywords such as:
자유여행, 자유일정, 자유시간, 쇼핑, 면세, 아울렛, 야시장, 시장.

You MUST infer destination_currency from the product category,
product title, and product description.

Examples:
- 일본, 도쿄, 오사카, 후쿠오카 -> JPY
- 중국, 상하이, 베이징 -> CNY
- 유럽, 프랑스, 독일, 이탈리아 -> EUR
- 태국, 방콕 -> THB
- 베트남, 하노이, 다낭, 호치민 -> VND
- 호주, 시드니, 멜버른 -> AUD
- 미국, 뉴욕, LA, 하와이 -> USD

If the destination country can be inferred, call this tool.
"""
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "destination_currency": {
                        "type": "string",
                        "description": "ISO 4217 currency code of the destination country",
                    }
                },
                "required": ["destination_currency"],
            },
        },
    }
]

TOOL_MAP = {
    "get_exchange_rate": get_exchange_rate,
}