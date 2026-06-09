package com.bloodbank.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompatibleStockDTO {
    private String bloodGroup;
    private int units;
    private boolean isExactMatch;
}
