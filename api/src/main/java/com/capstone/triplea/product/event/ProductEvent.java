package com.capstone.triplea.product.event;

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

    private final Long id;
    private final String name;
    private final String description;
    private final int listPrice;
    private final int price;
    private final String category;
    private final String imageUrl;
    private final EventType eventType;

    // AI Agent에 전달할 JSON 구조
    public Map<String, Object> toMarketingContext() {
        Map<String, Object> context = new LinkedHashMap<>();
        context.put("eventType", eventType.name()); // NEW or DISCOUNT
        context.put("productId", id);

        //  DISCOUNT일 때만 changed 필드 포함
        if (eventType == EventType.DISCOUNT) {
            Map<String, Object> changed = new LinkedHashMap<>();
            context.put("name", name);
            context.put("description", description);
            context.put("listPrice", listPrice);
            context.put("price", price);
            context.put("category", category);
            context.put("imageUrl", imageUrl);
            context.put("changed", changed);
        }

        return context;
    }
}
