from app.common.enum.event_type import EventType
from app.common.dto.product import Product

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
def build_user_prompt(event_type: EventType, product: Product):
    if event_type == EventType.NEW:
        instruction = """
Create an SNS post for a NEW product.

Rules:
- Focus on innovation, novelty, excitement
- Do NOT mention discounts or price cuts
- Use emotional hook in first sentence
- This is a Pokémon collaboration product
- You MUST explicitly mention real Pokémon names
- The returned Pokémon data (especially Pokédex flavor text / description)
  MUST be directly reflected in the marketing copy
- Encourage fans to feel excitement about limited collaboration vibes
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
{product.model_dump_json()}

Output format (STRICT):
Title: ...
Body: ...
CTA: ...
Hashtags: ...
"""