import { Observable } from 'rxjs';
import { Product, UpdateProductRequest } from '../models/product.model';

export abstract class ProductRepository {
  abstract getAll(): Observable<Product[]>;
  abstract getById(id: string): Observable<Product>;
  abstract create(product: Product): Observable<Product>;
  abstract update(id: string, changes: UpdateProductRequest): Observable<Product>;
  abstract existsById(id: string): Observable<boolean>;
}
