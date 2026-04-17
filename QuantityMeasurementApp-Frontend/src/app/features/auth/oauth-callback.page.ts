import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../core/auth/auth.service';
import { SnackService } from '../../shared/ui/snack.service';

@Component({
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatCardModule],
  templateUrl: './oauth-callback.page.html',
  styleUrl: './oauth-callback.page.scss'
})
export class OAuthCallbackPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly snack = inject(SnackService);

  async ngOnInit() {
    const qp = this.route.snapshot.queryParamMap;
    const token = qp.get('token');
    const username = qp.get('username');
    const error = qp.get('error');

    if (error) {
      this.snack.error(decodeURIComponent(error));
      await this.router.navigateByUrl('/login');
      return;
    }

    if (!token) {
      this.snack.error('Missing token in callback');
      await this.router.navigateByUrl('/login');
      return;
    }

    this.auth.setSession(token, username);
    this.snack.success('Logged in with Google');
    await this.router.navigateByUrl('/');
  }
}

