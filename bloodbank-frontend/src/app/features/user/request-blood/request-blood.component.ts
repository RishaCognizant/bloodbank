import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BloodRequestService } from '../../../core/services/blood-request.service';
import { BLOOD_GROUPS } from '../../../models/blood-inventory.model';
import { Severity } from '../../../models/blood-request.model';

@Component({
  selector: 'app-request-blood',
  templateUrl: './request-blood.component.html',
  styleUrls: ['./request-blood.component.scss'],
})
export class RequestBloodComponent {
  form: FormGroup;
  loading = false;
  submitted = false;
  bloodGroups = BLOOD_GROUPS;
  purposes = ['Surgery', 'Accident', 'Cancer Treatment', 'Anemia', 'Childbirth', 'Other'];
  severities: { value: Severity; label: string }[] = [
    { value: 'URGENT', label: 'Urgent' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'NORMAL', label: 'Normal' },
  ];

  constructor(
    private fb: FormBuilder,
    private requestService: BloodRequestService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      patientName: ['', Validators.required],
      bloodGroup: ['', Validators.required],
      units: [1, [Validators.required, Validators.min(1), Validators.max(20)]],
      purpose: [''],
      hospital: ['', Validators.required],
      contactPhone: [''],
      severity: [null, Validators.required],
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.requestService.createRequest(this.form.value).subscribe({
      next: () => {
        this.submitted = true;
        this.snackBar.open('Blood request submitted! You will receive a confirmation email.', 'Close',
          { duration: 4000, panelClass: 'snack-success' });
      },
      error: () => {
        this.snackBar.open('Failed to submit request', 'Close', { duration: 3000, panelClass: 'snack-error' });
        this.loading = false;
      },
    });
  }

  newRequest() {
    this.submitted = false;
    this.loading = false;
    this.form.reset({ units: 1, severity: null });
  }
}
