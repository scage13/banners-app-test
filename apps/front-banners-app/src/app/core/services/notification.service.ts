import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

const SNACK_DURATION_MS = 3000;

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  private showSuccess(message: string): void {
    this.snackBar.open(message, undefined, {
      duration: SNACK_DURATION_MS,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }

  bannerCreated(): void {
    this.showSuccess('Банер успішно створено');
  }

  bannerUpdated(): void {
    this.showSuccess('Банер успішно оновлено');
  }

  bannerDeleted(): void {
    this.showSuccess('Банер успішно видалено');
  }
}
