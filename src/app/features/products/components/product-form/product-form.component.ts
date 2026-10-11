import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { getFieldErrorMessage } from '../../../../shared/forms/field-error-message';
import { FormFieldComponent } from '../../../../shared/ui/form-field/form-field.component';
import { addYears } from '../../../../shared/utils/iso-date';
import { notBeforeTodayValidator } from '../../../../shared/validators/not-before-today.validator';
import { Product } from '../../models/product.model';
import { PRODUCT_RULES } from '../../models/product-rules';
import { revisionDateValidator } from '../../validators/revision-date.validator';
import { UniqueProductIdValidator } from '../../validators/unique-product-id.validator';

type ProductField = keyof Product;

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, FormFieldComponent],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFormComponent {
  private readonly uniqueProductIdValidator = inject(UniqueProductIdValidator);
  private readonly changeDetector = inject(ChangeDetectorRef);

  readonly isSubmitting = input(false);
  readonly submitted = output<Product>();

  readonly form = new FormGroup(
    {
      id: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(PRODUCT_RULES.id.minLength),
          Validators.maxLength(PRODUCT_RULES.id.maxLength),
        ],
        asyncValidators: [
          this.uniqueProductIdValidator.validate.bind(this.uniqueProductIdValidator),
        ],
      }),
      name: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(PRODUCT_RULES.name.minLength),
          Validators.maxLength(PRODUCT_RULES.name.maxLength),
        ],
      }),
      description: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(PRODUCT_RULES.description.minLength),
          Validators.maxLength(PRODUCT_RULES.description.maxLength),
        ],
      }),
      logo: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      date_release: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, notBeforeTodayValidator()],
      }),
      date_revision: new FormControl(
        { value: '', disabled: true },
        { nonNullable: true, validators: [Validators.required] },
      ),
    },
    { validators: revisionDateValidator() },
  );

  constructor() {
    this.form.controls.date_release.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((releaseDate) => this.updateRevisionDate(releaseDate));

    this.form.events.pipe(takeUntilDestroyed()).subscribe(() => this.changeDetector.markForCheck());
  }

  isInvalid(field: ProductField): boolean {
    const control = this.form.controls[field];
    return control.invalid && control.touched;
  }

  errorFor(field: ProductField): string | null {
    return this.isInvalid(field) ? getFieldErrorMessage(this.form.controls[field].errors) : null;
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const product = this.form.getRawValue();
    this.submitted.emit({
      ...product,
      id: product.id.trim(),
      name: product.name.trim(),
      description: product.description.trim(),
      logo: product.logo.trim(),
    });
  }

  onReset(): void {
    this.form.reset();
  }

  private updateRevisionDate(releaseDate: string): void {
    const revisionDate = addYears(releaseDate, PRODUCT_RULES.revisionYearsAfterRelease) ?? '';
    this.form.controls.date_revision.setValue(revisionDate);
  }
}
