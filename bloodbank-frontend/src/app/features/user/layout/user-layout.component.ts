import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.scss'],
})
export class UserLayoutComponent {
  navItems = [
    { label: 'Dashboard', icon: 'dashboard', route: '/user/dashboard' },
    { label: 'Request Blood', icon: 'bloodtype', route: '/user/request-blood' },
    { label: 'My Requests', icon: 'list_alt', route: '/user/my-requests' },
    { label: 'Donate Blood', icon: 'volunteer_activism', route: '/user/donation-history' },
    { label: 'My Profile', icon: 'person', route: '/user/profile' },
  ];

  constructor(public auth: AuthService) {}
}
