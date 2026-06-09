package com.bloodbank.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI bloodBankOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Blood Bank Management System API")
                        .description("""
                                REST API for the Blood Bank Management System.

                                **Authentication:** Most endpoints require a JWT Bearer token.
                                1. Call `POST /api/auth/login` to get a token.
                                2. Click **Authorize** and enter: `<your-token>` (without "Bearer" prefix).
                                """)
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Blood Bank Team")
                                .email("admin@bloodbank.com")))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth", new SecurityScheme()
                                .name("bearerAuth")
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Paste your JWT token from /api/auth/login")));
    }
}
