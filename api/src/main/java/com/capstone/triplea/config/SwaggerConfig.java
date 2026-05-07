package com.capstone.triplea.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info().title("트리플에이 API")
                        .description("트리플에이 프로젝트 API 명세서입니다.")
                        .version("v1.0.0"));
    }
}
