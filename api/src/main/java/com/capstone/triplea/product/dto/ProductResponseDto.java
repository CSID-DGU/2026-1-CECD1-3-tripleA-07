package com.capstone.triplea.product.dto;

import com.capstone.triplea.product.Product;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
//@Setter
//@Builder
public class ProductResponseDto {
    private final String id;
    private final String name;
    private final String description;
    private final int listPrice;
    private final double discountPrice;
    private final int price;
    private final int quantity;
    private final LocalDateTime createdAt;
    private final String imageUrl;
    private final String category;

    // Product 엔티티를 받아서 DTO로 변환
    public ProductResponseDto(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.description = product.getDescription();
        this.listPrice = product.getListPrice();
        this.discountPrice = product.getDiscountRate();
        this.price = product.getPrice();
        this.quantity = product.getQuantity();
        this.createdAt = product.getCreatedAt();
        this.imageUrl = product.getImageUrl();
        this.category = product.getCategory();
    }
}
