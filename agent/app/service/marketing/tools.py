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
        "trend":                trend,
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
                "Returns current KRW exchange rate trend vs the destination country's currency. "
                "Call this tool when the product implies a shopping, free time, "
                "or independent travel context "
                "(e.g. 자유, 쇼핑, 아울렛, 면세, 자유시간, 자유여행, 자유일정). "
                "Infer destination_currency from category or product name/description. "
                "(e.g. 일본→JPY, 중국→CNY, 유럽→EUR, 태국→THB, 베트남→VND, 호주→AUD)"
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
