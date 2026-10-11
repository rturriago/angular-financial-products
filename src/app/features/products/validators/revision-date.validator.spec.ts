import { FormControl, FormGroup } from '@angular/forms';
import { revisionDateValidator } from './revision-date.validator';

describe('revisionDateValidator', () => {
  const validate = (dateRelease: string, dateRevision: string) =>
    revisionDateValidator()(
      new FormGroup({
        date_release: new FormControl(dateRelease),
        date_revision: new FormControl(dateRevision),
      }),
    );

  it('should accept a revision date exactly one year after the release', () => {
    expect(validate('2025-03-10', '2026-03-10')).toBeNull();
  });

  it('should accept Feb 28 as the revision of a Feb 29 release', () => {
    expect(validate('2024-02-29', '2025-02-28')).toBeNull();
  });

  it.each([
    ['2025-03-10', '2026-03-11'],
    ['2025-03-10', '2027-03-10'],
  ])('should reject %s released and %s revised', (release, revision) => {
    expect(validate(release, revision)).toEqual({ revisionDateMismatch: true });
  });

  it.each([
    ['', '2026-03-10'],
    ['2025-03-10', ''],
  ])('should ignore incomplete dates (%p, %p)', (release, revision) => {
    expect(validate(release, revision)).toBeNull();
  });

  it('should ignore a group without date controls', () => {
    expect(revisionDateValidator()(new FormGroup({}))).toBeNull();
  });
});
