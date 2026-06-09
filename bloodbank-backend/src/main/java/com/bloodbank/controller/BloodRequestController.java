package com.bloodbank.controller;

import com.bloodbank.dto.ApiResponse;
import com.bloodbank.dto.BloodRequestDTO;
import com.bloodbank.dto.ManualApproveDTO;
import com.bloodbank.dto.RequestActionDTO;
import com.bloodbank.dto.SmartApproveResultDTO;
import com.bloodbank.model.Severity;
import com.bloodbank.model.User;
import com.bloodbank.service.BloodRequestService;
import com.bloodbank.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/requests")
@Tag(name = "Blood Requests", description = "Create, view, approve, and manage blood requests")
public class BloodRequestController {

    @Autowired private BloodRequestService requestService;
    @Autowired private DashboardService dashboardService;

    @Operation(summary = "Submit a blood request", description = "Authenticated user submits a new blood request with severity and blood group.")
    @PostMapping
    public ResponseEntity<?> createRequest(@AuthenticationPrincipal User user,
                                            @Valid @RequestBody BloodRequestDTO dto) {
        try {
            return ResponseEntity.ok(new ApiResponse(true, "Request submitted", requestService.createRequest(user, dto)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @Operation(summary = "List all requests", description = "Optionally filter by severity (URGENT, HIGH, MEDIUM, LOW).")
    @GetMapping
    public ResponseEntity<?> getAllRequests(@RequestParam(required = false) Severity severity) {
        return ResponseEntity.ok(requestService.getAllRequests(severity));
    }

    @Operation(summary = "Get my requests", description = "Returns all blood requests submitted by the authenticated user.")
    @GetMapping("/my")
    public ResponseEntity<?> getMyRequests(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(requestService.getUserRequests(user));
    }

    @Operation(summary = "Get request by ID")
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(requestService.getById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Smart approve", description = "Auto-selects the best compatible blood group from available stock and approves the request.")
    @PostMapping("/{id}/smart-approve")
    public ResponseEntity<?> smartApprove(@PathVariable Long id) {
        try {
            SmartApproveResultDTO result = requestService.smartApprove(id);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @Operation(summary = "Send donor emails", description = "Emails compatible donors for the given blood request.")
    @PostMapping("/{id}/send-donor-emails")
    public ResponseEntity<?> sendDonorEmails(@PathVariable Long id) {
        try {
            SmartApproveResultDTO result = requestService.sendDonorEmails(id);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @Operation(summary = "Get compatible stocks", description = "Returns available units for all blood groups compatible with the given one.")
    @GetMapping("/compatible-stocks/{bloodGroup}")
    public ResponseEntity<?> getCompatibleStocks(@PathVariable String bloodGroup) {
        try {
            return ResponseEntity.ok(requestService.getCompatibleStocks(bloodGroup));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @Operation(summary = "Manual approve", description = "Admin manually approves a request by specifying the exact blood group to allocate.")
    @PostMapping("/{id}/manual-approve")
    public ResponseEntity<?> manualApprove(@PathVariable Long id,
                                            @Valid @RequestBody ManualApproveDTO dto) {
        try {
            return ResponseEntity.ok(new ApiResponse(true, "Request approved", 
                    requestService.manualApprove(id, dto.getBloodGroup(), dto.getMessage())));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ApiResponse(false, "Error processing request: " + e.getMessage()));
        }
    }

    @Operation(summary = "Process request action", description = "Approve, reject, or complete a blood request with an optional message.")
    @PutMapping("/{id}/action")
    public ResponseEntity<?> processRequest(@PathVariable Long id,
                                             @Valid @RequestBody RequestActionDTO actionDTO) {
        try {
            return ResponseEntity.ok(new ApiResponse(true, "Request updated", requestService.processRequest(id, actionDTO)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @Operation(summary = "Delete a request")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRequest(@PathVariable Long id) {
        requestService.deleteRequest(id);
        return ResponseEntity.ok(new ApiResponse(true, "Request deleted"));
    }

    @Operation(summary = "Get my stats", description = "Returns total requests, approved, pending counts for the authenticated user.")
    @GetMapping("/stats/user")
    public ResponseEntity<?> getUserStats(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(dashboardService.getUserStats(user));
    }
}
