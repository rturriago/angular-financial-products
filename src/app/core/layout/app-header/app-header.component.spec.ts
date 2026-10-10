import { TestBed } from '@angular/core/testing';
import { AppHeaderComponent } from './app-header.component';

describe('AppHeaderComponent', () => {
  it('should display the bank name', () => {
    const fixture = TestBed.createComponent(AppHeaderComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('BANCO');
  });
});
