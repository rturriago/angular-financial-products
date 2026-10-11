import { inject, Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { catchError, map, Observable, of, switchMap, timer } from 'rxjs';
import { ProductRepository } from '../data-access/product.repository';

export const PRODUCT_ID_CHECK_DEBOUNCE_MS = 300;

@Injectable({ providedIn: 'root' })
export class UniqueProductIdValidator implements AsyncValidator {
  private readonly productRepository = inject(ProductRepository);

  validate(control: AbstractControl<string>): Observable<ValidationErrors | null> {
    return timer(PRODUCT_ID_CHECK_DEBOUNCE_MS).pipe(
      switchMap(() => this.productRepository.existsById(control.value.trim())),
      map((exists) => (exists ? { idExists: true } : null)),
      catchError(() => of({ idVerificationFailed: true })),
    );
  }
}
