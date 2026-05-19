import os
import json
import requests
from datetime import datetime
from textwrap import dedent
from dotenv import load_dotenv
from openai import AsyncOpenAI
from openai.types.chat import ChatCompletion

from app.common.enum.event_type import EventType
from app.service.prompts import SYSTEM_PROMPT, build_user_prompt

load_dotenv()

AI_ENDPOINT = os.getenv("AI_ENDPOINT")
AI_API_KEY = os.getenv("AI_API_KEY")
AI_MODEL = os.getenv("AI_MODEL")

POKE_API_URL = os.getenv("POKE_API_URL")

# OpenAI async client
client = AsyncOpenAI(
    api_key=AI_API_KEY,
    base_url=AI_ENDPOINT
)



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

# -------------------------
# SAMPLE PRODUCT INFO
# -------------------------
product_samples = [
    {
        "id": 1,
        "name": "난각번호1번 유정란 계란 무항생제 달걀 [원산지:국산]",
        "description": dedent("""\
            원산지: 국산
            달걀크기: 대란
            개수: 20구
            사육환경: 방사
            수정여부: 유정란
            보관방법: 냉장보관
            색상별: 갈색란
            자유롭게 뛰노는 방사 사육 환경에서 건강한 사료를 먹고 스트레스 없이 자란 닭이 낳은 달걀은 더욱 고소하고 깊은 풍미를 느끼실 수 있습니다.
        """),
        "list_price": 12900,
        "price": 12900
    },
    {
        "id": 2,
        "name": "[N배송] 딤섬 세트 새우하가우2봉+부추창펀2봉+게살샤오롱바오2봉 총6봉 골라담기",
        "description": dedent("""\
            모델명: 딤섬 새우 하가우 300g + 부추창펀 390g + 샤오롱바오 390g
            종류: 찐만두, 군만두, 기타
            만두맛: 고기만두
            표시기준량: 300g
            보관방법: 냉동보관
            포인트1 - 쫀득한 투명 피 + 탱글 새우, 한 입 가득 터지는 풍미!
            포인트2 - 부담 없이 언제나, 간식부터 야식까지
            포인트3 - 맛집에서 먹던 딤섬 맛 그대로, 집에서 간편하게
        """),
        "list_price": 33440,
        "price": 22120
    }
]

async def run_with_tools(response: ChatCompletion, messages: list):
    message = response.choices[0].message

    # assistant 메시지를 저장
    messages.append(message.model_dump())

    # tool call 없으면 종료
    if not message.tool_calls:
        return response

    for tool_call in message.tool_calls:
        name = tool_call.function.name
        args = json.loads(tool_call.function.arguments or "{}")

        result = TOOL_MAP[name](**args)

        messages.append({
            "role": "tool",
            "tool_call_id": tool_call.id,
            "content": json.dumps(result, ensure_ascii=False)
        })

    # 2차 호출
    response = await client.chat.completions.create(
        model=AI_MODEL,
        messages=messages,
        tools=TOOLS
    )

    return response

async def new_product_marketing(product_id: int, event_type: EventType):
    messages = [
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": build_user_prompt(product_samples[0], event_type)
            }
        ]
    response = await client.chat.completions.create(
        model=AI_MODEL,
        messages=messages,
        tools=TOOLS
    )

    response = await run_with_tools(response, messages)

    return response.choices[0].message.content


async def discount_product_marketing(product_id: int, event_type: EventType):
    messages = [
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": build_user_prompt(product_samples[1], event_type)
            }
        ]
    response = await client.chat.completions.create(
        model=AI_MODEL,
        messages=messages,
        tools=TOOLS
    )

    response = await run_with_tools(response, messages)

    return response.choices[0].message.content