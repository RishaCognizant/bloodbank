package com.bloodbank.controller;

import com.bloodbank.dto.ApiResponse;
import com.bloodbank.dto.LoginRequest;
import com.bloodbank.dto.RegisterRequest;
import com.bloodbank.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Register, login, OTP verification")
@SecurityRequirements
public class AuthController {

    @Autowired private AuthService authService;

    @Operation(summary = "Login", description = "Authenticate with email and password. Returns a JWT token.")
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            return ResponseEntity.ok(authService.login(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Invalid email or password"));
        }
    }
 
    @Operation(summary = "Register", description = "Create a new user account.")
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            return ResponseEntity.ok(new ApiResponse(true, "Registration successful", authService.register(request)));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

 
    @Operation(summary = "Send OTP", description = "Send a one-time password to the given email for verification.")
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestParam String email) {
    try {
        authService.sendVerificationOtp(email);
        return ResponseEntity.ok(new ApiResponse(true, "OTP sent successfully"));
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(new ApiResponse(false, "Error sending OTP"));
    }
    }
 
    @Operation(summary = "Verify OTP", description = "Verify the OTP sent to the user's email address.")
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestParam String email, @RequestParam String otp) {
    boolean isValid = authService.verifyOtp(email, otp);
    if (isValid) {
        return ResponseEntity.ok(new ApiResponse(true, "Email verified successfully"));
    } else {
        return ResponseEntity.badRequest().body(new ApiResponse(false, "Invalid or expired OTP"));
    }
    }
}