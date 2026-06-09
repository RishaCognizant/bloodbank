import { Component, OnInit } from '@angular/core';
import { BloodRequestService } from '../../../core/services/blood-request.service';
import { BloodRequest } from '../../../models/blood-request.model';

@Component({
  selector: 'app-my-requests',
  templateUrl: './my-requests.component.html',
  styleUrls: ['./my-requests.component.scss'],
})
export class MyRequestsComponent implements OnInit {
  requests: BloodRequest[] = [];
  filteredRequests: BloodRequest[] = [];
  loading = true;
  statusFilter = 'ALL';

  constructor(private requestService: BloodRequestService) {}

  ngOnInit() {
    this.requestService.getMyRequests().subscribe({
      next: data => {
        this.requests = data;
        this.filteredRequests = data;
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  filterByStatus(status: string) {
    this.statusFilter = status;
    this.filteredRequests = status === 'ALL' ? this.requests : this.requests.filter(r => r.status === status);
  }

  countByStatus(status: string): number {
    return this.requests.filter(r => r.status === status).length;
  }
}
