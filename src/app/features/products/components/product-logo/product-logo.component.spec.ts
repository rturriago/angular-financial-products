import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductLogoComponent } from './product-logo.component';

describe('ProductLogoComponent', () => {
  let fixture: ComponentFixture<ProductLogoComponent>;

  function render(logo: string, name = 'Tarjeta Crédito'): HTMLElement {
    fixture = TestBed.createComponent(ProductLogoComponent);
    fixture.componentRef.setInput('logo', logo);
    fixture.componentRef.setInput('name', name);
    fixture.detectChanges();
    return fixture.nativeElement;
  }

  it('should show the image when a logo url is provided', () => {
    const element = render('https://example.com/logo.png');

    expect(element.querySelector('img')?.getAttribute('src')).toBe('https://example.com/logo.png');
  });

  it('should show the initials when there is no logo', () => {
    const element = render('');

    expect(element.querySelector('img')).toBeNull();
    expect(element.textContent?.trim()).toBe('TC');
  });

  it('should fall back to the initials when the image fails to load', () => {
    const element = render('https://example.com/broken.png');

    element.querySelector('img')?.dispatchEvent(new Event('error'));
    fixture.detectChanges();

    expect(element.querySelector('img')).toBeNull();
    expect(element.textContent?.trim()).toBe('TC');
  });
});
