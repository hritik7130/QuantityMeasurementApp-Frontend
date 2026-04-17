import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class SnackService {
  constructor(private readonly snack: MatSnackBar) {}

  success(message: string) {
    this.snack.open(message, 'OK', { duration: 2500 });
  }

  error(message: string) {
    this.snack.open(message, 'Dismiss', { duration: 5000 });
  }
}

