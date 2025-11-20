export interface ApiListResponse<T> {
  data: T[];
  message: string;
  status: number;
}

export interface ApiSingleResponse<T> {
  data: T;
  message: string;
  status: number;
}
