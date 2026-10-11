import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Product } from '../../models/product.model';
import { buildProduct } from '../../testing/product.fixtures';
import { ProductTableComponent } from './product-table.component';

describe('ProductTableComponent', () => {
  let fixture: ComponentFixture<ProductTableComponent>;

  function render(products: Product[]): HTMLElement {
    fixture = TestBed.createComponent(ProductTableComponent);
    fixture.componentRef.setInput('products', products);
    fixture.detectChanges();
    return fixture.nativeElement;
  }

  it('should render one row per product', () => {
    const element = render([buildProduct({ id: 'uno' }), buildProduct({ id: 'dos' })]);

    expect(element.querySelectorAll('tbody tr.product-table__row')).toHaveLength(2);
  });

  it('should display the product data with dates as dd/MM/yyyy', () => {
    const element = render([
      buildProduct({
        name: 'Cuenta de Ahorros',
        description: 'Cuenta con intereses',
        date_release: '2025-01-01',
        date_revision: '2026-01-01',
      }),
    ]);
    const rowText = element.querySelector('tbody tr')?.textContent;

    expect(rowText).toContain('Cuenta de Ahorros');
    expect(rowText).toContain('Cuenta con intereses');
    expect(rowText).toContain('01/01/2025');
    expect(rowText).toContain('01/01/2026');
  });

  it('should emit the product when its edit action is selected', () => {
    const product = buildProduct({ id: 'uno' });
    const edited: Product[] = [];
    const element = render([product]);
    fixture.componentInstance.edit.subscribe((selected) => edited.push(selected));

    element.querySelector<HTMLButtonElement>('.dropdown-menu__trigger')!.click();
    fixture.detectChanges();
    element.querySelector<HTMLButtonElement>('[role="menuitem"]')!.click();

    expect(edited).toEqual([product]);
  });

  it('should ignore unknown actions', () => {
    const edited: Product[] = [];
    render([buildProduct()]);
    fixture.componentInstance.edit.subscribe((selected) => edited.push(selected));

    fixture.componentInstance.onActionSelected('unknown', buildProduct());

    expect(edited).toEqual([]);
  });

  it('should show an empty message when there are no products', () => {
    const element = render([]);

    expect(element.textContent).toContain('No hay productos para mostrar.');
  });
});
