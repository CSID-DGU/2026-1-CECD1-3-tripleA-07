package com.capstone.triplea.common.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;

public class GreaterThanValidator implements ConstraintValidator<GreaterThan, Object> {

    private String field;
    private String comparedField;
    private String message;

    @Override
    public void initialize(GreaterThan annotation) {
        this.field = annotation.field();
        this.comparedField = annotation.comparedField();
        this.message = annotation.message();
    }

    @Override
    public boolean isValid(Object obj, ConstraintValidatorContext context) {
        BeanWrapper wrapper = new BeanWrapperImpl(obj);

        Integer fieldValue = (Integer) wrapper.getPropertyValue(field);
        Integer comparedValue = (Integer) wrapper.getPropertyValue(comparedField);

        if (fieldValue == null || comparedValue == null) {   // @NotNull에 맡김
            return true;
        }

        boolean valid = comparedValue <= fieldValue;

        if (!valid) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(message)
                    .addPropertyNode(comparedField)
                    .addConstraintViolation();
        }

        return valid;
    }
}
