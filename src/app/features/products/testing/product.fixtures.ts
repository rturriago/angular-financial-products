import { Product } from '../models/product.model';

/** Builds a valid product for tests. Override only the fields relevant to each test. */
export function buildProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'trj-crd',
    name: 'Tarjeta de Crédito',
    description: 'Tarjeta de consumo bajo la modalidad de crédito',
    logo: 'https://example.com/logo.png',
    date_release: '2025-01-01',
    date_revision: '2026-01-01',
    ...overrides,
  };
}
