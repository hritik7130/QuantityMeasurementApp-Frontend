import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { firstValueFrom } from 'rxjs';
import { QuantityHistory } from './quantity-api.types';
import { QuantityService } from './quantity.service';
import { SnackService } from '../../shared/ui/snack.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule
  ],
  templateUrl: './history.page.html',
  styleUrl: './history.page.scss'
})
export class HistoryPage {
  private readonly api = inject(QuantityService);
  private readonly snack = inject(SnackService);

  readonly rows = signal<QuantityHistory[]>([]);
  loading = false;

  readonly displayedColumns = [
    'timestamp',
    'measurementType',
    'operationType',
    'input1',
    'input2',
    'result'
  ];

  ngOnInit() {
    void this.refresh();
  }

  async refresh() {
    if (this.loading) return;
    this.loading = true;
    try {
      const data = await firstValueFrom(this.api.history());
      this.rows.set(data ?? []);
    } catch (e: any) {
      this.snack.error(e?.error || e?.message || 'Failed to load history');
    } finally {
      this.loading = false;
    }
  }
}

