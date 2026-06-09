import { User } from './user.model';
import { CompatibleStock } from './blood-inventory.model';

export type Severity = 'URGENT' | 'MEDIUM' | 'NORMAL';

export interface BloodRequest {
  id: number;
  user: User;
  patientName: string;
  bloodGroup: string;
  units: number;
  purpose?: string;
  hospital: string;
  contactPhone?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  emergency: boolean;
  severity?: Severity | null;
  requestDate: string;
  approvedDate?: string;
  adminMessage?: string;
}

export interface BloodRequestForm {
  patientName: string;
  bloodGroup: string;
  units: number;
  purpose?: string;
  hospital: string;
  contactPhone?: string;
  severity: Severity;
}

export interface SmartApproveResult {
  approved: boolean;
  bloodGroupUsed?: string;
  unitsDeducted?: number;
  reason?: string;
  compatibleGroupsChecked?: string[];
  donorsContacted?: number;
  compatibleStocks?: CompatibleStock[];
  hasSufficientStock?: boolean;
}
