import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SmartApproveResult, BloodRequest } from '../../../../models/blood-request.model';
import { CompatibleStock } from '../../../../models/blood-inventory.model';
import { BloodRequestService } from '../../../../core/services/blood-request.service';

export interface SmartApproveDialogData {
  result: SmartApproveResult;
  request: BloodRequest;
}

@Component({
  selector: 'app-smart-approve-dialog',
  templateUrl: './smart-approve-dialog.component.html',
  styleUrls: ['./smart-approve-dialog.component.scss'],
})
export class SmartApproveDialogComponent {
  selectedBloodGroup: string | null = null;
  reason = '';
  processing = false;

  constructor(
    public dialogRef: MatDialogRef<SmartApproveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SmartApproveDialogData,
    private requestService: BloodRequestService,
    private snackBar: MatSnackBar
  ) {}

  get request(): BloodRequest {
    return this.data.request;
  }

  get result(): SmartApproveResult {
    return this.data.result;
  }

  get stocks(): CompatibleStock[] {
    return this.result.compatibleStocks || [];
  }

  get hasSufficientStock(): boolean {
    return this.result.hasSufficientStock || false;
  }

  get requiredBloodGroup(): string {
    return this.request.bloodGroup;
  }

  get isDifferentBloodGroup(): boolean {
    return this.selectedBloodGroup !== null && this.selectedBloodGroup !== this.requiredBloodGroup;
  }

  isStockSufficient(stock: CompatibleStock): boolean {
    return stock.units >= this.request.units;
  }

  selectBloodGroup(bloodGroup: string): void {
    const stock = this.stocks.find(s => s.bloodGroup === bloodGroup);
    if (stock && this.isStockSufficient(stock)) {
      this.selectedBloodGroup = bloodGroup;
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  approve(): void {
    if (!this.selectedBloodGroup) {
      this.snackBar.open('Please select a blood group', 'Close', { duration: 2000 });
      return;
    }

    let message = this.reason.trim();
    if (this.isDifferentBloodGroup && !message) {
      message = `Fulfilled with compatible blood group ${this.selectedBloodGroup} instead of requested ${this.requiredBloodGroup}`;
    }

    this.processing = true;
    this.requestService.manualApprove(this.request.id, this.selectedBloodGroup, message).subscribe({
      next: (updatedRequest) => {
        this.processing = false;
        this.snackBar.open('Request approved successfully', 'Close', { duration: 3000, panelClass: 'snack-success' });
        this.dialogRef.close({ action: 'approved', request: updatedRequest });
      },
      error: (err) => {
        this.processing = false;
        const errorMsg = err.error?.message || 'Failed to approve request';
        this.snackBar.open(errorMsg, 'Close', { duration: 3000, panelClass: 'snack-error' });
      }
    });
  }

  sendEmails(): void {
    this.processing = true;
    this.requestService.sendDonorEmails(this.request.id).subscribe({
      next: (result) => {
        this.processing = false;
        const donorsContacted = result.donorsContacted || 0;
        this.snackBar.open(`Emails sent to ${donorsContacted} compatible donors. Request remains pending.`, 'Close', { duration: 4000, panelClass: 'snack-success' });
        this.dialogRef.close({ action: 'emailsSent', donorsContacted });
      },
      error: () => {
        this.processing = false;
        this.snackBar.open('Failed to send donor emails', 'Close', { duration: 3000, panelClass: 'snack-error' });
      }
    });
  }

  reject(): void {
    this.dialogRef.close({ action: 'reject' });
  }
}
