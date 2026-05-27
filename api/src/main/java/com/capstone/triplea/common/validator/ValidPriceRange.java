package com.capstone.triplea.common.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

// 커스텀 validation 어노테이션

@Target(ElementType.TYPE)   // 클래스 레벨에만 붙일 수 있게 제한
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = PriceRangeValidator.class) // 실제 검증 로직에 연결
public @interface ValidPriceRange {
    String message() default "판매가는 정가 이하여야 합니다";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
