package com.capstone.triplea.common.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

// ValidPriceRange의 실제 검증 로직

public class PriceRangeValidator implements ConstraintValidator<ValidPriceRange, PriceRangeValidatable> {
    @Override
    public boolean isValid(PriceRangeValidatable dto, ConstraintValidatorContext context) {
        if (dto.getListPrice() == null || dto.getPrice() == null) {
            return true;    // = @NotNull에 맡김
        }
        return dto.getPrice() <= dto.getListPrice();    // 검증
    }
}
