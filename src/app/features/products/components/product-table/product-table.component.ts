import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import {
  DropdownMenuComponent,
  DropdownMenuItem,
} from '../../../../shared/ui/dropdown-menu/dropdown-menu.component';
import { Product } from '../../models/product.model';
import { ProductLogoComponent } from '../product-logo/product-logo.component';

const EDIT_ACTION = 'edit';

@Component({
  selector: 'app-product-table',
  imports: [DatePipe, ProductLogoComponent, DropdownMenuComponent],
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductTableComponent {
  readonly products = input.required<Product[]>();
  readonly edit = output<Product>();

  readonly productActions: DropdownMenuItem[] = [{ id: EDIT_ACTION, label: 'Editar' }];

  onActionSelected(actionId: string, product: Product): void {
    if (actionId === EDIT_ACTION) {
      this.edit.emit(product);
    }
  }
}
