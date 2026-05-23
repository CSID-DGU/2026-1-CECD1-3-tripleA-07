from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.common.enum.event_type import EventType
from app.common.dto.product import Product
from app.service import product_marketing
from app.util.discord_logger import discord_send_message

router = APIRouter(
    prefix="/api/v1",
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
    is_sample: bool = Field(alias="isSample", default=True)

@router.post("/agent")
async def start_agent_flow(body: AgentEventRequest):
    discord_send_message(
        "🚀 Agent Automation Flow Started",
        f"- {body.event_type} 유형 이벤트 수신\n- productId: {body.product_id}",
        "https://github.com/CSID-DGU/2026-1-CECD1-3-tripleA-07",
        7855479
    )
    ai_response: str = await product_marketing(body.event_type, body.is_sample, body.product_new, body.product_old)
    # 임시 return 값
    return {
        "eventType": body.event_type,
        "productId": body.product_id,
        "productNew": body.product_new,
        "productOld": body.product_old,
        "aiResponse": ai_response
    }