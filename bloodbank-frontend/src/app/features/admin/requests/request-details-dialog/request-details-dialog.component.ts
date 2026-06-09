import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BloodRequest } from '../../../../models/blood-request.model';
import { BloodRequestService } from '../../../../core/services/blood-request.service';
import { SmartApproveDialogComponent } from '../smart-approve-dialog/smart-approve-dialog.component';
import { RejectReasonDialogComponent } from '../reject-reason-dialog/reject-reason-dialog.component';

export interface RequestDetailsDialogData {
  request: BloodRequest;
}

@Component({
  selector: 'app-request-details-dialog',
  templateUrl: './request-details-dialog.component.html',
  styleUrls: ['./request-details-dialog.component.scss'],
})
export class RequestDetailsDialogComponent {
  processing = false;

  constructor(
    public dialogRef: MatDialogRef<RequestDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RequestDetailsDialogData,
    private dialog: MatDialog,
    private requestService: BloodRequestService,
    private snackBar: MatSnackBar
  ) {}

  get request(): BloodRequest {
    return this.data.request;
  }

  get isPending(): boolean {
    return this.request.status === 'PENDING';
  }

  get severityClass(): string {
    if (!this.request.emergency || !this.request.severity) return 'sev-none';
    return 'sev-' + this.request.severity.toLowerCase();
  }

  close(): void {
    this.dialogRef.close();
  }

  openApproveDialog(): void {
    this.processing = true;
    // Use smartApprove to get compatible stocks and status
    this.requestService.smartApprove(this.request.id).subscribe({
      next: (result) => {
        this.processing = false;
        
        const ref = this.dialog.open(SmartApproveDialogComponent, {
          data: { 
            result: result, 
            request: this.request 
          },
          disableClose: false,
          panelClass: 'smart-approve-dialog',
          width: '600px',
          maxHeight: '90vh'
        });

        ref.afterClosed().subscribe((dialogResult) => {
          if (dialogResult?.action === 'approved') {
            this.dialogRef.close({ action: 'approved', request: dialogResult.request });
          } else if (dialogResult?.action === 'reject') {
            // User clicked reject in smart approve dialog, open reject dialog
            this.openRejectDialog();
          } else if (dialogResult?.action === 'emailsSent') {
            // Emails sent, close all dialogs (request stays pending)
            this.dialogRef.close({ action: 'emailsSent', donorsContacted: dialogResult.donorsContacted });
          }
        });
      },
      error: () => {
        this.processing = false;
        this.snackBar.open('Failed to check stock availability', 'Close', { duration: 3000, panelClass: 'snack-error' });
      }
    });
  }

  openRejectDialog(): void {
    const ref = this.dialog.open(RejectReasonDialogComponent, {
      data: { request: this.request },
      disableClose: false,
      panelClass: 'reject-reason-dialog',
      width: '480px',
      maxHeight: '90vh'
    });

    ref.afterClosed().subscribe((result) => {
      if (result?.rejected) {
        this.dialogRef.close({ action: 'rejected', request: result.updatedRequest });
      }
    });
  }
}
