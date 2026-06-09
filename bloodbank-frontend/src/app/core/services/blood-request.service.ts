import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BloodRequest, BloodRequestForm, SmartApproveResult } from '../../models/blood-request.model';
import { CompatibleStock } from '../../models/blood-inventory.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BloodRequestService {
  private apiUrl = `${environment.apiUrl}/requests`;

  constructor(private http: HttpClient) {}

  createRequest(form: BloodRequestForm): Observable<any> {
    return this.http.post(this.apiUrl, form);
  }

  getAll(): Observable<BloodRequest[]> {
    return this.http.get<BloodRequest[]>(this.apiUrl);
  }

  getMyRequests(): Observable<BloodRequest[]> {
    return this.http.get<BloodRequest[]>(`${this.apiUrl}/my`);
  }

  getById(id: number): Observable<BloodRequest> {
    return this.http.get<BloodRequest>(`${this.apiUrl}/${id}`);
  }

  processRequest(id: number, action: string, message: string): Observable<BloodRequest> {
    return this.http.put<any>(`${this.apiUrl}/${id}/action`, { action, message }).pipe(
      map(response => response?.data || response)
    );
  }

  smartApprove(id: number): Observable<SmartApproveResult> {
    return this.http.post<SmartApproveResult>(`${this.apiUrl}/${id}/smart-approve`, {});
  }

  sendDonorEmails(id: number): Observable<SmartApproveResult> {
    return this.http.post<SmartApproveResult>(`${this.apiUrl}/${id}/send-donor-emails`, {});
  }

  getCompatibleStocks(bloodGroup: string): Observable<CompatibleStock[]> {
    return this.http.get<CompatibleStock[]>(`${this.apiUrl}/compatible-stocks/${encodeURIComponent(bloodGroup)}`);
  }

  manualApprove(id: number, bloodGroup: string, message: string): Observable<BloodRequest> {
    return this.http.post<any>(`${this.apiUrl}/${id}/manual-approve`, { bloodGroup, message }).pipe(
      map(response => response?.data || response)
    );
  }

  deleteRequest(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getUserStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats/user`);
  }
}
