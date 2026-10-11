import { buildProduct } from '../testing/product.fixtures';
import { filterProductsByTerm } from './filter-products-by-term';

describe('filterProductsByTerm', () => {
  const creditCard = buildProduct({
    id: 'trj-crd',
    name: 'Tarjeta de Crédito',
    description: 'Tarjeta de consumo',
  });
  const savingsAccount = buildProduct({
    id: 'cta-ahr',
    name: 'Cuenta de Ahorros',
    description: 'Ahorro con intereses mensuales',
  });
  const products = [creditCard, savingsAccount];

  it.each(['', '   '])('should return all products when the term is "%s"', (term) => {
    expect(filterProductsByTerm(products, term)).toEqual(products);
  });

  it('should match by name ignoring case and accents', () => {
    expect(filterProductsByTerm(products, 'CREDITO')).toEqual([creditCard]);
  });

  it('should match by description', () => {
    expect(filterProductsByTerm(products, 'intereses')).toEqual([savingsAccount]);
  });

  it('should return an empty list when nothing matches', () => {
    expect(filterProductsByTerm(products, 'hipoteca')).toEqual([]);
  });
});
