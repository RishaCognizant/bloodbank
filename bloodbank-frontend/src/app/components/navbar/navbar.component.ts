import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, MatIconModule,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isLoggedIn = false;

  constructor(private auth: AuthService) {
    this.isLoggedIn = this.auth.isLoggedIn;
    this.auth.currentUser$.subscribe(u => this.isLoggedIn = !!u);
  }

  logout() {
    this.auth.logout();
  }
}
