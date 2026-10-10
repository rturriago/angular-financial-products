import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/http/api-response.model';
import { Product, UpdateProductRequest } from '../models/product.model';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductHttpRepository implements ProductRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/bp/products`;

  getAll(): Observable<Product[]> {
    return this.http
      .get<ApiResponse<Product[]>>(this.baseUrl)
      .pipe(map((response) => response.data));
  }

  create(product: Product): Observable<Product> {
    return this.http
      .post<ApiResponse<Product>>(this.baseUrl, product)
      .pipe(map((response) => response.data));
  }

  update(id: string, changes: UpdateProductRequest): Observable<Product> {
    return this.http
      .put<ApiResponse<UpdateProductRequest>>(`${this.baseUrl}/${id}`, changes)
      .pipe(map((response) => ({ id, ...response.data })));
  }

  existsById(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/verification/${id}`);
  }
}
