import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiError } from './api-error';
import { httpErrorInterceptor } from './http-error.interceptor';

describe('httpErrorInterceptor', () => {
  const url = '/test';
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([httpErrorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should let successful responses pass through untouched', () => {
    let result: unknown;

    http.get(url).subscribe((response) => (result = response));
    httpMock.expectOne(url).flush({ data: 'ok' });

    expect(result).toEqual({ data: 'ok' });
  });

  it('should convert http errors into an ApiError with a friendly message', () => {
    let error: unknown;

    http.get(url).subscribe({ error: (err: unknown) => (error = err) });
    httpMock.expectOne(url).flush(null, { status: 404, statusText: 'Not Found' });

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(404);
    expect((error as ApiError).message).toBe('El producto solicitado no existe.');
  });
});
