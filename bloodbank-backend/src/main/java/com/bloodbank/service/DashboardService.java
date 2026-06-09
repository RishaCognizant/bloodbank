package com.bloodbank.service;

import com.bloodbank.dto.DashboardStatsDTO;
import com.bloodbank.model.*;
import com.bloodbank.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    @Autowired private UserRepository userRepository;
    @Autowired private BloodInventoryRepository inventoryRepository;
    @Autowired private BloodRequestRepository requestRepository;
    @Autowired private DonationRecordRepository donationRepository;

    public DashboardStatsDTO getAdminStats() {
        Map<String, Integer> inventoryMap = new HashMap<>();
        inventoryRepository.findAll().forEach(i -> inventoryMap.put(i.getBloodGroup(), i.getUnits()));

        Map<String, Long> requestsByBloodGroup = new HashMap<>();
        List<Object[]> results = requestRepository.countByBloodGroup();
        results.forEach(r -> requestsByBloodGroup.put((String) r[0], (Long) r[1]));

        return DashboardStatsDTO.builder()
                .totalUsers(userRepository.countByRole(Role.USER))
                .totalDonors(donationRepository.countByStatus(DonationStatus.COMPLETED))
                .totalRequests(requestRepository.count())
                .pendingRequests(requestRepository.countByStatus(RequestStatus.PENDING))
                .approvedRequests(requestRepository.countByStatus(RequestStatus.APPROVED))
                .rejectedRequests(requestRepository.countByStatus(RequestStatus.REJECTED))
                .totalDonations(donationRepository.count())
                .completedDonations(donationRepository.countByStatus(DonationStatus.COMPLETED))
                .emergencyRequests(requestRepository.countByEmergency(true))
                .urgentRequests(requestRepository.countBySeverity(Severity.URGENT))
                .mediumRequests(requestRepository.countBySeverity(Severity.MEDIUM))
                .normalRequests(requestRepository.countBySeverity(Severity.NORMAL))
                .bloodInventory(inventoryMap)
                .requestsByBloodGroup(requestsByBloodGroup)
                .build();
    }

    public Map<String, Object> getUserStats(User user) {
        Map<String, Object> stats = new HashMap<>();
        List<BloodRequest> requests = requestRepository.findByUser(user);
        stats.put("totalRequests", requests.size());
        stats.put("pendingRequests", requests.stream().filter(r -> r.getStatus() == RequestStatus.PENDING).count());
        stats.put("approvedRequests", requests.stream().filter(r -> r.getStatus() == RequestStatus.APPROVED).count());
        List<DonationRecord> donations = donationRepository.findByUser(user);
        stats.put("totalDonations", donations.size());
        stats.put("completedDonations", donations.stream().filter(d -> d.getStatus() == DonationStatus.COMPLETED).count());
        return stats;
    }
}
