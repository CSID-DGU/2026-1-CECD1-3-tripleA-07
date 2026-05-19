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
    // 필드 추가
    private final String oldName;
    private final String oldDescription;
    private final int oldListPrice;
    private final int oldPrice;
    private final String oldCategory;
    private final String oldImageUrl;

    // AI Agent에 전달할 JSON 구조
    public Map<String, Object> toMarketingContext() {
        Map<String, Object> context = new LinkedHashMap<>();
        context.put("eventType", eventType.name()); // NEW or DISCOUNT
        context.put("productId", id);

        // product_new
        Map<String, Object> productNew = new LinkedHashMap<>();
        productNew.put("name", name);
        productNew.put("description", description);
        productNew.put("listPrice", listPrice);
        productNew.put("price", price);
        productNew.put("category", category);
        productNew.put("imageUrl", imageUrl);
        context.put("product_new", productNew);

        //  DISCOUNT일 때만 product_old 전송
        if (eventType == EventType.DISCOUNT) {
            Map<String, Object> productOld = new LinkedHashMap<>();
            productOld.put("name", oldName);
            productOld.put("description", oldDescription);
            productOld.put("listPrice", oldListPrice);
            productOld.put("price", oldPrice);
            productOld.put("category", oldCategory);
            productOld.put("imageUrl", oldImageUrl);
            context.put("product_old", productOld);
        }

        return context;
    }
}
