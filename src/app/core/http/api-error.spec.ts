import { ApiError, getErrorMessageForStatus } from './api-error';

describe('getErrorMessageForStatus', () => {
  it.each([
    [0, 'No se pudo conectar con el servidor'],
    [400, 'Los datos enviados no son válidos'],
    [404, 'El producto solicitado no existe'],
  ])('should return a specific message for status %s', (status, expectedMessage) => {
    expect(getErrorMessageForStatus(status)).toContain(expectedMessage);
  });

  it('should return a generic message for unknown statuses', () => {
    expect(getErrorMessageForStatus(500)).toBe(
      'Ocurrió un error inesperado. Inténtalo nuevamente.',
    );
  });
});

describe('ApiError', () => {
  it('should keep the message and the status', () => {
    const error = new ApiError('Algo falló', 404);

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Algo falló');
    expect(error.status).toBe(404);
    expect(error.name).toBe('ApiError');
  });
});
