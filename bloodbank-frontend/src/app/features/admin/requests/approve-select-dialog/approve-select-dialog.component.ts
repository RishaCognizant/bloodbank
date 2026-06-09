import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BloodRequest } from '../../../../models/blood-request.model';
import { CompatibleStock } from '../../../../models/blood-inventory.model';
import { BloodRequestService } from '../../../../core/services/blood-request.service';

export interface ApproveSelectDialogData {
  request: BloodRequest;
  compatibleStocks: CompatibleStock[];
}

@Component({
  selector: 'app-approve-select-dialog',
  templateUrl: './approve-select-dialog.component.html',
  styleUrls: ['./approve-select-dialog.component.scss'],
})
export class ApproveSelectDialogComponent {
  selectedBloodGroup: string | null = null;
  reason = '';
  processing = false;

  constructor(
    public dialogRef: MatDialogRef<ApproveSelectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ApproveSelectDialogData,
    private requestService: BloodRequestService,
    private snackBar: MatSnackBar
  ) {}

  get request(): BloodRequest {
    return this.data.request;
  }

  get stocks(): CompatibleStock[] {
    return this.data.compatibleStocks;
  }

  get requiredBloodGroup(): string {
    return this.request.bloodGroup;
  }

  get isDifferentBloodGroup(): boolean {
    return this.selectedBloodGroup !== null && this.selectedBloodGroup !== this.requiredBloodGroup;
  }

  get hasInsufficientStock(): boolean {
    return !this.stocks.some(s => s.units >= this.request.units);
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

    // If different blood group is selected and no reason provided, use default
    let message = this.reason.trim();
    if (this.isDifferentBloodGroup && !message) {
      message = `Fulfilled with compatible blood group ${this.selectedBloodGroup} instead of requested ${this.requiredBloodGroup}`;
    }

    this.processing = true;
    this.requestService.manualApprove(this.request.id, this.selectedBloodGroup, message).subscribe({
      next: (updatedRequest) => {
        this.processing = false;
        this.snackBar.open('Request approved successfully', 'Close', { duration: 3000, panelClass: 'snack-success' });
        this.dialogRef.close({ approved: true, updatedRequest });
      },
      error: (err) => {
        this.processing = false;
        const errorMsg = err.error?.message || 'Failed to approve request';
        this.snackBar.open(errorMsg, 'Close', { duration: 3000, panelClass: 'snack-error' });
      }
    });
  }
}
