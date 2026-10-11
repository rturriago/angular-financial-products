import { TestBed } from '@angular/core/testing';
import { NOTIFICATION_DURATION_MS, NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    jest.useFakeTimers();
    service = TestBed.inject(NotificationService);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should add success and error notifications in order', () => {
    service.success('Guardado');
    service.error('Falló');

    expect(service.notifications()).toEqual([
      { id: 1, type: 'success', message: 'Guardado' },
      { id: 2, type: 'error', message: 'Falló' },
    ]);
  });

  it('should remove a notification when it is dismissed', () => {
    service.success('Guardado');
    service.success('Otro');

    service.dismiss(1);

    expect(service.notifications().map((notification) => notification.message)).toEqual(['Otro']);
  });

  it('should remove each notification automatically after its duration', () => {
    service.success('Guardado');

    jest.advanceTimersByTime(NOTIFICATION_DURATION_MS - 1);
    expect(service.notifications()).toHaveLength(1);

    jest.advanceTimersByTime(1);
    expect(service.notifications()).toHaveLength(0);
  });
});
