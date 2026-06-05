import os
import math
import requests
from datetime import date, timedelta
from dotenv import load_dotenv

load_dotenv()
CURRENCY_BEACON_API_KEY = os.getenv("CURRENCY_BEACON_API_KEY")
CURRENCY_BEACON_BASE_URL = os.getenv("CURRENCY_BEACON_BASE_URL", "https://api.currencybeacon.com/v1")


# x를 유효숫자 만큼 남기고 반올림
# ex) 0.023976... -> 0.02398 (유효숫자 4자리)
def _sig(x: float, figures: int = 4) -> float:
    if x == 0:
        return 0.0
    d = math.ceil(math.log10(abs(x)))       # 값이 시작되는 자릿수
    factor = 10 ** (figures - d)            # 반올림 위치 설정
    return round(x * factor) / factor       # x의 정수부 끝을 반올림 위치로 만든 뒤 반올림하고 다시 자리수 원복



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
        "per_krw":              _sig(current_rate),          # 1원으로 살 수 있는 외화량
        "per_foreign":          _sig(1 / current_rate),      # 외화 1단위로 살 수 있는 원화량
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
