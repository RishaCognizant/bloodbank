package com.bloodbank.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class DashboardStatsDTO {
    private long totalUsers;
    private long totalDonors;
    private long totalRequests;
    private long pendingRequests;
    private long approvedRequests;
    private long rejectedRequests;
    private long totalDonations;
    private long completedDonations;
    private long emergencyRequests;
    private long urgentRequests;
    private long mediumRequests;
    private long normalRequests;
    private Map<String, Integer> bloodInventory;
    private Map<String, Long> requestsByBloodGroup;
}
