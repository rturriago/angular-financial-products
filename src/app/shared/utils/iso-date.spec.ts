import { addYears, parseIsoDate, toIsoDate, todayIsoDate } from './iso-date';

describe('iso-date utils', () => {
  describe('parseIsoDate', () => {
    it('should create the date in local time, not UTC', () => {
      const date = parseIsoDate('2025-01-01');

      expect(date?.getFullYear()).toBe(2025);
      expect(date?.getMonth()).toBe(0);
      expect(date?.getDate()).toBe(1);
    });

    it.each(['', 'hola', '2025-1-1', '01/01/2025', '2025-02-30', '2025-13-01'])(
      'should return null for the invalid date "%s"',
      (text) => {
        expect(parseIsoDate(text)).toBeNull();
      },
    );
  });

  describe('toIsoDate', () => {
    it('should format a date as yyyy-MM-dd with leading zeros', () => {
      expect(toIsoDate(new Date(2025, 2, 5))).toBe('2025-03-05');
    });
  });

  describe('todayIsoDate', () => {
    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return the current local date', () => {
      jest.useFakeTimers().setSystemTime(new Date(2025, 5, 15, 23, 30));

      expect(todayIsoDate()).toBe('2025-06-15');
    });
  });

  describe('addYears', () => {
    it.each([
      ['2025-03-10', '2026-03-10'],
      ['2025-12-31', '2026-12-31'],
      ['2024-02-29', '2025-02-28'],
      ['2027-02-28', '2028-02-28'],
    ])('should turn %s into %s when adding one year', (isoDate, expected) => {
      expect(addYears(isoDate, 1)).toBe(expected);
    });

    it('should return null when the date is invalid', () => {
      expect(addYears('hola', 1)).toBeNull();
    });
  });
});
