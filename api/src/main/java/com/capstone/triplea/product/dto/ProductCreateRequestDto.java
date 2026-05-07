package com.capstone.triplea.product.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

@Getter
@Setter
public class ProductCreateRequestDto {
    @NotBlank
    @Length(max = 255)
    private String name;
}
