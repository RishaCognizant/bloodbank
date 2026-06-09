package com.bloodbank.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RequestActionDTO {
    @NotBlank
    private String action; // APPROVED or REJECTED
    private String message;
}
