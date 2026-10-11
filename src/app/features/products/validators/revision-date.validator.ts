import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { addYears } from '../../../shared/utils/iso-date';
import { PRODUCT_RULES } from '../models/product-rules';

export function revisionDateValidator(
  yearsAfterRelease: number = PRODUCT_RULES.revisionYearsAfterRelease,
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const releaseDate: string | null = group.get('date_release')?.value ?? null;
    const revisionDate: string | null = group.get('date_revision')?.value ?? null;
    if (!releaseDate || !revisionDate) {
      return null;
    }
    return addYears(releaseDate, yearsAfterRelease) === revisionDate
      ? null
      : { revisionDateMismatch: true };
  };
}
