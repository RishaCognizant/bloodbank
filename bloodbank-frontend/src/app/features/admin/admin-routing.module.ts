import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { UsersManagementComponent } from './users/users-management.component';
import { BloodInventoryComponent } from './inventory/blood-inventory.component';
import { BloodRequestsComponent } from './requests/blood-requests.component';
import { DonationRecordsComponent } from './donations/donation-records.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'users', component: UsersManagementComponent },
      { path: 'inventory', component: BloodInventoryComponent },
      { path: 'requests', component: BloodRequestsComponent },
      { path: 'donations', component: DonationRecordsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
