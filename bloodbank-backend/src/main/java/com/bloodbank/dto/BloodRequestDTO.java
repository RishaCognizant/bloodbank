package com.bloodbank.dto;

import com.bloodbank.model.Severity;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BloodRequestDTO {
    @NotBlank
    private String patientName;
    @NotBlank
    private String bloodGroup;
    @NotNull @Min(1)
    private Integer units;
    private String purpose;
    @NotBlank
    private String hospital;
    private String contactPhone;

    @NotNull
    private Severity severity;
}
