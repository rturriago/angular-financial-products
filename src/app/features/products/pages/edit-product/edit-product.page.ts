import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { NotificationService } from '../../../../core/notifications/notification.service';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { ProductRepository } from '../../data-access/product.repository';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-edit-product-page',
  imports: [ProductFormComponent, RouterLink],
  templateUrl: './edit-product.page.html',
  styleUrl: './edit-product.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditProductPage implements OnInit {
  private readonly productRepository = inject(ProductRepository);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  readonly id = input.required<string>();

  readonly product = signal<Product | null>(null);
  readonly isLoading = signal(false);
  readonly loadErrorMessage = signal<string | null>(null);
  readonly isSubmitting = signal(false);
  readonly saveErrorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadProduct();
  }

  updateProduct(product: Product): void {
    const { id, ...changes } = product;
    this.isSubmitting.set(true);
    this.saveErrorMessage.set(null);

    this.productRepository
      .update(id, changes)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (updatedProduct) => {
          this.notificationService.success(
            `Producto "${updatedProduct.name}" actualizado correctamente`,
          );
          this.router.navigateByUrl('/products');
        },
        error: (error: Error) => this.saveErrorMessage.set(error.message),
      });
  }

  private loadProduct(): void {
    this.isLoading.set(true);

    this.productRepository
      .getById(this.id())
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (product) => this.product.set(product),
        error: (error: Error) => this.loadErrorMessage.set(error.message),
      });
  }
}
