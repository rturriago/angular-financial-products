import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { ProductTableComponent } from '../../components/product-table/product-table.component';
import { ProductRepository } from '../../data-access/product.repository';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list-page',
  imports: [ProductTableComponent],
  templateUrl: './product-list.page.html',
  styleUrl: './product-list.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListPage implements OnInit {
  private readonly productRepository = inject(ProductRepository);

  readonly products = signal<Product[]>([]);
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.productRepository
      .getAll()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (products) => this.products.set(products),
        error: (error: Error) => this.errorMessage.set(error.message),
      });
  }
}
