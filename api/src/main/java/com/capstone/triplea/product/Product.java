package com.capstone.triplea.product;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "PRODUCT")
@SequenceGenerator(
        name = "PRODUCT_SEQ_GENERATOR",
        sequenceName = "PRODUCT_SEQ",
        initialValue = 1, allocationSize = 1)
@Getter
@Setter
@Builder
public class Product {
    @Id
    @GeneratedValue(generator = "PRODUCT_SEQ_GENERATOR")
    private Long id;
    private String name;
}
