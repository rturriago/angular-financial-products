import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { NotificationsComponent } from './notifications.component';

describe('NotificationsComponent', () => {
  let fixture: ComponentFixture<NotificationsComponent>;
  let element: HTMLElement;
  let service: NotificationService;

  beforeEach(() => {
    jest.useFakeTimers();
    service = TestBed.inject(NotificationService);
    fixture = TestBed.createComponent(NotificationsComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render each notification with its type', () => {
    service.success('Producto agregado');
    service.error('Algo falló');
    fixture.detectChanges();

    const items = element.querySelectorAll('.notifications__item');
    expect(items).toHaveLength(2);
    expect(items[0].textContent).toContain('Producto agregado');
    expect(items[0].classList).toContain('notifications__item--success');
    expect(items[1].classList).toContain('notifications__item--error');
  });

  it('should dismiss a notification with its close button', () => {
    service.success('Producto agregado');
    fixture.detectChanges();

    element.querySelector<HTMLButtonElement>('.notifications__close')!.click();
    fixture.detectChanges();

    expect(element.querySelectorAll('.notifications__item')).toHaveLength(0);
  });

  it('should announce notifications politely to screen readers', () => {
    const container = element.querySelector('.notifications');

    expect(container?.getAttribute('role')).toBe('status');
    expect(container?.getAttribute('aria-live')).toBe('polite');
  });
});
