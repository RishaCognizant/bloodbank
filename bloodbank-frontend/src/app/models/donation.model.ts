import { User } from './user.model';

export interface DonationRecord {
  id: number;
  user: User;
  bloodGroup: string;
  units: number;
  donationDate: string;
  location: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  createdAt?: string;
}

export interface DonationForm {
  bloodGroup: string;
  units: number;
  donationDate: string;
  location: string;
  notes?: string;
  userId?: number;
}
