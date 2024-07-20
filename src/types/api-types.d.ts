import { HttpStatusCode } from 'axios';
import { PaginationState } from 'rc-pagination';

export interface Result<T> {
  rows: T[];
  count?: string | number;
  pagination?: PaginationState;
}

export interface ApiResponse<T> {
  data: Result<T>;
}

export interface ErrorResponse {
  statusCode: HttpStatusCode;
  error: string;
  message: string;
}
