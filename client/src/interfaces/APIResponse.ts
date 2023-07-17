export interface APIResponse<T> {
  data?: T;
  errors?: Array<string>;
  status?: number;
}
