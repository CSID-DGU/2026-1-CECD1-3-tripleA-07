from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.common.enum.event_type import EventType
from app.common.dto.product import Product
from app.service.marketing import product_marketing
from app.util.discord_logger import discord_send_message

router = APIRouter(
    prefix="/api/v1/agent",
    tags=["v1"],
)

class AgentEventRequest(BaseModel):
    # 이벤트 유형
    event_type: EventType = Field(alias="eventType")

    # 상품 ID
    product_id: int = Field(alias="productId")

    # 신규 상품 정보
    product_new: Product = Field(alias="productNew")
    # 기존 상품 정보 (DISCOUNT의 경우)
    product_old: Product | None = Field(alias="productOld", default=None)

    # 샘플 적용 여부
    is_sample: bool = Field(alias="isSample", default=False)

# TODO: 백엔드 마이그레이션 이후 제거
# 백엔드를 위해 기존 엔드포인트 유지함
@router.post("")
async def start_agent_flow_old(body: AgentEventRequest):
    # 이벤트 수신 메시지 출력
    discord_send_message(
        "🚀 Agent Automation Flow Started",
        f"- {body.event_type} 유형 이벤트 수신\n- productId: {body.product_id}",
        "https://github.com/CSID-DGU/2026-1-CECD1-3-tripleA-07",
        7855479
    )
    ai_response: str = await product_marketing(body.event_type, body.is_sample, body.product_new, body.product_old)
    # SNS 발행 메시지 출력
    discord_send_message(
        "📢 SNS Publishing Completed",
        ai_response,
        "https://github.com/CSID-DGU/2026-1-CECD1-3-tripleA-07",
        9109759
    )
    # 임시 return 값
    return {
        "eventType": body.event_type,
        "productId": body.product_id,
        "productNew": body.product_new,
        "productOld": body.product_old,
        "aiResponse": ai_response
    }

@router.post("/marketing")
async def start_agent_flow(body: AgentEventRequest):
    # 이벤트 수신 메시지 출력
    discord_send_message(
        "🚀 Agent Automation Flow Started",
        f"- {body.event_type} 유형 이벤트 수신\n- productId: {body.product_id}",
        "https://github.com/CSID-DGU/2026-1-CECD1-3-tripleA-07",
        7855479
    )
    ai_response: str = await product_marketing(body.event_type, body.is_sample, body.product_new, body.product_old)
    # SNS 발행 메시지 출력
    discord_send_message(
        "📢 SNS Publishing Completed",
        ai_response,
        "https://github.com/CSID-DGU/2026-1-CECD1-3-tripleA-07",
        9109759
    )
    # 임시 return 값
    return {
        "eventType": body.event_type,
        "productId": body.product_id,
        "productNew": body.product_new,
        "productOld": body.product_old,
        "aiResponse": ai_response
    }