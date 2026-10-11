import { normalizeText } from '../../../shared/utils/normalize-text';
import { Product } from '../models/product.model';

export function filterProductsByTerm(products: Product[], term: string): Product[] {
  const normalizedTerm = normalizeText(term);
  if (!normalizedTerm) {
    return products;
  }

  return products.filter((product) =>
    [product.name, product.description].some((field) =>
      normalizeText(field).includes(normalizedTerm),
    ),
  );
}
