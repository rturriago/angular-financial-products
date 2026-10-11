import { getFieldErrorMessage } from './field-error-message';

describe('getFieldErrorMessage', () => {
  it('should return null when there are no errors', () => {
    expect(getFieldErrorMessage(null)).toBeNull();
  });

  it.each([
    [{ required: true }, 'Este campo es requerido!'],
    [{ minlength: { requiredLength: 3, actualLength: 2 } }, 'Debe tener al menos 3 caracteres'],
    [{ maxlength: { requiredLength: 10, actualLength: 11 } }, 'Debe tener máximo 10 caracteres'],
    [{ idExists: true }, 'ID no válido! Ya existe un producto con este ID'],
    [{ idVerificationFailed: true }, 'No se pudo verificar el ID. Inténtalo nuevamente'],
    [{ beforeToday: true }, 'La fecha debe ser igual o mayor a la fecha actual'],
    [{ invalidDate: true }, 'La fecha no es válida'],
  ])('should translate %p', (errors, expectedMessage) => {
    expect(getFieldErrorMessage(errors)).toBe(expectedMessage);
  });

  it('should return null for unknown errors', () => {
    expect(getFieldErrorMessage({ somethingElse: true })).toBeNull();
  });
});
