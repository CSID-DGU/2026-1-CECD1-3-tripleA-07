from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.common.enum.event_type import EventType
from app.common.dto.product import Product
from app.service import product_marketing

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
    product_new: Product
    # 기존 상품 정보 (DISCOUNT의 경우)
    product_old: Product | None = None

    # 샘플 적용 여부
    is_sample: bool = Field(alias="Is_sample", default=True)

@router.post("/agent")
async def start_agent_flow(body: AgentEventRequest):
    ai_response: str = await product_marketing(body.event_type)
    # 임시 return 값
    return {
        "event_type": body.event_type,
        "product_id": body.product_id,
        "product_new": body.product_new,
        "product_old": body.product_old,
        "ai_response": ai_response
    }