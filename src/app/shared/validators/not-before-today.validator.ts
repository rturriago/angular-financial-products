import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { parseIsoDate, todayIsoDate } from '../utils/iso-date';

export function notBeforeTodayValidator(): ValidatorFn {
  return (control: AbstractControl<string | null>): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }
    if (!parseIsoDate(value)) {
      return { invalidDate: true };
    }
    return value < todayIsoDate() ? { beforeToday: true } : null;
  };
}
