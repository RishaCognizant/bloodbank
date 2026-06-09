import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { BloodRequestService } from '../../../core/services/blood-request.service';
import { BloodRequest, Severity } from '../../../models/blood-request.model';
import { RequestDetailsDialogComponent } from './request-details-dialog/request-details-dialog.component';

@Component({
  selector: 'app-blood-requests',
  templateUrl: './blood-requests.component.html',
  styleUrls: ['./blood-requests.component.scss'],
})
export class BloodRequestsComponent implements OnInit {
  displayedColumns = ['id', 'user', 'patient', 'bloodGroup', 'units', 'priority', 'status', 'date'];
  dataSource = new MatTableDataSource<BloodRequest>();
  loading = true;
  statusFilter = 'ALL';
  severityFilter: 'ALL' | Severity = 'ALL';
  allRequests: BloodRequest[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private requestService: BloodRequestService, 
    private snackBar: MatSnackBar, 
    private dialog: MatDialog
  ) {}

  ngOnInit() { this.loadRequests(); }

  loadRequests() {
    this.requestService.getAll().subscribe({
      next: data => {
        this.allRequests = data;
        this.applyFilters();
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  applyFilters() {
    let filtered = this.allRequests;
    if (this.statusFilter !== 'ALL') {
      filtered = filtered.filter(r => r.status === this.statusFilter);
    }
    if (this.severityFilter !== 'ALL') {
      filtered = filtered.filter(r => r.severity === this.severityFilter);
    }
    this.dataSource.data = filtered;
    setTimeout(() => this.dataSource.paginator = this.paginator);
  }

  applyStatusFilter() { this.applyFilters(); }
  applySeverityFilter() { this.applyFilters(); }

  applySearch(event: Event) {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }

  severityClass(r: BloodRequest): string {
    if (!r.severity) return 'sev-none';
    return 'sev-' + r.severity.toLowerCase();
  }

  openRequestDetails(request: BloodRequest) {
    const ref = this.dialog.open(RequestDetailsDialogComponent, {
      data: { request },
      disableClose: false,
      panelClass: 'request-details-dialog',
      width: '600px',
      maxHeight: '90vh'
    });

    ref.afterClosed().subscribe((result) => {
      if (result?.action === 'approved' || result?.action === 'rejected') {
        // Update the request in the list
        this.allRequests = this.allRequests.map(r => 
          r.id === result.request.id ? result.request : r
        );
        this.applyFilters();
        
        const message = result.action === 'approved' 
          ? 'Request approved successfully' 
          : 'Request rejected';
        this.snackBar.open(message, 'Close', { duration: 3000, panelClass: 'snack-success' });
      }
      // emailsSent action - dialogs close automatically, snackbar shown from smart-approve-dialog
    });
  }
}
