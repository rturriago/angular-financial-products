import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductLogoComponent } from '../product-logo/product-logo.component';

@Component({
  selector: 'app-product-table',
  imports: [DatePipe, ProductLogoComponent],
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductTableComponent {
  readonly products = input.required<Product[]>();
}
