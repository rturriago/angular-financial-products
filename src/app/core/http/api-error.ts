export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const DEFAULT_ERROR_MESSAGE = 'Ocurrió un error inesperado. Inténtalo nuevamente.';

const ERROR_MESSAGES_BY_STATUS: Record<number, string> = {
  0: 'No se pudo conectar con el servidor. Verifica tu conexión e inténtalo nuevamente.',
  400: 'Los datos enviados no son válidos. Revisa la información e inténtalo nuevamente.',
  404: 'El producto solicitado no existe.',
};

export function getErrorMessageForStatus(status: number): string {
  return ERROR_MESSAGES_BY_STATUS[status] ?? DEFAULT_ERROR_MESSAGE;
}
