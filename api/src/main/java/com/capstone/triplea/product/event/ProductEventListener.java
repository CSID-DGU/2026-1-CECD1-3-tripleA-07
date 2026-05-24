package com.capstone.triplea.product.event;

import com.capstone.triplea.advertisement.AdEventType;
import com.capstone.triplea.advertisement.AdvertisementService;
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
                .doOnSuccess(adContent -> {
                    log.info("[Agent 응답] : {}", adContent); // Agent가 생성한 광고글 DB에 저장
                    advertisementService.save(event.getId(), adEventType, adContent);
                })//res -> log.info("[Agent 응답] {}", res))
                .doOnError(e -> log.error("[Agent 호출 실패] {}", e.getMessage()))
                .subscribe();
    }
}
