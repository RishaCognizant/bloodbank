import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BloodRequest } from '../../../../models/blood-request.model';
import { BloodRequestService } from '../../../../core/services/blood-request.service';

export interface RejectReasonDialogData {
  request: BloodRequest;
}

@Component({
  selector: 'app-reject-reason-dialog',
  templateUrl: './reject-reason-dialog.component.html',
  styleUrls: ['./reject-reason-dialog.component.scss'],
})
export class RejectReasonDialogComponent {
  reason = '';
  processing = false;

  constructor(
    public dialogRef: MatDialogRef<RejectReasonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RejectReasonDialogData,
    private requestService: BloodRequestService,
    private snackBar: MatSnackBar
  ) {}

  get request(): BloodRequest {
    return this.data.request;
  }

  close(): void {
    this.dialogRef.close();
  }

  reject(): void {
    this.processing = true;
    this.requestService.processRequest(this.request.id, 'REJECTED', this.reason.trim()).subscribe({
      next: (updatedRequest) => {
        this.processing = false;
        this.snackBar.open('Request rejected', 'Close', { duration: 3000, panelClass: 'snack-success' });
        this.dialogRef.close({ rejected: true, updatedRequest });
      },
      error: () => {
        this.processing = false;
        this.snackBar.open('Failed to reject request', 'Close', { duration: 3000, panelClass: 'snack-error' });
      }
    });
  }
}
