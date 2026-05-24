package com.capstone.triplea.advertisement;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdvertisementRepository extends JpaRepository<Advertisement, Integer> {

    // 특정 상품의 광고 이력 전체 조회
    List<Advertisement> findByProductIdOrderByCreatedAtDesc(Long productId);
}
