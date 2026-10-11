import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageSizeSelectComponent } from './page-size-select.component';

describe('PageSizeSelectComponent', () => {
  let fixture: ComponentFixture<PageSizeSelectComponent>;
  let select: HTMLSelectElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(PageSizeSelectComponent);
    fixture.componentRef.setInput('options', [5, 10, 20]);
    fixture.componentRef.setInput('value', 10);
    fixture.detectChanges();
    select = fixture.nativeElement.querySelector('select');
  });

  it('should render one option per value', () => {
    const optionLabels = Array.from(select.options).map((option) => option.textContent?.trim());

    expect(optionLabels).toEqual(['5', '10', '20']);
  });

  it('should preselect the current value', () => {
    expect(select.value).toBe('10');
  });

  it('should emit the selected value as a number', () => {
    select.value = '20';
    select.dispatchEvent(new Event('change'));

    expect(fixture.componentInstance.value()).toBe(20);
  });
});
