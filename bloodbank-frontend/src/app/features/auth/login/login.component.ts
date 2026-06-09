import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    if (auth.isLoggedIn) {
      this.redirect(auth.isAdmin);
    }
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    const { email, password } = this.form.value;
    this.auth.login(email, password).subscribe({
      next: user => this.redirect(user.role === 'ADMIN'),
      error: () => {
        this.snackBar.open('Invalid email or password', 'Close', { duration: 3000, panelClass: 'snack-error' });
        this.loading = false;
      },
    });
  }

  private redirect(isAdmin: boolean) {
    this.router.navigate([isAdmin ? '/admin/dashboard' : '/user/dashboard']);
  }
}
