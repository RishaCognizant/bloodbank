package com.bloodbank.controller;

import com.bloodbank.dto.ApiResponse;
import com.bloodbank.model.User;
import com.bloodbank.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@Tag(name = "User Profile", description = "View and update the authenticated user's profile")
public class UserController {

    @Autowired private UserService userService;

    @Operation(summary = "Get my profile", description = "Returns the full profile of the currently authenticated user.")
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(user);
    }

    @Operation(summary = "Update my profile", description = "Update name, phone, address, or blood group for the authenticated user.")
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal User user,
                                            @RequestBody User updates) {
        try {
            return ResponseEntity.ok(new ApiResponse(true, "Profile updated", userService.updateProfile(user.getId(), updates)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
}
