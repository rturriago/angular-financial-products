import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error';

export interface AppNotification {
  id: number;
  type: NotificationType;
  message: string;
}

export const NOTIFICATION_DURATION_MS = 4000;

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private nextId = 0;
  private readonly notificationsState = signal<AppNotification[]>([]);

  readonly notifications = this.notificationsState.asReadonly();

  success(message: string): void {
    this.show('success', message);
  }

  error(message: string): void {
    this.show('error', message);
  }

  dismiss(id: number): void {
    this.notificationsState.update((notifications) =>
      notifications.filter((notification) => notification.id !== id),
    );
  }

  private show(type: NotificationType, message: string): void {
    const id = ++this.nextId;
    this.notificationsState.update((notifications) => [...notifications, { id, type, message }]);
    setTimeout(() => this.dismiss(id), NOTIFICATION_DURATION_MS);
  }
}
