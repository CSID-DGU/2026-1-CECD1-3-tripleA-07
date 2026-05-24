package com.capstone.triplea.product.event;

import com.capstone.triplea.advertisement.AdEventType;
import com.capstone.triplea.advertisement.AdvertisementService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.web.reactive.function.client.WebClient;

@Slf4j
@Component
@RequiredArgsConstructor
public class ProductEventListener {

    private final WebClient agentWebClient;
    private final AdvertisementService advertisementService;
    private final ObjectMapper objectMapper;

    // 동작 규칙 3: 비동기 처리 - 상품 등록/수정 응답에 영향을 주지 않음
    @Async
    // DB 커밋 완료 후에만 실행
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleProductEvent(ProductEvent event) {
        log.info("=== [트리거 발동] ===");
        log.info("event type  : {}", event.getEventType());
        log.info("product id  : {}", event.getId());
        log.info("name        : {}", event.getProductNew().getName());
        log.info("new price   : {}", event.getProductNew().getPrice());
        if (event.getProductOld() != null) {
            log.info("old price    : {}", event.getProductOld().getPrice());
        }
        log.info("====================");

        // ProductEvent.EventType -> AdEventType 변환
        AdEventType adEventType = switch (event.getEventType()) {
            case NEW -> AdEventType.NEW;
            case DISCOUNT ->  AdEventType.DISCOUNT;
        };

        // Python FastAPI로 HTTP POST를 보냄 + 응답을 DB에 저장
        agentWebClient.post()
                .uri("")
                .bodyValue(event)
                .retrieve()
                .bodyToMono(String.class)
                .doOnSuccess(res -> {
                    log.info("[Agent 응답] : {}", res); // Agent가 생성한 광고글 DB에 저장
                    String aiResponse = extractAiResponse(res);
                    advertisementService.save(event.getId(), adEventType, aiResponse);
                })//res -> log.info("[Agent 응답] {}", res))
                .doOnError(e -> log.error("[Agent 호출 실패] {}", e.getMessage()))
                .subscribe();
    }

    // Agent 응답 전체 JSON에서 aiResponse 필드만 추출하는 함수
    private String extractAiResponse(String res) {
        try {
            JsonNode root = objectMapper.readTree(res);
            JsonNode aiResponse = root.get("aiResponse");

            if (aiResponse == null) {
                log.warn("[[aiResponse 추출 실패] aiResponse 필드 없음");
                return res; // 원본 저장
            }

            // aiResponse가 JSON 문자열로 이중 직렬화된 경우 -> 한 번 더 파싱해서 정제된 JSON으로 저장
            String aiResponseText = aiResponse.asText();
            JsonNode aiResponseJson = objectMapper.readTree(aiResponseText);
            return objectMapper.writeValueAsString(aiResponseJson);
        } catch (Exception e) {
            log.error("[aiResponse 파싱 실패] {}", e.getMessage());
            return res; // 원본 저장
        }
    }
}
