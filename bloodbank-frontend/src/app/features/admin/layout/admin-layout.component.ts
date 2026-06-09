import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent {
  navItems = [
    { label: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard' },
    { label: 'Users', icon: 'people', route: '/admin/users' },
    { label: 'Blood Inventory', icon: 'inventory_2', route: '/admin/inventory' },
    { label: 'Blood Requests', icon: 'medical_services', route: '/admin/requests' },
    { label: 'Donations', icon: 'volunteer_activism', route: '/admin/donations' },
  ];

  constructor(public auth: AuthService, private router: Router) {}

  logout() {
    this.auth.logout();
  }
}
