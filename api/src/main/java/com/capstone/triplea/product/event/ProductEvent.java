package com.capstone.triplea.product.event;

import com.capstone.triplea.product.Product;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL) // null인 필드 JSON에서 제외
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

        // ProductSnapshot에 Product 엔티티를 받는 메서드
        public static ProductSnapshot from(Product product) {
            return ProductSnapshot.builder()
                    .name(product.getName())
                    .description(product.getDescription())
                    .listPrice(product.getListPrice())
                    .price(product.getPrice())
                    .category(product.getCategory())
                    .imageUrl(product.getImageUrl())
                    .build();
        }
    }

    private final Long id;
    private final EventType eventType;

    @JsonProperty("product_new")
    private final ProductSnapshot productNew;

    @JsonProperty("product_old")
    private final ProductSnapshot productOld;
}
