import { ValidationErrors } from '@angular/forms';

interface LengthErrorDetails {
  requiredLength: number;
}

const ERROR_MESSAGES: Record<string, (details: LengthErrorDetails) => string> = {
  required: () => 'Este campo es requerido!',
  minlength: ({ requiredLength }) => `Debe tener al menos ${requiredLength} caracteres`,
  maxlength: ({ requiredLength }) => `Debe tener máximo ${requiredLength} caracteres`,
  idExists: () => 'ID no válido! Ya existe un producto con este ID',
  idVerificationFailed: () => 'No se pudo verificar el ID. Inténtalo nuevamente',
  beforeToday: () => 'La fecha debe ser igual o mayor a la fecha actual',
  invalidDate: () => 'La fecha no es válida',
};

export function getFieldErrorMessage(errors: ValidationErrors | null): string | null {
  if (!errors) {
    return null;
  }
  const errorKey = Object.keys(errors).find((key) => key in ERROR_MESSAGES);
  return errorKey ? ERROR_MESSAGES[errorKey](errors[errorKey]) : null;
}
