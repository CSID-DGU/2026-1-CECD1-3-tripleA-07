package com.capstone.triplea.advertisement;

import com.capstone.triplea.advertisement.dto.AdvertisementResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/advertisements")
@Tag(name = "Advertisement", description = "광고 이력 API")
@RequiredArgsConstructor
public class AdvertisementController {
    private final AdvertisementService advertisementService;

    @Operation(
            summary = "광고 이력 전체 조회",
            description = "productId 없이 호출하면 전체 광고 이력, productId를 넘기면 해당 상품의 광고 이력을 반환"
    )
    @GetMapping
    public ResponseEntity<List<AdvertisementResponseDto>> getAdvertisements(
            @Parameter(description = "상품 id (선택)")
            @RequestParam(required = false) Long productId) {
        return ResponseEntity.ok(advertisementService.findAdvertisements(productId));
    }
}
