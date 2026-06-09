import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { AdminRoutingModule } from './admin-routing.module';
import { BaseChartDirective } from 'ng2-charts';

import { AdminLayoutComponent } from './layout/admin-layout.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { UsersManagementComponent } from './users/users-management.component';
import { BloodInventoryComponent } from './inventory/blood-inventory.component';
import { BloodRequestsComponent } from './requests/blood-requests.component';
import { DonationRecordsComponent } from './donations/donation-records.component';
import { SmartApproveDialogComponent } from './requests/smart-approve-dialog/smart-approve-dialog.component';
import { RequestDetailsDialogComponent } from './requests/request-details-dialog/request-details-dialog.component';
import { ApproveSelectDialogComponent } from './requests/approve-select-dialog/approve-select-dialog.component';
import { RejectReasonDialogComponent } from './requests/reject-reason-dialog/reject-reason-dialog.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    AdminDashboardComponent,
    UsersManagementComponent,
    BloodInventoryComponent,
    BloodRequestsComponent,
    DonationRecordsComponent,
    SmartApproveDialogComponent,
    RequestDetailsDialogComponent,
    ApproveSelectDialogComponent,
    RejectReasonDialogComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, MaterialModule, AdminRoutingModule, BaseChartDirective],
})
export class AdminModule {}
