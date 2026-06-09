import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { UserRoutingModule } from './user-routing.module';

import { UserLayoutComponent } from './layout/user-layout.component';
import { UserDashboardComponent } from './dashboard/user-dashboard.component';
import { RequestBloodComponent } from './request-blood/request-blood.component';
import { MyRequestsComponent } from './my-requests/my-requests.component';
import { DonationHistoryComponent } from './donation-history/donation-history.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    UserLayoutComponent, UserDashboardComponent, RequestBloodComponent,
    MyRequestsComponent, DonationHistoryComponent, ProfileComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, MaterialModule, UserRoutingModule],
})
export class UserModule {}
