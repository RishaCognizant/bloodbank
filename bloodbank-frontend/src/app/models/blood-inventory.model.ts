export interface BloodInventory {
  id: number;
  bloodGroup: string;
  units: number;
  lastUpdated: string;
}

export interface CompatibleStock {
  bloodGroup: string;
  units: number;
  isExactMatch: boolean;
}

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
