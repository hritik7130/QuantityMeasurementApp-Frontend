import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule],
  template: `
    <div class="nf">
      <mat-card class="nf__card">
        <mat-card-title>Page not found</mat-card-title>
        <mat-card-content>That route doesn’t exist.</mat-card-content>
        <mat-card-actions align="end">
          <a mat-raised-button color="primary" routerLink="/">Go home</a>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .nf {
        display: grid;
        place-items: start center;
        padding-top: 60px;
      }
      .nf__card {
        width: 100%;
        max-width: 520px;
        padding: 18px;
        display: grid;
        gap: 10px;
      }
    `
  ]
})
export class NotFoundPage {}

