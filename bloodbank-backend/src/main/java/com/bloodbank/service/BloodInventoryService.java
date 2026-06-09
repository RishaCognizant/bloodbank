package com.bloodbank.service;

import com.bloodbank.dto.InventoryUpdateDTO;
import com.bloodbank.model.BloodInventory;
import com.bloodbank.model.Role;
import com.bloodbank.repository.BloodInventoryRepository;
import com.bloodbank.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BloodInventoryService {

    private static final int LOW_STOCK_THRESHOLD = 10;

    @Autowired private BloodInventoryRepository inventoryRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private EmailService emailService;

    public List<BloodInventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    public BloodInventory getByBloodGroup(String bloodGroup) {
        return inventoryRepository.findByBloodGroup(bloodGroup)
                .orElseThrow(() -> new RuntimeException("Blood group not found: " + bloodGroup));
    }

    public BloodInventory updateInventory(InventoryUpdateDTO dto) {
        BloodInventory inventory = inventoryRepository.findByBloodGroup(dto.getBloodGroup())
                .orElse(BloodInventory.builder().bloodGroup(dto.getBloodGroup()).build());
        inventory.setUnits(dto.getUnits());
        BloodInventory saved = inventoryRepository.save(inventory);
        if (saved.getUnits() <= LOW_STOCK_THRESHOLD) {
            notifyAdminsLowStock(saved);
        }
        return saved;
    }

    public BloodInventory addUnits(String bloodGroup, int units) {
        BloodInventory inventory = getByBloodGroup(bloodGroup);
        inventory.setUnits(inventory.getUnits() + units);
        return inventoryRepository.save(inventory);
    }

    public boolean deductUnits(String bloodGroup, int units) {
        BloodInventory inventory = getByBloodGroup(bloodGroup);
        if (inventory.getUnits() < units) return false;
        inventory.setUnits(inventory.getUnits() - units);
        inventoryRepository.save(inventory);
        return true;
    }

    @Scheduled(cron = "0 0 8 * * MON")
    public void weeklyLowStockCheck() {
        List<BloodInventory> lowStock = inventoryRepository.findByUnitsLessThan(LOW_STOCK_THRESHOLD);
        lowStock.forEach(this::notifyAdminsLowStock);
    }

    private void notifyAdminsLowStock(BloodInventory inventory) {
        userRepository.findByRole(Role.ADMIN)
                .forEach(admin -> emailService.sendLowInventoryAlert(admin.getEmail(), inventory));
    }
}
