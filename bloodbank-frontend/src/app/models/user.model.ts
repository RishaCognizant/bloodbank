export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bloodGroup?: string;
  address?: string;
  city?: string;
  role: 'ADMIN' | 'USER';
  active: boolean;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  bloodGroup?: string;
}
