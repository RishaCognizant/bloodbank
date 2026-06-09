import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DonationRecord, DonationForm } from '../../models/donation.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DonationService {
  private apiUrl = `${environment.apiUrl}/donations`;

  constructor(private http: HttpClient) {}

  scheduleDonation(form: DonationForm): Observable<any> {
    return this.http.post(`${this.apiUrl}/schedule`, form);
  }

  adminAddDonation(form: DonationForm): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/add`, form);
  }

  getAll(): Observable<DonationRecord[]> {
    return this.http.get<DonationRecord[]>(this.apiUrl);
  }

  getMyDonations(): Observable<DonationRecord[]> {
    return this.http.get<DonationRecord[]>(`${this.apiUrl}/my`);
  }

  complete(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/complete`, {});
  }

  cancel(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/cancel`, {});
  }
}
