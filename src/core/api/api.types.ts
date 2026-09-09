export interface ValidationErrorItem {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail?: ValidationErrorItem[];
}

export interface ApiError {
  status: number | null;
  message: string;
  fieldErrors: Record<string, string>;
}
