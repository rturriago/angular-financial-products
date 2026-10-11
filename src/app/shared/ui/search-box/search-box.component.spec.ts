import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchBoxComponent } from './search-box.component';

describe('SearchBoxComponent', () => {
  let fixture: ComponentFixture<SearchBoxComponent>;
  let input: HTMLInputElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBoxComponent);
    fixture.detectChanges();
    input = fixture.nativeElement.querySelector('input');
  });

  it('should update its value when the user types', () => {
    input.value = 'tarjeta';
    input.dispatchEvent(new Event('input'));

    expect(fixture.componentInstance.value()).toBe('tarjeta');
  });

  it('should reflect a value set from the parent', () => {
    fixture.componentRef.setInput('value', 'cuenta');
    fixture.detectChanges();

    expect(input.value).toBe('cuenta');
  });

  it('should render the placeholder and accessible label', () => {
    expect(input.placeholder).toBe('Search...');
    expect(input.getAttribute('aria-label')).toBe('Buscar');
  });
});
