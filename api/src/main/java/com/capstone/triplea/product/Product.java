package com.capstone.triplea.product;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "PRODUCT")
/*@SequenceGenerator(
        name = "PRODUCT_SEQ_GENERATOR",
        sequenceName = "PRODUCT_SEQ",
        initialValue = 1, allocationSize = 1)*/
@Getter
@Setter
@Builder
@NoArgsConstructor //(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Auto Increment
    @Column(name="id")
    private Long id;              // 고유 id

    @Column(name="name", nullable = false)
    private String name;          // 상품명

    @Column(name="description")
    private String description;   // 상품 설명

    @Column(name="list_price", nullable = false)
    private int listPrice;       // 정가

    @Column(name="price", nullable = false)
    private int price; // 판매가 = list_price*(1-discount)

    @Column(name="quantity", nullable = false)
    private int quantity;       // 수량

    @Column(name="created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name="updated_at")
    private LocalDateTime updatedAt;

    @Column(name="image_url")
    private String imageUrl;    // 이미지 URL

    @Column(name="category")
    private String category;    // 카테고리 (생략 가능)

    // UUID 자동 생성 + 등록 시각 자동 세팅
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    // 수정 시각 자동 세팅 -> 수정 시각 저장할거면 사용
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
