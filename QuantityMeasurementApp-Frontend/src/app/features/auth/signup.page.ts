import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/auth/auth.service';
import { SnackService } from '../../shared/ui/snack.service';
import { firstValueFrom } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './signup.page.html',
  styleUrl: './signup.page.scss'
})
export class SignupPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly snack = inject(SnackService);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  loading = false;

  async onSubmit() {
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    try {
      const msg = await firstValueFrom(this.auth.signup(this.form.getRawValue()));
      this.snack.success(msg || 'Registered successfully');
      await this.router.navigateByUrl('/login');
    } catch (e: any) {
      this.snack.error(e?.error || e?.message || 'Signup failed');
    } finally {
      this.loading = false;
    }
  }

  googleLogin() {
    this.auth.startGoogleLogin();
  }
}

