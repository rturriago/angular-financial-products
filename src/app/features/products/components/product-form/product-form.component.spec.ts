import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ProductRepository } from '../../data-access/product.repository';
import { Product } from '../../models/product.model';
import { PRODUCT_ID_CHECK_DEBOUNCE_MS } from '../../validators/unique-product-id.validator';
import { ProductFormComponent } from './product-form.component';
import { createProductRepositoryMock } from '../../testing/product-repository.mock';

describe('ProductFormComponent', () => {
  let fixture: ComponentFixture<ProductFormComponent>;
  let component: ProductFormComponent;
  let element: HTMLElement;
  let repositoryMock: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date(2025, 5, 15));
    repositoryMock = createProductRepositoryMock();
    repositoryMock.existsById.mockReturnValue(of(false));
    TestBed.configureTestingModule({
      imports: [ProductFormComponent],
      providers: [{ provide: ProductRepository, useValue: repositoryMock }],
    });

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  function input(id: string): HTMLInputElement {
    return element.querySelector<HTMLInputElement>(`#${id}`)!;
  }

  function type(id: string, value: string): void {
    const field = input(id);
    field.value = value;
    field.dispatchEvent(new Event('input'));
    field.dispatchEvent(new Event('blur'));
    jest.advanceTimersByTime(PRODUCT_ID_CHECK_DEBOUNCE_MS);
    fixture.detectChanges();
  }

  function errorText(id: string): string | undefined {
    return element.querySelector(`#${id}-error`)?.textContent?.trim();
  }

  function fillValidForm(): void {
    type('id', 'nuevo');
    type('name', 'Tarjeta Platinum');
    type('description', 'Tarjeta de crédito premium');
    type('logo', 'https://example.com/logo.png');
    type('date_release', '2025-06-20');
  }

  function submit(): void {
    element.querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  }

  it('should not show errors before the user touches the fields', () => {
    expect(element.querySelectorAll('.form-field__message--error')).toHaveLength(0);
  });

  it('should show the required error after leaving an empty field', () => {
    type('name', '');

    expect(errorText('name')).toBe('Este campo es requerido!');
    expect(input('name').classList).toContain('product-form__input--invalid');
    expect(input('name').getAttribute('aria-invalid')).toBe('true');
  });

  it.each([
    ['id', 'ab', 'Debe tener al menos 3 caracteres'],
    ['id', 'abcdefghijk', 'Debe tener máximo 10 caracteres'],
    ['name', 'Tarj', 'Debe tener al menos 5 caracteres'],
    ['description', 'Corta', 'Debe tener al menos 10 caracteres'],
    ['date_release', '2025-06-14', 'La fecha debe ser igual o mayor a la fecha actual'],
  ])('should show an error when %s is "%s"', (field, value, expectedError) => {
    type(field, value);

    expect(errorText(field)).toBe(expectedError);
  });

  it('should show "ID no válido!" when the id already exists', () => {
    repositoryMock.existsById.mockReturnValue(of(true));

    type('id', 'trj-crd');

    expect(errorText('id')).toContain('ID no válido!');
  });

  it('should calculate the revision date one year after the release date', () => {
    type('date_release', '2025-06-20');

    expect(input('date_revision').value).toBe('2026-06-20');
    expect(input('date_revision').disabled).toBe(true);
  });

  it('should clear the revision date when the release date is removed', () => {
    type('date_release', '2025-06-20');
    type('date_release', '');

    expect(input('date_revision').value).toBe('');
  });

  it('should mark every field as touched and not emit when submitting an invalid form', () => {
    const emitted = jest.fn();
    component.submitted.subscribe(emitted);

    submit();

    expect(emitted).not.toHaveBeenCalled();
    expect(errorText('id')).toBe('Este campo es requerido!');
    expect(errorText('logo')).toBe('Este campo es requerido!');
  });

  it('should emit the trimmed product including the revision date when valid', () => {
    let emitted: Product | undefined;
    component.submitted.subscribe((product) => (emitted = product));
    fillValidForm();
    type('name', '  Tarjeta Platinum  ');

    submit();

    expect(emitted).toEqual({
      id: 'nuevo',
      name: 'Tarjeta Platinum',
      description: 'Tarjeta de crédito premium',
      logo: 'https://example.com/logo.png',
      date_release: '2025-06-20',
      date_revision: '2026-06-20',
    });
  });

  it('should clear every field when resetting', () => {
    fillValidForm();

    element.querySelector<HTMLButtonElement>('.product-form__button--secondary')!.click();
    fixture.detectChanges();

    expect(input('id').value).toBe('');
    expect(input('date_revision').value).toBe('');
    expect(element.querySelectorAll('.form-field__message--error')).toHaveLength(0);
  });

  it('should disable the buttons while submitting', () => {
    fixture.componentRef.setInput('isSubmitting', true);
    fixture.detectChanges();

    const buttons = element.querySelectorAll<HTMLButtonElement>('button');

    expect(Array.from(buttons).every((button) => button.disabled)).toBe(true);
    expect(element.textContent).toContain('Enviando...');
  });

  describe('when editing an existing product', () => {
    const existingProduct: Product = {
      id: 'trj-crd',
      name: 'Tarjeta de Crédito',
      description: 'Tarjeta de consumo bajo la modalidad de crédito',
      logo: 'https://example.com/logo.png',
      date_release: '2025-07-01',
      date_revision: '2026-07-01',
    };

    beforeEach(() => {
      fixture.componentRef.setInput('title', 'Editar Producto');
      fixture.componentRef.setInput('lockId', true);
      fixture.componentRef.setInput('initialProduct', existingProduct);
      fixture.detectChanges();
    });

    it('should show the custom title and the product data', () => {
      expect(element.querySelector('h1')?.textContent?.trim()).toBe('Editar Producto');
      expect(input('id').value).toBe('trj-crd');
      expect(input('name').value).toBe('Tarjeta de Crédito');
      expect(input('date_revision').value).toBe('2026-07-01');
    });

    it('should keep the id disabled and skip the uniqueness check', () => {
      jest.advanceTimersByTime(PRODUCT_ID_CHECK_DEBOUNCE_MS);

      expect(input('id').disabled).toBe(true);
      expect(repositoryMock.existsById).not.toHaveBeenCalled();
    });

    it('should restore the original values when resetting', () => {
      type('name', 'Nombre cambiado');

      element.querySelector<HTMLButtonElement>('.product-form__button--secondary')!.click();
      fixture.detectChanges();

      expect(input('name').value).toBe('Tarjeta de Crédito');
    });

    it('should emit the edited product including its locked id', () => {
      let emitted: Product | undefined;
      component.submitted.subscribe((product) => (emitted = product));
      type('name', 'Tarjeta Oro');

      submit();

      expect(emitted).toEqual({ ...existingProduct, name: 'Tarjeta Oro' });
    });

    it('should enable the id again when it is unlocked', () => {
      fixture.componentRef.setInput('lockId', false);
      fixture.detectChanges();

      expect(input('id').disabled).toBe(false);
    });
  });
});
