package com.capstone.triplea.product.event;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

import java.util.LinkedHashMap;
import java.util.Map;

@Getter
@Builder
public class ProductEvent {
    public enum EventType {
        NEW,        // TRG_PRD_001: 신제품 홍보
        DISCOUNT    // TRG_PRD_002: 할인 홍보
    }

    @Getter
    @Builder
    public static class ProductSnapshot {
        private final String name;
        private final String description;
        private final int listPrice;
        private final int price;
        private final String category;
        private final String imageUrl;
    }

    private final Long id;
    private final EventType eventType;
    private final ProductSnapshot productNew;
    private final ProductSnapshot productOld;

    // AI Agent에 전달할 JSON 구조
    public Map<String, Object> toMarketingContext() {
        Map<String, Object> context = new LinkedHashMap<>();
        context.put("eventType", eventType.name()); // NEW or DISCOUNT
        context.put("productId", id);
        context.put("product_new", productNew);

        if (eventType == EventType.DISCOUNT) {
            context.put("product_old", productOld);
        }

        return context;
    }
}
