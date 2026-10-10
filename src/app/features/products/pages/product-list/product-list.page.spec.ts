import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';
import { ApiError } from '../../../../core/http/api-error';
import { ProductRepository } from '../../data-access/product.repository';
import { Product } from '../../models/product.model';
import { buildProduct } from '../../testing/product.fixtures';
import { ProductListPage } from './product-list.page';

describe('ProductListPage', () => {
  let fixture: ComponentFixture<ProductListPage>;
  let repositoryMock: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    repositoryMock = {
      getAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      existsById: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [ProductListPage],
      providers: [{ provide: ProductRepository, useValue: repositoryMock }],
    });
  });

  function render(): HTMLElement {
    fixture = TestBed.createComponent(ProductListPage);
    fixture.detectChanges();
    return fixture.nativeElement;
  }

  it('should display the products returned by the repository', () => {
    repositoryMock.getAll.mockReturnValue(of([buildProduct({ name: 'Cuenta de Ahorros' })]));

    const element = render();

    expect(repositoryMock.getAll).toHaveBeenCalledTimes(1);
    expect(element.textContent).toContain('Cuenta de Ahorros');
  });

  it('should show a loading message while the products are being fetched', () => {
    const pendingProducts = new Subject<Product[]>();
    repositoryMock.getAll.mockReturnValue(pendingProducts);

    const element = render();
    expect(element.textContent).toContain('Cargando productos...');

    pendingProducts.next([buildProduct()]);
    pendingProducts.complete();
    fixture.detectChanges();
    expect(element.textContent).not.toContain('Cargando productos...');
  });

  it('should show the error message when loading fails', () => {
    repositoryMock.getAll.mockReturnValue(
      throwError(() => new ApiError('No se pudo conectar con el servidor.', 0)),
    );

    const element = render();

    expect(element.querySelector('[role="alert"]')?.textContent).toContain(
      'No se pudo conectar con el servidor.',
    );
  });

  it('should load the products again when retrying after an error', () => {
    repositoryMock.getAll
      .mockReturnValueOnce(throwError(() => new ApiError('Error', 500)))
      .mockReturnValueOnce(of([buildProduct({ name: 'Préstamo Vehicular' })]));
    const element = render();

    element.querySelector<HTMLButtonElement>('button')?.click();
    fixture.detectChanges();

    expect(repositoryMock.getAll).toHaveBeenCalledTimes(2);
    expect(element.querySelector('[role="alert"]')).toBeNull();
    expect(element.textContent).toContain('Préstamo Vehicular');
  });
});
