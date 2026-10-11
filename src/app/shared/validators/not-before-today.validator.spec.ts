import { FormControl } from '@angular/forms';
import { notBeforeTodayValidator } from './not-before-today.validator';

describe('notBeforeTodayValidator', () => {
  const validate = (value: string | null) =>
    notBeforeTodayValidator()(new FormControl<string | null>(value));

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date(2025, 5, 15, 23, 30));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it.each([null, ''])('should ignore the empty value %p', (value) => {
    expect(validate(value)).toBeNull();
  });

  it.each(['2025-06-15', '2025-06-16', '2026-01-01'])('should accept %s', (value) => {
    expect(validate(value)).toBeNull();
  });

  it.each(['2025-06-14', '2024-12-31'])('should reject the past date %s', (value) => {
    expect(validate(value)).toEqual({ beforeToday: true });
  });

  it('should reject an invalid date', () => {
    expect(validate('2025-02-30')).toEqual({ invalidDate: true });
  });
});
