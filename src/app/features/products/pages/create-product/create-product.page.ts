import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { ProductRepository } from '../../data-access/product.repository';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-create-product-page',
  imports: [ProductFormComponent, RouterLink],
  templateUrl: './create-product.page.html',
  styleUrl: './create-product.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateProductPage {
  private readonly productRepository = inject(ProductRepository);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  createProduct(product: Product): void {
    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.productRepository
      .create(product)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => this.router.navigateByUrl('/products'),
        error: (error: Error) => this.errorMessage.set(error.message),
      });
  }
}
