import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLayoutComponent } from './layout/user-layout.component';
import { UserDashboardComponent } from './dashboard/user-dashboard.component';
import { RequestBloodComponent } from './request-blood/request-blood.component';
import { MyRequestsComponent } from './my-requests/my-requests.component';
import { DonationHistoryComponent } from './donation-history/donation-history.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: UserDashboardComponent },
      { path: 'request-blood', component: RequestBloodComponent },
      { path: 'my-requests', component: MyRequestsComponent },
      { path: 'donation-history', component: DonationHistoryComponent },
      { path: 'profile', component: ProfileComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
