import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { BLOOD_GROUPS } from '../../../models/blood-inventory.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  form: FormGroup;
  loading = false;
  bloodGroups = BLOOD_GROUPS;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public auth: AuthService,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: [''],
      bloodGroup: [''],
      address: [''],
      city: [''],
    });
  }

  ngOnInit() {
    const user = this.auth.currentUser;
    if (user) {
      this.form.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        bloodGroup: user.bloodGroup,
      });
    }
    this.userService.getProfile().subscribe({
      next: profile => this.form.patchValue(profile),
    });
  }

  saveProfile() {
    if (this.form.invalid) return;
    this.loading = true;
    this.userService.updateProfile(this.form.value).subscribe({
      next: () => {
        this.snackBar.open('Profile updated successfully!', 'Close', { duration: 2000, panelClass: 'snack-success' });
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Update failed', 'Close', { duration: 2000, panelClass: 'snack-error' });
        this.loading = false;
      },
    });
  }
}
