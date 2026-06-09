import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../../core/services/admin.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-users-management',
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.scss'],
})
export class UsersManagementComponent implements OnInit {
  displayedColumns = ['id', 'name', 'email', 'phone', 'bloodGroup', 'city', 'role', 'status', 'actions'];
  dataSource = new MatTableDataSource<User>();
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private adminService: AdminService, private snackBar: MatSnackBar) {}

  ngOnInit() { this.loadUsers(); }

  loadUsers() {
    this.adminService.getAllUsers().subscribe({
      next: users => {
        this.dataSource.data = users;
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  applyFilter(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.dataSource.filter = val.trim().toLowerCase();
  }

  toggleStatus(user: User) {
    this.adminService.toggleUserStatus(user.id).subscribe({
      next: () => {
        this.snackBar.open(`User ${user.active ? 'deactivated' : 'activated'}`, 'Close', { duration: 2000, panelClass: 'snack-success' });
        this.loadUsers();
      },
      error: () => this.snackBar.open('Failed to update user', 'Close', { duration: 2000, panelClass: 'snack-error' }),
    });
  }

  deleteUser(user: User) {
    if (!confirm(`Delete user ${user.firstName} ${user.lastName}?`)) return;
    this.adminService.deleteUser(user.id).subscribe({
      next: () => {
        this.snackBar.open('User deleted', 'Close', { duration: 2000, panelClass: 'snack-success' });
        this.loadUsers();
      },
      error: () => this.snackBar.open('Failed to delete user', 'Close', { duration: 2000, panelClass: 'snack-error' }),
    });
  }
}
