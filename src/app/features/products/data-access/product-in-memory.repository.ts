import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { ApiError, getErrorMessageForStatus } from '../../../core/http/api-error';
import { Product, UpdateProductRequest } from '../models/product.model';
import { ProductRepository } from './product.repository';

const SEED_PRODUCTS: Product[] = [
  {
    id: 'trj-crd',
    name: 'Tarjeta de Crédito',
    description: 'Tarjeta de consumo bajo la modalidad de crédito',
    logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
    date_release: '2025-02-01',
    date_revision: '2026-02-01',
  },
  {
    id: 'cta-ahr',
    name: 'Cuenta de Ahorros',
    description: 'Cuenta para ahorrar con intereses mensuales',
    logo: 'assets/logos/cta-ahr.png',
    date_release: '2025-03-15',
    date_revision: '2026-03-15',
  },
  {
    id: 'cta-cte',
    name: 'Cuenta Corriente',
    description: 'Cuenta para manejo de cheques y pagos frecuentes',
    logo: 'assets/logos/cta-cte.png',
    date_release: '2025-04-10',
    date_revision: '2026-04-10',
  },
  {
    id: 'inv-plz',
    name: 'Inversión a Plazo Fijo',
    description: 'Depósito a plazo fijo con tasa preferencial',
    logo: 'assets/logos/inv-plz.png',
    date_release: '2025-05-20',
    date_revision: '2026-05-20',
  },
  {
    id: 'prs-hip',
    name: 'Préstamo Hipotecario',
    description: 'Financiamiento para la compra de vivienda',
    logo: 'assets/logos/prs-hip.png',
    date_release: '2025-06-01',
    date_revision: '2026-06-01',
  },
  {
    id: 'prs-vhc',
    name: 'Préstamo Vehicular',
    description: 'Crédito para la compra de vehículos nuevos o usados',
    logo: 'assets/logos/prs-vhc.png',
    date_release: '2025-07-05',
    date_revision: '2026-07-05',
  },
];

@Injectable()
export class ProductInMemoryRepository implements ProductRepository {
  private products: Product[] = SEED_PRODUCTS.map((product) => ({ ...product }));

  getAll(): Observable<Product[]> {
    return of(this.products.map((product) => ({ ...product })));
  }

  getById(id: string): Observable<Product> {
    const product = this.products.find((candidate) => candidate.id === id);
    return product ? of({ ...product }) : this.fail(404);
  }

  create(product: Product): Observable<Product> {
    if (this.hasProduct(product.id)) {
      return this.fail(400);
    }
    this.products = [...this.products, { ...product }];
    return of({ ...product });
  }

  update(id: string, changes: UpdateProductRequest): Observable<Product> {
    if (!this.hasProduct(id)) {
      return this.fail(404);
    }
    const updatedProduct: Product = { id, ...changes };
    this.products = this.products.map((product) => (product.id === id ? updatedProduct : product));
    return of({ ...updatedProduct });
  }

  existsById(id: string): Observable<boolean> {
    return of(this.hasProduct(id));
  }

  private hasProduct(id: string): boolean {
    return this.products.some((product) => product.id === id);
  }

  private fail(status: number): Observable<never> {
    return throwError(() => new ApiError(getErrorMessageForStatus(status), status));
  }
}
