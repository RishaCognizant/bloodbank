package com.bloodbank.controller;

import com.bloodbank.dto.ApiResponse;
import com.bloodbank.dto.DonationRecordDTO;
import com.bloodbank.model.User;
import com.bloodbank.service.DonationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/donations")
@Tag(name = "Donations", description = "Schedule, manage, and track blood donations")
public class DonationController {

    @Autowired private DonationService donationService;

    @Operation(summary = "Schedule a donation", description = "Authenticated user schedules a future blood donation.")
    @PostMapping("/schedule")
    public ResponseEntity<?> scheduleDonation(@AuthenticationPrincipal User user,
                                               @Valid @RequestBody DonationRecordDTO dto) {
        try {
            return ResponseEntity.ok(new ApiResponse(true, "Donation scheduled", donationService.scheduleDonation(user, dto)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @Operation(summary = "Admin: record a donation", description = "Admin manually records a completed donation for any user.")
    @PostMapping("/admin/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> adminAddDonation(@Valid @RequestBody DonationRecordDTO dto) {
        try {
            return ResponseEntity.ok(new ApiResponse(true, "Donation recorded", donationService.adminAddDonation(dto)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @Operation(summary = "Admin: list all donations")
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllDonations() {
        return ResponseEntity.ok(donationService.getAllDonations());
    }

    @Operation(summary = "Get my donations", description = "Returns all donations for the authenticated user.")
    @GetMapping("/my")
    public ResponseEntity<?> getMyDonations(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(donationService.getUserDonations(user));
    }

    @Operation(summary = "Admin: mark donation completed", description = "Marks the donation as COMPLETED and updates inventory.")
    @PutMapping("/{id}/complete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> completeDonation(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(new ApiResponse(true, "Donation completed", donationService.completeDonation(id)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @Operation(summary = "Cancel a donation", description = "Cancel a scheduled donation by ID.")
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelDonation(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(new ApiResponse(true, "Donation cancelled", donationService.cancelDonation(id)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
}
