import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DonationService } from '../../../core/services/donation.service';
import { AdminService } from '../../../core/services/admin.service';
import { DonationRecord } from '../../../models/donation.model';
import { User } from '../../../models/user.model';
import { BLOOD_GROUPS } from '../../../models/blood-inventory.model';

@Component({
  selector: 'app-donation-records',
  templateUrl: './donation-records.component.html',
  styleUrls: ['./donation-records.component.scss'],
})
export class DonationRecordsComponent implements OnInit {
  displayedColumns = ['id', 'user', 'bloodGroup', 'units', 'date', 'location', 'status', 'actions'];
  dataSource = new MatTableDataSource<DonationRecord>();
  loading = true;
  showForm = false;
  users: User[] = [];
  bloodGroups = BLOOD_GROUPS;
  form: FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private donationService: DonationService,
    private adminService: AdminService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      userId: ['', Validators.required],
      bloodGroup: ['', Validators.required],
      units: [1, [Validators.required, Validators.min(1)]],
      donationDate: [new Date(), Validators.required],
      location: ['', Validators.required],
      notes: [''],
    });
  }

  ngOnInit() {
    this.loadDonations();
    this.adminService.getAllUsers().subscribe(users => this.users = users.filter(u => u.role === 'USER'));
  }

  loadDonations() {
    this.donationService.getAll().subscribe({
      next: data => {
        this.dataSource.data = data;
        setTimeout(() => this.dataSource.paginator = this.paginator);
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  recordDonation() {
    if (this.form.invalid) return;
    const val = this.form.value;
    const dto = { ...val, donationDate: val.donationDate.toISOString().split('T')[0] };
    this.donationService.adminAddDonation(dto).subscribe({
      next: () => {
        this.snackBar.open('Donation recorded & inventory updated', 'Close', { duration: 3000, panelClass: 'snack-success' });
        this.showForm = false;
        this.form.reset({ units: 1, donationDate: new Date() });
        this.loadDonations();
      },
      error: () => this.snackBar.open('Failed to record donation', 'Close', { duration: 2000, panelClass: 'snack-error' }),
    });
  }

  completeDonation(id: number) {
    this.donationService.complete(id).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.map(d =>
          d.id === id ? { ...d, status: 'COMPLETED' as const } : d
        );
        this.snackBar.open('Donation completed!', 'Close', { duration: 2000, panelClass: 'snack-success' });
      },
      error: () => this.snackBar.open('Failed', 'Close', { duration: 2000, panelClass: 'snack-error' }),
    });
  }
}
