package com.bloodbank.service;

import com.bloodbank.config.BloodCompatibilityUtil;
import com.bloodbank.dto.BloodRequestDTO;
import com.bloodbank.dto.CompatibleStockDTO;
import com.bloodbank.dto.RequestActionDTO;
import com.bloodbank.dto.SmartApproveResultDTO;
import com.bloodbank.model.BloodRequest;
import com.bloodbank.model.RequestStatus;
import com.bloodbank.model.Role;
import com.bloodbank.model.Severity;
import com.bloodbank.model.User;
import com.bloodbank.repository.BloodInventoryRepository;
import com.bloodbank.repository.BloodRequestRepository;
import com.bloodbank.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BloodRequestService {

    @Autowired private BloodRequestRepository requestRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private EmailService emailService;
    @Autowired private BloodInventoryRepository inventoryRepository;

    public BloodRequest createRequest(User user, BloodRequestDTO dto) {
        boolean isUrgent = dto.getSeverity() == Severity.URGENT;

        BloodRequest request = BloodRequest.builder()
                .user(user)
                .patientName(dto.getPatientName())
                .bloodGroup(dto.getBloodGroup())
                .units(dto.getUnits())
                .purpose(dto.getPurpose())
                .hospital(dto.getHospital())
                .contactPhone(dto.getContactPhone())
                .status(RequestStatus.PENDING)
                .emergency(isUrgent)
                .severity(dto.getSeverity())
                .build();
        BloodRequest saved = requestRepository.save(request);
        emailService.sendBloodRequestConfirmation(saved);

        if (isUrgent) {
            List<User> admins = userRepository.findByRole(Role.ADMIN);
            for (User admin : admins) {
                emailService.sendUrgentRequestAlert(admin.getEmail(), saved);
            }
        }
        return saved;
    }

    public List<BloodRequest> getAllRequests() {
        return requestRepository.findAllPrioritized();
    }

    public List<BloodRequest> getAllRequests(Severity severity) {
        if (severity == null) return getAllRequests();
        return requestRepository.findBySeverityOrderByRequestDateDesc(severity);
    }

    public List<BloodRequest> getUserRequests(User user) {
        return requestRepository.findByUserOrderByRequestDateDesc(user);
    }

    public BloodRequest getById(Long id) {
        return requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found: " + id));
    }

    public BloodRequest processRequest(Long id, RequestActionDTO actionDTO) {
        BloodRequest request = getById(id);
        RequestStatus newStatus = RequestStatus.valueOf(actionDTO.getAction().toUpperCase());
        request.setStatus(newStatus);
        request.setAdminMessage(actionDTO.getMessage());
        request.setApprovedDate(LocalDateTime.now());
        BloodRequest saved = requestRepository.save(request);

        if (newStatus == RequestStatus.APPROVED) {
            emailService.sendRequestApproved(saved);
        } else if (newStatus == RequestStatus.REJECTED) {
            emailService.sendRequestRejected(saved);
        }
        return saved;
    }

    /**
     * Smart approval: Returns compatible blood groups with their stock levels for admin to manually select.
     * Does NOT auto-approve or auto-send emails - gives admin control over the decision.
     */
    public SmartApproveResultDTO smartApprove(Long id) {
        BloodRequest request = getById(id);
        List<String> compatibleGroups = BloodCompatibilityUtil.getCompatibleDonorGroups(request.getBloodGroup());

        // Build list of compatible stocks with their current inventory
        List<CompatibleStockDTO> compatibleStocks = compatibleGroups.stream()
                .map(group -> {
                    int units = inventoryRepository.findByBloodGroup(group)
                            .map(inv -> inv.getUnits())
                            .orElse(0);
                    return CompatibleStockDTO.builder()
                            .bloodGroup(group)
                            .units(units)
                            .isExactMatch(group.equals(request.getBloodGroup()))
                            .build();
                })
                .collect(Collectors.toList());

        // Check if any compatible group has sufficient stock
        boolean hasSufficientStock = compatibleStocks.stream()
                .anyMatch(stock -> stock.getUnits() >= request.getUnits());

        return SmartApproveResultDTO.builder()
                .approved(false) // Not auto-approved - admin needs to select
                .compatibleGroupsChecked(compatibleGroups)
                .compatibleStocks(compatibleStocks)
                .hasSufficientStock(hasSufficientStock)
                .donorsContacted(0) // Not contacted yet
                .reason(hasSufficientStock ? "PENDING_SELECTION" : "INSUFFICIENT_STOCK")
                .build();
    }

    /**
     * Send emails to all compatible donors requesting blood donation.
     * Also notifies admins. Request status remains PENDING.
     */
    public SmartApproveResultDTO sendDonorEmails(Long id) {
        BloodRequest request = getById(id);
        List<String> compatibleGroups = BloodCompatibilityUtil.getCompatibleDonorGroups(request.getBloodGroup());

        // Find and email all compatible donors
        List<User> potentialDonors = userRepository.findAll().stream()
                .filter(u -> u.getRole() == com.bloodbank.model.Role.USER)
                .filter(u -> u.isActive())
                .filter(u -> u.getBloodGroup() != null && !u.getBloodGroup().isBlank())
                .filter(u -> compatibleGroups.contains(u.getBloodGroup()))
                .collect(Collectors.toList());

        potentialDonors.forEach(donor -> emailService.sendDonorCallToAction(donor, request));

        // Notify admins about the situation
        userRepository.findByRole(Role.ADMIN)
                .forEach(admin -> emailService.sendAdminNoStockAlert(admin.getEmail(), request, potentialDonors.size()));

        return SmartApproveResultDTO.builder()
                .approved(false)
                .reason("DONORS_NOTIFIED")
                .compatibleGroupsChecked(compatibleGroups)
                .donorsContacted(potentialDonors.size())
                .build();
    }

    /**
     * Get compatible blood groups with their current inventory stock.
     * Returns groups in priority order (exact match first, then compatible groups).
     */
    public List<CompatibleStockDTO> getCompatibleStocks(String bloodGroup) {
        List<String> compatibleGroups = BloodCompatibilityUtil.getCompatibleDonorGroups(bloodGroup);
        
        return compatibleGroups.stream()
                .map(group -> {
                    int units = inventoryRepository.findByBloodGroup(group)
                            .map(inv -> inv.getUnits())
                            .orElse(0);
                    return CompatibleStockDTO.builder()
                            .bloodGroup(group)
                            .units(units)
                            .isExactMatch(group.equals(bloodGroup))
                            .build();
                })
                .collect(Collectors.toList());
    }

    /**
     * Manual approval with admin-selected blood group.
     * Deducts stock, sends appropriate email (customized if different blood group used).
     */
    public BloodRequest manualApprove(Long id, String selectedBloodGroup, String message) {
        BloodRequest request = getById(id);
        
        // Validate the selected blood group is compatible
        List<String> compatibleGroups = BloodCompatibilityUtil.getCompatibleDonorGroups(request.getBloodGroup());
        if (!compatibleGroups.contains(selectedBloodGroup)) {
            throw new IllegalArgumentException("Selected blood group " + selectedBloodGroup + " is not compatible with " + request.getBloodGroup());
        }
        
        // Check stock availability
        var inventory = inventoryRepository.findByBloodGroup(selectedBloodGroup)
                .orElseThrow(() -> new RuntimeException("No inventory record for blood group: " + selectedBloodGroup));
        
        if (inventory.getUnits() < request.getUnits()) {
            throw new IllegalArgumentException("Insufficient stock for " + selectedBloodGroup + ". Available: " + inventory.getUnits() + ", Required: " + request.getUnits());
        }
        
        // Deduct stock
        inventory.setUnits(inventory.getUnits() - request.getUnits());
        inventoryRepository.save(inventory);
        
        // Update request status
        request.setStatus(RequestStatus.APPROVED);
        request.setApprovedDate(LocalDateTime.now());
        
        // Check if different blood group was used
        boolean isDifferentBloodGroup = !selectedBloodGroup.equals(request.getBloodGroup());
        
        if (isDifferentBloodGroup) {
            String adminMessage = message != null && !message.isBlank() 
                    ? message 
                    : "Fulfilled with compatible blood group " + selectedBloodGroup;
            request.setAdminMessage(adminMessage);
            // Send customized email for different blood group
            emailService.sendRequestApprovedWithDifferentBlood(request, selectedBloodGroup);
        } else {
            if (message != null && !message.isBlank()) {
                request.setAdminMessage(message);
            }
            emailService.sendRequestApproved(request);
        }
        
        return requestRepository.save(request);
    }

    public void deleteRequest(Long id) {
        requestRepository.deleteById(id);
    }
}
