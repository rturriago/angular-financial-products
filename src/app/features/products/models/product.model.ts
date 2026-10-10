export interface Product {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
}

export type UpdateProductRequest = Omit<Product, 'id'>;
