package com.capstone.triplea.product.event;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class ProductEventListener {

    private final WebClient webClient;

    // 동작 규칙 3: 비동기 처리 - 상품 등록/수정 응답에 영향을 주지 않음
    @Async
    // DB 커밋 완료 후에만 실행
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleProductEvent(ProductEvent event) {
        log.info("=== [트리거 발동] ===");
        log.info("eventType   : {}", event.getEventType());
        log.info("productId   : {}", event.getId());
        log.info("name        : {}", event.getName());
        log.info("price       : {}", event.getPrice());
        log.info("====================");

        // AI Agent에게 전달할 JSON 컨텍스트
        Map<String, Object> context = event.toMarketingContext();

        // Python FastAPI로 HTTP POST를 보냄
        webClient.post()
                .uri("/api/v1/agent")
                .bodyValue(context)
                .retrieve()
                .bodyToMono(String.class)
                .doOnSuccess(res -> log.info("[Agent 응답] {}", res))
                .doOnError(e -> log.error("[Agent 호출 실패] {}", e.getMessage()))
                .subscribe();
    }
}
