package com.capstone.triplea.advertisement;

import com.capstone.triplea.advertisement.dto.AdvertisementResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/advertisements")
@Tag(name = "Advertisement", description = "광고 이력 API")
@RequiredArgsConstructor
public class AdvertisementController {
    private final AdvertisementRepository advertisementRepository;
    private final AdvertisementService advertisementService;

    @Operation(summary = "특정 상품의 광고 이력 전체 조회")
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<AdvertisementResponseDto>> getAdvertisementsByProductId(
            @PathVariable long productId) {
        return ResponseEntity.ok(advertisementService.findByProductId(productId));
    }
}
