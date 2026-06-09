package com.bloodbank.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ManualApproveDTO {
    @NotBlank(message = "Blood group is required")
    private String bloodGroup;
    
    private String message;
}
