import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG } from '../config/app-config';
import { STORAGE_KEYS } from '../storage/storage-keys';

export type AuthState = {
  token: string | null;
  username: string | null;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _token = signal<string | null>(localStorage.getItem(STORAGE_KEYS.token));
  private readonly _username = signal<string | null>(
    localStorage.getItem(STORAGE_KEYS.username)
  );

  readonly state = computed<AuthState>(() => ({
    token: this._token(),
    username: this._username()
  }));

  readonly isAuthenticated = computed(() => !!this._token());

  constructor(private readonly http: HttpClient) {}

  login(payload: { username: string; password: string }) {
    return this.http.post(APP_CONFIG.apiBaseUrl + '/auth/login', payload, {
      responseType: 'text'
    });
  }

  signup(payload: { username: string; password: string; email: string }) {
    return this.http.post(APP_CONFIG.apiBaseUrl + '/api/v1/quantities/auth/signup', payload, {
      responseType: 'text'
    });
  }

  startGoogleLogin() {
    window.location.href = APP_CONFIG.googleOAuthStartUrl;
  }

  private decodeJwtSubject(token: string): string | null {
    // JWT: header.payload.signature (base64url). We only need payload.sub (username).
    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const payloadB64Url = parts[1]!;
      const payloadB64 = payloadB64Url.replace(/-/g, '+').replace(/_/g, '/');
      const pad = payloadB64.length % 4;
      const normalized = pad ? payloadB64 + '='.repeat(4 - pad) : payloadB64;
      const json = atob(normalized);
      const payload = JSON.parse(json) as { sub?: unknown };
      return typeof payload.sub === 'string' && payload.sub.trim() ? payload.sub : null;
    } catch {
      return null;
    }
  }

  setSession(token: string, username?: string | null) {
    this._token.set(token);
    localStorage.setItem(STORAGE_KEYS.token, token);

    const finalUsername = username ?? this.decodeJwtSubject(token);
    if (finalUsername != null) {
      this._username.set(finalUsername);
      localStorage.setItem(STORAGE_KEYS.username, finalUsername);
    }
  }

  clearSession() {
    this._token.set(null);
    this._username.set(null);
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.username);
  }

  getToken() {
    return this._token();
  }
}

