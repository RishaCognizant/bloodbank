import { Component, OnInit } from '@angular/core';
import { BloodRequestService } from '../../../core/services/blood-request.service';
import { BloodInventoryService } from '../../../core/services/blood-inventory.service';
import { AuthService } from '../../../core/services/auth.service';
import { BloodRequest } from '../../../models/blood-request.model';
import { BloodInventory } from '../../../models/blood-inventory.model';
import { UserStats } from '../../../models/dashboard.model';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss'],
})
export class UserDashboardComponent implements OnInit {
  stats: UserStats | null = null;
  recentRequests: BloodRequest[] = [];
  inventory: BloodInventory[] = [];
  loading = true;

  constructor(
    private requestService: BloodRequestService,
    private inventoryService: BloodInventoryService,
    public auth: AuthService,
  ) {}

  ngOnInit() {
    this.requestService.getUserStats().subscribe(s => { this.stats = s; });
    this.requestService.getMyRequests().subscribe(r => { this.recentRequests = r.slice(0, 5); });
    this.inventoryService.getAll().subscribe(inv => { this.inventory = inv; this.loading = false; });
  }

  getInventoryUnits(group: string): number {
    return this.inventory.find(i => i.bloodGroup === group)?.units ?? 0;
  }
}
