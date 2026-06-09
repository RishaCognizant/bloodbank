package com.bloodbank.config;

import com.bloodbank.model.BloodInventory;
import com.bloodbank.model.Role;
import com.bloodbank.model.User;
import com.bloodbank.repository.BloodInventoryRepository;
import com.bloodbank.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired private UserRepository userRepository;
    @Autowired private BloodInventoryRepository inventoryRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    private static final List<String> BLOOD_GROUPS = List.of("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-");

    @Override
    public void run(String... args) {
        initAdmin();
        initBloodInventory();
    }

    private void initAdmin() {
        if (!userRepository.existsByEmail("admin@bloodbank.com")) {
            User admin = User.builder()
                    .firstName("Admin")
                    .lastName("User")
                    .email("admin@bloodbank.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .role(Role.ADMIN)
                    .bloodGroup("O+")
                    .phone("9999999999")
                    .city("HQ")
                    .active(true)
                    .build();
            userRepository.save(admin);
            logger.info("Default admin created: admin@bloodbank.com / Admin@123");
        }
    }

    private void initBloodInventory() {
        for (String group : BLOOD_GROUPS) {
            if (inventoryRepository.findByBloodGroup(group).isEmpty()) {
                inventoryRepository.save(BloodInventory.builder()
                        .bloodGroup(group)
                        .units(0)
                        .build());
            }
        }
        logger.info("Blood inventory initialized for all blood groups.");
    }
}
