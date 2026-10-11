import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
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
      providers: [provideRouter([]), { provide: ProductRepository, useValue: repositoryMock }],
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

  it('should link the add button to the creation form', () => {
    repositoryMock.getAll.mockReturnValue(of([]));

    const addLink = render().querySelector('.product-list__add');

    expect(addLink?.textContent?.trim()).toBe('Agregar');
    expect(addLink?.getAttribute('href')).toBe('/products/new');
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

  describe('search and page size', () => {
    const manyProducts = Array.from({ length: 12 }, (_, index) =>
      buildProduct({ id: `prd-${index}`, name: `Producto ${index}` }),
    );

    function rowCount(element: HTMLElement): number {
      return element.querySelectorAll('tbody tr.product-table__row').length;
    }

    function resultsText(element: HTMLElement): string | undefined {
      return element.querySelector('.product-list__count')?.textContent?.trim();
    }

    beforeEach(() => {
      repositoryMock.getAll.mockReturnValue(of(manyProducts));
    });

    it('should show 5 products by default with its results count', () => {
      const element = render();

      expect(rowCount(element)).toBe(5);
      expect(resultsText(element)).toBe('5 Resultados');
    });

    it('should show more products when a bigger page size is selected', () => {
      const element = render();
      const select = element.querySelector<HTMLSelectElement>('select')!;

      select.value = '10';
      select.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(rowCount(element)).toBe(10);
      expect(resultsText(element)).toBe('10 Resultados');
    });

    it('should filter the products with the search term', () => {
      const element = render();
      const searchInput = element.querySelector<HTMLInputElement>('input[type="search"]')!;

      searchInput.value = 'producto 11';
      searchInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(rowCount(element)).toBe(1);
      expect(element.textContent).toContain('Producto 11');
      expect(resultsText(element)).toBe('1 Resultados');
    });
  });
});
