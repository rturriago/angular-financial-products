import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { PageSizeSelectComponent } from '../../../../shared/ui/page-size-select/page-size-select.component';
import { SearchBoxComponent } from '../../../../shared/ui/search-box/search-box.component';
import { ProductTableComponent } from '../../components/product-table/product-table.component';
import { ProductRepository } from '../../data-access/product.repository';
import { Product } from '../../models/product.model';
import { filterProductsByTerm } from '../../utils/filter-products-by-term';
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS, PageSize } from './product-list.constants';

@Component({
  selector: 'app-product-list-page',
  imports: [ProductTableComponent, SearchBoxComponent, PageSizeSelectComponent, RouterLink],
  templateUrl: './product-list.page.html',
  styleUrl: './product-list.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListPage implements OnInit {
  private readonly productRepository = inject(ProductRepository);

  readonly pageSizeOptions = PAGE_SIZE_OPTIONS;

  readonly products = signal<Product[]>([]);
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly searchTerm = signal('');
  readonly pageSize = signal<PageSize>(DEFAULT_PAGE_SIZE);

  readonly filteredProducts = computed(() =>
    filterProductsByTerm(this.products(), this.searchTerm()),
  );
  readonly visibleProducts = computed(() => this.filteredProducts().slice(0, this.pageSize()));
  readonly resultsCount = computed(() => this.visibleProducts().length);

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
