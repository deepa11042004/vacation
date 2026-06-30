export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

export class ResponseUtil {
  static success<T>(message: string, data: T): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
    };
  }

  static failure(message: string, errors: any[] = []): ApiResponse<any> {
    return {
      success: false,
      message,
      errors,
    };
  }
}
