/** Envelope used by the API in its successful responses: `{ message?, data }`. */
export interface ApiResponse<T> {
  message?: string;
  data: T;
}
