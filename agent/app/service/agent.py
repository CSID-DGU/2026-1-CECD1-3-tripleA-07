import os
import json
from datetime import datetime
from textwrap import dedent
from dotenv import load_dotenv
from openai import AsyncOpenAI
from openai.types.chat import ChatCompletion

from app.common.enum.event_type import EventType

load_dotenv()

AI_ENDPOINT = os.getenv("AI_ENDPOINT")
AI_API_KEY = os.getenv("AI_API_KEY")
AI_MODEL = os.getenv("AI_MODEL")

# OpenAI async client
client = AsyncOpenAI(
    api_key=AI_API_KEY,
    base_url=AI_ENDPOINT
)

# -------------------------
# SYSTEM PROMPT (고정 규칙)
# -------------------------
SYSTEM_PROMPT = """
You are a professional social media marketing copywriter.

Your job is to generate high-performing SNS posts for products.

Follow these rules strictly:
- Write in natural Korean
- Always adapt tone based on product type (new vs discount)
- Do NOT include irrelevant information
- Follow output format exactly
- Use available tools only when they are necessary or helpful for generating better marketing content
"""

# -------------------------
# USER PROMPT TEMPLATE
# -------------------------
def build_user_prompt(product: dict, event_type: EventType):
    if event_type == EventType.NEW:
        instruction = """
Create an SNS post for a NEW product.

Rules:
- Focus on innovation, novelty, excitement
- Do NOT mention discounts or price cuts
- Use emotional hook in first sentence
"""

    elif event_type == EventType.DISCOUNT:
        instruction = """
Create an SNS post for a DISCOUNT product.

Rules:
- Emphasize savings, urgency, limited-time offer
- Strong call-to-action required
- Highlight price advantage
"""

    else:
        raise ValueError("type error")

    return f"""
{instruction}

Product Data (JSON):
{json.dumps(product, ensure_ascii=False)}

Output format (STRICT):
Title: ...
Body: ...
CTA: ...
Hashtags: ...
"""

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
    }
]

TOOL_MAP = {
    "get_today_date": get_today_date
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

    # tool call 없으면 종료
    if not message.tool_calls:
        return response

    print(message.tool_calls)

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
    response = await client.chat.completions.create(
        model=AI_MODEL,
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": build_user_prompt(product_samples[1], event_type)
            }
        ]
    )

    return response.choices[0].message.content