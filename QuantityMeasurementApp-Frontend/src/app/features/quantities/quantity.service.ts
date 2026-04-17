import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG } from '../../core/config/app-config';
import { QuantityHistory, QuantityInput, QuantityResponse } from './quantity-api.types';

@Injectable({ providedIn: 'root' })
export class QuantityService {
  constructor(private readonly http: HttpClient) {}

  health() {
    return this.http.get(APP_CONFIG.apiBaseUrl + '/api/v1/quantities', { responseType: 'text' });
  }

  perform(input: QuantityInput) {
    return this.http.post<QuantityResponse>(APP_CONFIG.apiBaseUrl + '/api/v1/quantities/perform', input);
  }

  history() {
    return this.http.get<QuantityHistory[]>(APP_CONFIG.apiBaseUrl + '/api/v1/quantities/history');
  }

  latestHistory(limit = 5) {
    return this.http.get<QuantityHistory[]>(
      APP_CONFIG.apiBaseUrl + '/api/v1/quantities/history/latest',
      { params: { limit } }
    );
  }
}

