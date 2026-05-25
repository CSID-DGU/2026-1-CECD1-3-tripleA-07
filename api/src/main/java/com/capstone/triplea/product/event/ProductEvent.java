package com.capstone.triplea.product.event;

import com.capstone.triplea.advertisement.AdEventType;
import com.capstone.triplea.product.Product;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL) // null인 필드 JSON에서 제외
public class ProductEvent {

    @Getter
    @Builder
    public static class ProductSnapshot {
        private final String name;
        private final String description;
        private final int listPrice;
        private final int price;
        private final int quantity;
        private final String category;
        private final String imageUrl;

        // ProductSnapshot에 Product 엔티티를 받는 메서드
        public static ProductSnapshot from(Product product) {
            return ProductSnapshot.builder()
                    .name(product.getName())
                    .description(product.getDescription())
                    .listPrice(product.getListPrice())
                    .price(product.getPrice())
                    .quantity(product.getQuantity())
                    .category(product.getCategory())
                    .imageUrl(product.getImageUrl())
                    .build();
        }
    }

    @JsonProperty("productId")
    private final Long id;

    private final AdEventType eventType;

    private final ProductSnapshot productNew;

    private final ProductSnapshot productOld;
}
