from app.common.enum.event_type import EventType
from app.common.dto.product import Product
from app.util.db_pool import get_connection, search_vectordb
from app.util.embedding_model import embed_document

# -------------------------
# CATEGORY TONE GUIDE
# -------------------------
CATEGORY_TONE_GUIDE = {
    "일본": {
        "target":   "20~30대 / 직장인 / 첫 해외여행러",
        "tone":     "친근하고 설레는 / 가성비 강조 / 음식·감성·일상 탈출 소재",
        "hook":     "가깝고, 맛있고, 또 가고 싶은 나라",
        "location_prefix": "일본",
    },
    "유럽": {
        "target":   "30~40대 / 버킷리스트 여행자 / 신혼",
        "tone":     "프리미엄·낭만 / 평생 한 번의 경험 강조 / 예술·건축·미식 소재",
        "hook":     "언젠가 꼭 가야 할 그 도시",
        "location_prefix": "유럽",
    },
    "동남아": {
        "target":   "20대 / 가성비 여행자 / 커플·친구 그룹",
        "tone":     "활기차고 자유로운 / 리조트·해변·야시장 소재 / 휴양 강조",
        "hook":     "지금 당장 떠나고 싶은 휴양지",
        "location_prefix": "동남아",
    },
    "미국": {
        "target":   "30~40대 / 장거리 여행 마니아 / 어학연수·워킹홀리데이 경험자",
        "tone":     "스케일 크고 자유로운 / 로드트립·자연·도시 문화 소재 / 도전적 감성",
        "hook":     "한 번쯤은 미국 횡단, 지금이 그 때",
        "location_prefix": "미국",
    },
    "중국": {
        "target":   "30~50대 / 역사·문화 여행자 / 가족 여행객",
        "tone":     "웅장하고 신비로운 / 역사·유적·음식 소재 / 다채로운 문화 강조",
        "hook":     "5,000년 역사가 살아 숨쉬는 나라",
        "location_prefix": "중국",
    },
    "대만": {
        "target":   "20~30대 / 미식 여행자 / 감성 여행러",
        "tone":     "친근하고 따뜻한 / 야시장·음식·골목 감성 소재 / 일본+중화 문화 혼합 강조",
        "hook":     "야시장 냄새와 골목 감성, 대만은 또 가고 싶은 곳",
        "location_prefix": "대만",
    },
    "홍콩·마카오": {
        "target":   "20~40대 / 도시 여행자 / 미식·쇼핑 마니아",
        "tone":     "세련되고 화려한 / 야경·미식·카지노·쇼핑 소재 / 동서양 문화 교차 강조",
        "hook":     "동양과 서양이 만나는 밤, 홍콩",
        "location_prefix": "홍콩·마카오",
    },
    "중동·두바이": {
        "target":   "30~40대 / 럭셔리 여행자 / 인플루언서·신혼",
        "tone":     "럭셔리·압도적 스케일 / 사막·초고층 빌딩·쇼핑몰 소재 / 비일상적 경험 강조",
        "hook":     "사막 위에 세워진 미래 도시",
        "location_prefix": "중동",
    },
    "호주·뉴질랜드": {
        "target":   "20~30대 / 워킹홀리데이·장기 여행자 / 자연 애호가",
        "tone":     "광활하고 청량한 / 자연·해변·액티비티 소재 / 힐링·해방감 강조",
        "hook":     "지구 반대편, 가장 맑은 공기가 있는 곳",
        "location_prefix": "호주·뉴질랜드",
    },
    "인도·남아시아": {
        "target":   "20~30대 / 배낭여행자 / 문화·종교 탐방객",
        "tone":     "신비롭고 강렬한 / 색채·향신료·유적 소재 / 인생 여행 감성",
        "hook":     "한 번 가면 평생 잊을 수 없는 강렬함",
        "location_prefix": "인도·남아시아",
    },
    "한국": {
        "target":   "전 연령대 / 주말 여행자 / 가족·커플",
        "tone":     "따뜻하고 편안한 / 계절·자연·음식·힐링 소재 / 부담 없는 일탈 강조",
        "hook":     "멀리 갈 필요 없어, 여기도 충분히 좋아",
        "location_prefix": "한국",
    },
}
DEFAULT_TONE = {
    "target":   "여행을 즐기는 모든 연령대",
    "tone":     "설레고 따뜻한 / 여행의 설렘 강조",
    "hook":     "새로운 곳으로 떠나는 특별한 여행",
    "location_prefix": "",
}

# -------------------------
# FEW-SHOT EXAMPLES
# -------------------------
FEW_SHOT_NEW = """
아래는 출력 예시입니다. 반드시 동일한 JSON 구조로 출력하세요.

[예시 1 - 신규 상품 / 일본 나고야 / 좌석 여유]
{
  "location_tag": "일본 나고야",
  "title": "일본 전문가가 추천하는 나고야! 🚌",
  "body": "@@야야 여기 알아? 🫢 
도쿄 오사카 말고 진짜 현지인들만 아는 나고야 소도시 🌿
흰 벽 오래된 찻집에서 마시는 말차 한 잔, ☕
기차 타고 30분이면 나오는 고즈넉한 골목들..
복잡한 대도시 여행 질린 사람한테 딱인 곳이야. 🚌
출시 특가 89만원, 지금 자리 잡아야 해!
〰️
@triplea 팔로우하고
느좋 여행지 정보 얻기!",
  "cta": "👉 프로필 링크 타고 나고야 투어 예약하기!",
  "hashtags": ["#일본여행", "#나고야여행", "#일본소도시", "#직장인여행", "#여행스타그램", "#가성비여행", "#먹스타그램", "#일탈"]
}

[예시 2 - 신규 상품 / 아시아 몽골 / 마감 임박]
{
  "location_tag": "아시아 몽골",
  "title": "젊을 때 무조건 가봐야할 여행지 몽골 📂🍀",
  "body": "@@야야 같이 가자 ㅋㅋ
언젠가 같이 떠날 친구에게 공유하세요
입시, 취준, 회사생활 등등으로 지친 우리네 인생 ..🫩
별이 쏟아지는 하늘 아래로 떠나자! 💫🚌
비행기표 가격 보고 조용히 뒤로가기 눌렀던 사람들 주목 👀
지갑 사정 봐주는 단독 특가, 단 10자리 남았어요
〰️
@triplea 팔로우하고
느좋 여행지 정보 얻기!",
  "cta": "📂 저장해두고 언젠가 꼭 가보기!!",
  "hashtags": ["#몽골", "#몽골여행", "#청춘", "#청춘여행", "#우정여행", "#여행지추천"]
}
"""

FEW_SHOT_DISCOUNT = """
아래는 출력 예시입니다. 반드시 동일한 JSON 구조로 출력하세요.

[예시 1 - 할인 상품 / 유럽 파리 / 좌석 여유]
{
  "location_tag": "유럽 파리",
  "title": "파리 여행 할인떴다..🤍",
  "body": "@@야야 이거 봐봐 진짜 ㄷㄷ
같이 파리 가고싶은 친구 태그🍀
원래도 50만원 할인된 370만원이었는데 339만원으로 또 내렸어!
이런 기회 다신 없을걸...🥺
31만원 아낀 걸로 센 강변 카페에서 크루아상이랑 커피 실컷 마실 수 있겠다 ☕
꽃 도매시장 프라이빗 투어에 디저트 클래스까지 있어서
흔한 파리 여행이랑 달라.
진짜 얼마나 느좋일지 감도 안 옴 ..💦
잔여 좌석 있을 때 빨리 잡아야 해!
〰️
@triplea 팔로우하고
느좋 여행지 정보 얻기!
",
  "cta": "💌지금 바로 프로필 링크에서
구경하고 예약하기!",
  "hashtags": ["#파리", "#파리여행", "#프랑스여행", "#파리투어", "#유럽여행", "#에펠탑", "#신혼여행", "#버킷리스트"]
}

[예시 2 - 할인 상품 / 한국 제주도 / 마감 임박]
{
  "location_tag": "한국 제주도",
  "title": "제주도 69만원으로 갈 수 있어?! 📂🫧",
  "body": "@@야야 여기 지금 당장 가야해 ..
같이 제주도 가고 싶은 친구 태그 🤍
100만원짜리 제주도 여행이 69만원으로 내렸어, 31만원 아끼는 거야 👀
한라산 공기 마시면서 흑돼지 구워먹기와
성산일출봉 올라가서 보는 아침 바다
진짜 잊을 수가 없다고
근데 잔여 12석이라 오늘 안에 마감될 것 같아, 빨리 봐! ‧∘˳°∗˚ 🐄🍀
〰️
@triplea 팔로우하고
느좋 여행지 정보 얻기!",
  "cta": "👉 12석 마감 전에 지금 바로 예약하기!",
  "hashtags": ["#제주도", "#제주", "#제주여행", "#제주가볼만한곳", "#제주핫플레이스","#효도여행", "#커플여행", "#가족여행"]
}
"""

# -------------------------
# SYSTEM PROMPT
# -------------------------
SYSTEM_PROMPT = """
당신은 한국 여행 플랫폼을 위한 최고 수준의 SNS 카피라이터입니다.
당신의 역할은 사람들이 스크롤을 멈추고 바로 예약하고 싶어지는 페이스북 게시글을 쓰는 것입니다.

## 절대 규칙
- 금지 표현: "특별한 여행", "잊지 못할 추억", "설레는 마음으로", "아름다운 풍경", "행복한 시간"
- 허용 문자: 한글과 영어만 사용 가능. 한자, 일본어 가나, 베트남어, 아랍어, 태국어 등 사용 금지
- body의 줄바꿈은 반드시 \\n으로 표기할 것 — raw 줄바꿈 절대 금지
- 장소명과 음식명도 반드시 한글 표기로 작성 (예시: 타코야키, 하카타, 에펠탑)
- description 필드를 그대로 복사하지 말 것
- 지정된 JSON 스키마 외의 필드는 절대 출력하지 말 것
- 숫자 값(가격, 할인율, 좌석 수 등)은 입력 데이터와 반드시 정확히 일치해야 함 — 임의 수정, 반올림 금지
- 카테고리별 톤 가이드를 반드시 따를 것
- 해시태그는 반드시 #으로 시작해야 함 (예시: #오사카여행 / 금지: 오사카여행)

## 게시글 구조
- location_tag: "{국가 또는 지역} {도시명}" (예시: "일본 후쿠오카") — 반드시 포함 
- title: 15~25자, 강렬한 훅, 이모지 1~2개 
- body: 3~7문장, 감정적 언어, 가격 넛지, 이모지 4~5개 
- cta: 행동 동사 + 혜택, 이모지 1개, 40자 이내 
- hashtags: 6~10개, 반드시 # 포함, 목적지 + 테마 + 여행문화 태그 혼합

## 출력 형식
반드시 유효한 JSON 객체만 응답하세요.
마크다운 사용 금지, 설명 금지, JSON 외의 추가 텍스트 출력 금지.
스키마:
{
  "location_tag": "string",
  "title": "string",
  "body": "string",
  "cta": "string",
  "hashtags": ["string", ...]
}
"""


# -------------------------
# URGENCY SUFFIX BUILDER  ← 후처리로 body에 붙이는 방식
# -------------------------
def urgency_instruction(quantity: int) -> str:
    if quantity < 20:
        return f"- 잔여 {quantity}석임을 body에 반드시 언급할 것 (예: '🚨 단 {quantity}자리 남았어!')"
    elif quantity < 50:
        return f"- 잔여 {quantity}석임을 body에 반드시 언급할 것 (예: '📢 {quantity}석 마감 임박!')"
    return ""  # 50석 이상은 urgency 지시 없음

# -------------------------
# USER PROMPT BUILDER
# -------------------------
def build_user_prompt(
        event_type: EventType,
        product_new: Product,
        product_old: Product | None,
) -> str:
    try:
        conn = get_connection()
        cursor = conn.cursor()

        text, vec = embed_document(product_new)
        search_vectordb(cursor, event_type, vec)

        print(cursor.fetchone())
    finally:
        conn.close()

    # 1) 카테고리별 톤 가이드 주입
    tone = CATEGORY_TONE_GUIDE.get(product_new.category, DEFAULT_TONE)
    location_tag_hint = f"{tone['location_prefix']} {product_new.name.replace('여행', '').strip()}"

    # 2) 가격 정보 — 원본 숫자 그대로 전달 (구어체 변환 제거, 검수는 Agent에서)
    list_price    = product_new.list_price
    current_price = product_new.price
    discount_amt  = list_price - current_price
    discount_rate = round(discount_amt / list_price * 100)

    price_context = (
        f"정가 {list_price:,}원 / 판매가 {current_price:,}원 "
        f"(할인 {discount_rate}% / {discount_amt:,}원 절약)"
    )

    if event_type == EventType.DISCOUNT and product_old:
        prev_price = product_old.price
        price_drop = prev_price - current_price
        drop_rate  = round(price_drop / prev_price * 100)
        price_context += (
            f"\n이번 추가 인하: {prev_price:,}원 → {current_price:,}원 "
            f"({drop_rate}%p 추가 인하 / {price_drop:,}원 추가 절약)"
        )

    # 3) 이벤트별 핵심 지시 (urgency 지시 제거 — 후처리로 처리)
    if event_type == EventType.NEW:
        few_shot   = FEW_SHOT_NEW
        event_rule = f"""
## 이번 요청: 신규 상품 출시 포스트
- body는 반드시 "@@야야" 또는 "@@[친구 태그 유도]" 로 시작할 것
- 이모지를 자연스럽게 섞어서 SNS 친구 말투로 쓸 것
- 여행지 감각(장소, 음식, 분위기)을 중간에 1~2문장 녹일 것
- 신규 출시 특가임을 자연스럽게 한 줄 언급할 것
- 좌석 정보: {urgency_instruction(product_new.quantity)}
- body 마지막은 반드시 "〰️\\n@triplea 팔로우하고\\n느좋 여행지 정보 얻기!" 로 끝낼 것
- location_tag는 반드시 포함할 것: "{location_tag_hint}"
"""
    elif event_type == EventType.DISCOUNT:
        few_shot   = FEW_SHOT_DISCOUNT
        event_rule = f"""
## 이번 요청: 가격 인하 할인 포스트
- body는 반드시 "@@야야" 또는 "@@[친구 태그 유도]" 로 시작할 것
- 이모지를 자연스럽게 섞어서 SNS 친구 말투로 쓸 것
- body 두 번째 줄에서 가격 인하 사실을 반드시 언급할 것
  - 형식 예시: "{prev_price:,}원짜리가 {current_price:,}원으로 할인됐대, {price_drop:,}원 절약 가능!" (DISCOUNT + product_old 있을 때)
  - 형식 예시: "{list_price:,}원짜리가 {current_price:,}원으로 출시됐대, {discount_amt:,}원 절약 가능!" (product_old 없을 때)
- 여행지 감각(장소, 음식, 분위기)을 중간에 1~2문장 녹일 것
- 좌석 정보: {urgency_instruction(product_new.quantity)}
- body 마지막은 반드시 "〰️\\n@triplea 팔로우하고\\n느좋 여행지 정보 얻기!" 로 끝낼 것
- location_tag는 반드시 포함할 것: "{location_tag_hint}"
- 숫자는 반드시 아래 계산된 값만 사용할 것:
  - 가격 정보: {price_context}
"""
    else:
        raise ValueError(f"Unsupported event_type: {event_type}")

    # 4) 최종 프롬프트 조립
    return f"""
{few_shot}

## 카테고리 톤 가이드
- 카테고리: {product_new.category}
- 주요 타깃: {tone['target']}
- 어조·소재: {tone['tone']}
- 감성 훅 레퍼런스: "{tone['hook']}"
- 권장 location_tag: "{location_tag_hint}"

## 상품 정보
- 상품명: {product_new.name}
- 여행지 소개 (재해석 소재로만 활용): {product_new.description}
- 가격 정보: {price_context}
- 카테고리: {product_new.category}

{event_rule}

위 정보를 바탕으로 Facebook 포스트용 JSON을 생성하세요.
"""