package com.bloodbank.controller;

import com.bloodbank.dto.ApiResponse;
import com.bloodbank.dto.InventoryUpdateDTO;
import com.bloodbank.service.BloodInventoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inventory")
@Tag(name = "Blood Inventory", description = "View and update blood stock levels by blood group")
public class BloodInventoryController {

    @Autowired private BloodInventoryService inventoryService;

    @Operation(summary = "Get all inventory", description = "Returns stock levels for all blood groups.")
    @GetMapping
    public ResponseEntity<?> getAllInventory() {
        return ResponseEntity.ok(inventoryService.getAllInventory());
    }

    @Operation(summary = "Get inventory by blood group", description = "e.g. bloodGroup = A_POSITIVE, O_NEGATIVE")
    @GetMapping("/{bloodGroup}")
    public ResponseEntity<?> getByBloodGroup(@PathVariable String bloodGroup) {
        try {
            return ResponseEntity.ok(inventoryService.getByBloodGroup(bloodGroup));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Update inventory", description = "Set or adjust the available units for a given blood group.")
    @PutMapping("/update")
    public ResponseEntity<?> updateInventory(@Valid @RequestBody InventoryUpdateDTO dto) {
        try {
            return ResponseEntity.ok(new ApiResponse(true, "Inventory updated", inventoryService.updateInventory(dto)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
}
