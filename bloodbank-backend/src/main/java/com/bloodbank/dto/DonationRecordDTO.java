package com.bloodbank.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class DonationRecordDTO {
    @NotBlank
    private String bloodGroup;
    private int units = 1;
    @NotNull
    private LocalDate donationDate;
    @NotBlank
    private String location;
    private String notes;
    private Long userId;
}
