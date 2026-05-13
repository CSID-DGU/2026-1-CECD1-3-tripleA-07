package com.capstone.triplea.product.dto;

import com.capstone.triplea.product.Product;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ProductResponseDto {
    private Long id;
    private String name;
    private String description;
    private int listPrice;
    private int price;
    private int quantity;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String imageUrl;
    private String category;

/*    // Product 엔티티를 받아서 DTO로 변환
    public ProductResponseDto(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.description = product.getDescription();
        this.listPrice = product.getListPrice();
        this.price = product.getPrice();
        this.quantity = product.getQuantity();
        this.createdAt = product.getCreatedAt();
        this.updatedAt = product.getUpdatedAt();
        this.imageUrl = product.getImageUrl();
        this.category = product.getCategory();
    }*/
}
