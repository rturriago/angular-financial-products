import { getInitials } from './get-initials';

describe('getInitials', () => {
  it.each([
    ['Tarjeta de Crédito', 'TD'],
    ['cuenta', 'C'],
    ['  Préstamo   Vehicular  ', 'PV'],
    ['', ''],
  ])('should return the initials of "%s" as "%s"', (text, expected) => {
    expect(getInitials(text)).toBe(expected);
  });
});
