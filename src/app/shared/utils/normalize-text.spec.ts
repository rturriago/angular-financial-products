import { normalizeText } from './normalize-text';

describe('normalizeText', () => {
  it.each([
    ['Crédito', 'credito'],
    ['PRÉSTAMO', 'prestamo'],
    ['  Ahorros  ', 'ahorros'],
    ['Año', 'ano'],
    ['', ''],
  ])('should normalize "%s" to "%s"', (text, expected) => {
    expect(normalizeText(text)).toBe(expected);
  });
});
