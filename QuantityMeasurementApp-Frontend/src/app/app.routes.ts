import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/quantities/calculator.page').then((m) => m.CalculatorPage)
  },
  {
    path: 'history',
    canActivate: [authGuard],
    loadComponent: () => import('./features/quantities/history.page').then((m) => m.HistoryPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.page').then((m) => m.LoginPage)
  },
  {
    path: 'signup',
    loadComponent: () => import('./features/auth/signup.page').then((m) => m.SignupPage)
  },
  {
    path: 'auth/callback',
    loadComponent: () =>
      import('./features/auth/oauth-callback.page').then((m) => m.OAuthCallbackPage)
  },
  {
    path: '**',
    loadComponent: () => import('./features/misc/not-found.page').then((m) => m.NotFoundPage)
  }
];
