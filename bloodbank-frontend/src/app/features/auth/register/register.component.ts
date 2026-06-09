import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { BLOOD_GROUPS } from '../../../models/blood-inventory.model';
 
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  form: FormGroup;
  loading = false;
  hidePassword = true;
  bloodGroups = BLOOD_GROUPS;
  isEmailVerified: boolean = false;
  isOtpSent: boolean = false;
  otpValue: string = '';
 
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: [''],
      bloodGroup: [''],
      address: [''],
      city: [''],
    });
  }
 
  //ADDED
  sendOtp() {
    const email = this.form.get('email')?.value;
    this.auth.sendOtp(email).subscribe({
      next: () => {
        this.isOtpSent = true;
        this.snackBar.open('OTP has sent successfully!', 'Close', { duration: 3000 });
      },
      error: (err: any) => {
        this.isOtpSent = false;
        this.snackBar.open('Failed to send OTP. Check your email.', 'Close', { duration: 3000 });
      }
    });
  }
 
 
  verifyOtp() {
  this.auth.verifyOtp(this.form.value.email, this.otpValue).subscribe({
    next: (response: any) => {
      if (response?.success) {
        this.isEmailVerified = true;
        this.snackBar.open('Email verified successfully!', 'Close', { duration: 3000 });
      }
    },
    error: (err: any) => {
      this.snackBar.open('Invalid OTP. Please try again.', 'Close', { duration: 3000 });
    }
  });
  }
  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.auth.register(this.form.value).subscribe({
      next: () => {
        this.snackBar.open('Registration successful! Please login.', 'Close', { duration: 3000, panelClass: 'snack-success' });
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.snackBar.open(err.error?.message || 'Registration failed', 'Close', { duration: 3000, panelClass: 'snack-error' });
        this.loading = false;
      },
    });
  }
}