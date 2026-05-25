package com.capstone.triplea.advertisement;

import com.capstone.triplea.advertisement.dto.AdvertisementResponseDto;

import com.capstone.triplea.product.Product;
import com.capstone.triplea.product.ProductRepository;
import com.capstone.triplea.product.exception.ProductNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdvertisementService {
    private final AdvertisementRepository advertisementRepository;
    private final ProductRepository productRepository;

    // AI Agent 응답을 받아 광고 이력 저장
    @Transactional
    public AdvertisementResponseDto save(Long productId, AdEventType eventType, String adContent) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));
        Advertisement advertisement = Advertisement.builder()
                .product(product)
                .eventType(eventType)
                .adUrl(null)        // [todo] Facebook 연동 전 null
                .adContent(adContent)
                .build();
        Advertisement saved = advertisementRepository.save(advertisement);
        log.info("[광고 이력 저장] id={}, productId={}, eventType={}", saved.getId(), productId, eventType);

        return AdvertisementResponseDto.from(saved);
    }

    // 특정 상품의 광고 이력 전체 조회
    /*
    * productId 있으면 해당 상품의 광고 이력만 반환
    * productId 없으면 전체 광고 이력 반환
    */
    @Transactional(readOnly = true)
    public List<AdvertisementResponseDto> findAdvertisements(Long productId) {
        List<Advertisement> advertisements = (productId != null)
                ? advertisementRepository.findByProductIdOrderByCreatedAtDesc(productId)
                : advertisementRepository.findAllOrderByCreatedAtDesc();

        return advertisements.stream()
                .map(AdvertisementResponseDto::from)
                .toList();
    }
}