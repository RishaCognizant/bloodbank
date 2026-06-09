import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DonationService } from '../../../core/services/donation.service';
import { AuthService } from '../../../core/services/auth.service';
import { DonationRecord } from '../../../models/donation.model';
import { BLOOD_GROUPS } from '../../../models/blood-inventory.model';

@Component({
  selector: 'app-donation-history',
  templateUrl: './donation-history.component.html',
  styleUrls: ['./donation-history.component.scss'],
})
export class DonationHistoryComponent implements OnInit {
  donations: DonationRecord[] = [];
  loading = true;
  showForm = false;
  submitting = false;
  bloodGroups = BLOOD_GROUPS;
  form: FormGroup;

  constructor(
    private donationService: DonationService,
    public auth: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      bloodGroup: [auth.currentUser?.bloodGroup || '', Validators.required],
      units: [1, [Validators.required, Validators.min(1)]],
      donationDate: [new Date(), Validators.required],
      location: ['', Validators.required],
      notes: [''],
    });
  }

  ngOnInit() { this.loadDonations(); }

  loadDonations() {
    this.donationService.getMyDonations().subscribe({
      next: data => { this.donations = data; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  scheduleDonation() {
    if (this.form.invalid) return;
    this.submitting = true;
    const val = this.form.value;
    const dto = { ...val, donationDate: new Date(val.donationDate).toISOString().split('T')[0] };
    this.donationService.scheduleDonation(dto).subscribe({
      next: () => {
        this.snackBar.open('Donation scheduled successfully!', 'Close', { duration: 3000, panelClass: 'snack-success' });
        this.showForm = false;
        this.submitting = false;
        this.loadDonations();
      },
      error: () => {
        this.snackBar.open('Failed to schedule donation', 'Close', { duration: 2000, panelClass: 'snack-error' });
        this.submitting = false;
      },
    });
  }

  cancelDonation(id: number) {
    this.donationService.cancel(id).subscribe({
      next: () => { this.snackBar.open('Donation cancelled', 'Close', { duration: 2000 }); this.loadDonations(); },
      error: () => this.snackBar.open('Failed', 'Close', { duration: 2000, panelClass: 'snack-error' }),
    });
  }

  get completedCount(): number { return this.donations.filter(d => d.status === 'COMPLETED').length; }
  get scheduledCount(): number { return this.donations.filter(d => d.status === 'SCHEDULED').length; }
}
