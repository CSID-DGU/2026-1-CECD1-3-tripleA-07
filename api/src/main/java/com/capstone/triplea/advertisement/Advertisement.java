package com.capstone.triplea.advertisement;

import com.capstone.triplea.product.Product;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "ADVERTISEMENT")
@SequenceGenerator(
        name = "ADVERTISEMENT_SEQ_GENERATOR",
        sequenceName = "ADVERTISEMENT_SEQ",
        initialValue = 1, allocationSize = 1
)
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Advertisement {

    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "ADVERTISEMENT_SEQ_GENERATOR"
    )
    @Column(name = "id")
    private Long id;                // 광고 이력 id

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;        // 상품 id (FK)

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false, length = 20)
    private AdEventType eventType;  // 이벤트 유형

    @Column(name = "ad_url")
    private String adUrl;           // 광고글 링크

    @Column(name = "ad_content", columnDefinition = "CLOB")
    private String adContent;       // 광고글 내용

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;    // 생성일

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
