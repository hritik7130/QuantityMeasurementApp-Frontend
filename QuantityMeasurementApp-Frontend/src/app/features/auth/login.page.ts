import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
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
    MatButtonModule,
    MatDividerModule
  ],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss'
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly snack = inject(SnackService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  loading = false;

  async onSubmit() {
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    try {
      const token = await firstValueFrom(this.auth.login(this.form.getRawValue()));
      this.auth.setSession(token ?? '');
      this.snack.success('Logged in successfully');

      const next = this.route.snapshot.queryParamMap.get('next');
      await this.router.navigateByUrl(next || '/');
    } catch (e: any) {
      this.snack.error(e?.error || e?.message || 'Login failed');
    } finally {
      this.loading = false;
    }
  }

  googleLogin() {
    this.auth.startGoogleLogin();
  }
}

