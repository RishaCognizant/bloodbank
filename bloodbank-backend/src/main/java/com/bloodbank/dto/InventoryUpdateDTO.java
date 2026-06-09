package com.bloodbank.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class InventoryUpdateDTO {
    @NotBlank
    private String bloodGroup;
    @Min(0)
    private int units;
}
