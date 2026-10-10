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
  { path: '**', redirectTo: 'products' },
];
