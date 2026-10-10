import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { buildProduct } from '../testing/product.fixtures';
import { ProductHttpRepository } from './product-http.repository';

describe('ProductHttpRepository', () => {
  const baseUrl = `${environment.apiUrl}/bp/products`;
  let repository: ProductHttpRepository;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductHttpRepository, provideHttpClient(), provideHttpClientTesting()],
    });
    repository = TestBed.inject(ProductHttpRepository);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get all products unwrapping the data envelope', () => {
    const products = [buildProduct({ id: 'uno' }), buildProduct({ id: 'dos' })];
    let result: unknown;

    repository.getAll().subscribe((response) => (result = response));
    const request = httpMock.expectOne(baseUrl);
    request.flush({ data: products });

    expect(request.request.method).toBe('GET');
    expect(result).toEqual(products);
  });

  it('should create a product sending it in the body', () => {
    const product = buildProduct();
    let result: unknown;

    repository.create(product).subscribe((response) => (result = response));
    const request = httpMock.expectOne(baseUrl);
    request.flush({ message: 'Product added successfully', data: product });

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(product);
    expect(result).toEqual(product);
  });

  it('should update a product and return it with its id', () => {
    const { id, ...changes } = buildProduct({ id: 'uno', name: 'Nombre actualizado' });
    let result: unknown;

    repository.update(id, changes).subscribe((response) => (result = response));
    const request = httpMock.expectOne(`${baseUrl}/uno`);
    request.flush({ message: 'Product updated successfully', data: changes });

    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(changes);
    expect(result).toEqual({ id: 'uno', ...changes });
  });

  it.each([true, false])('should return %s when checking if an id exists', (exists) => {
    let result: boolean | undefined;

    repository.existsById('uno').subscribe((response) => (result = response));
    const request = httpMock.expectOne(`${baseUrl}/verification/uno`);
    request.flush(exists);

    expect(request.request.method).toBe('GET');
    expect(result).toBe(exists);
  });

  it('should propagate http errors to the subscriber', () => {
    let error: HttpErrorResponse | undefined;

    repository.getAll().subscribe({ error: (err: HttpErrorResponse) => (error = err) });
    httpMock.expectOne(baseUrl).flush(null, { status: 500, statusText: 'Server Error' });

    expect(error?.status).toBe(500);
  });
});
