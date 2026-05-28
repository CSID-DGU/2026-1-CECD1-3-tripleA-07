package com.capstone.triplea.common.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = GreaterThanValidator.class)
@Repeatable(GreaterThan.List.class)
public @interface GreaterThan {
    String message() default "invalid";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
    String field();     // 큰 값이어야 하는 필드 (listPrice)
    String comparedField(); // 작은 값이어야 하는 필드 (price)

    @Target(ElementType.TYPE)
    @Retention(RetentionPolicy.RUNTIME)
    @interface List {
        GreaterThan[] value();
    }
}
