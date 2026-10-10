import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ApiError, getErrorMessageForStatus } from './api-error';

export const httpErrorInterceptor: HttpInterceptorFn = (request, next) =>
  next(request).pipe(
    catchError((error: HttpErrorResponse) =>
      throwError(() => new ApiError(getErrorMessageForStatus(error.status), error.status)),
    ),
  );
