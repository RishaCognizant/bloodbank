export interface DashboardStats {
  totalUsers: number;
  totalDonors: number;
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  totalDonations: number;
  completedDonations: number;
  emergencyRequests: number;
  urgentRequests: number;
  mediumRequests: number;
  normalRequests: number;
  bloodInventory: { [key: string]: number | undefined };
  requestsByBloodGroup: { [key: string]: number | undefined };
}

export interface UserStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  totalDonations: number;
  completedDonations: number;
}
