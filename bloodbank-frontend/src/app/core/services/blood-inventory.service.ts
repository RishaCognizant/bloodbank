import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BloodInventory } from '../../models/blood-inventory.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BloodInventoryService {
  private apiUrl = `${environment.apiUrl}/inventory`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<BloodInventory[]> {
    return this.http.get<BloodInventory[]>(this.apiUrl);
  }

  getByBloodGroup(group: string): Observable<BloodInventory> {
    return this.http.get<BloodInventory>(`${this.apiUrl}/${encodeURIComponent(group)}`);
  }

  update(bloodGroup: string, units: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, { bloodGroup, units });
  }
}
