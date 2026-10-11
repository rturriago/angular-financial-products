import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'products' },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/pages/product-list/product-list.page').then(
        (module) => module.ProductListPage,
      ),
  },
  {
    path: 'products/new',
    loadComponent: () =>
      import('./features/products/pages/create-product/create-product.page').then(
        (module) => module.CreateProductPage,
      ),
  },
  {
    path: 'products/:id/edit',
    loadComponent: () =>
      import('./features/products/pages/edit-product/edit-product.page').then(
        (module) => module.EditProductPage,
      ),
  },
  { path: '**', redirectTo: 'products' },
];
