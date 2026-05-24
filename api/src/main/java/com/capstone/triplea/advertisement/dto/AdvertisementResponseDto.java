package com.capstone.triplea.advertisement.dto;

import com.capstone.triplea.advertisement.AdEventType;
import com.capstone.triplea.advertisement.Advertisement;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class AdvertisementResponseDto {
    private Long id;
    private Long productId;
    private AdEventType eventType;
    private String adUrl;
    private String adContent;
    private LocalDateTime createdAt;

    public static AdvertisementResponseDto from(Advertisement advertisement) {
        return AdvertisementResponseDto.builder()
                .id(advertisement.getId())
                .productId(advertisement.getProduct().getId())
                .eventType(advertisement.getEventType())
                .adUrl(advertisement.getAdUrl())
                .adContent(advertisement.getAdContent())
                .createdAt(advertisement.getCreatedAt())
                .build();
    }

}
