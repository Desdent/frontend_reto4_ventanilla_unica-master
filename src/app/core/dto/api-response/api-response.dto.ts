export class ApiResponseDto<T> {
  success?: boolean;
  data?: T;
  message?: string;
  statusCode?: number;

  static ok<T>(data: T, message?: string): ApiResponseDto<T> {
    return {
      success: true,
      message: message,
      data: data,
    };
  }

  static error<T>(statusCode: number, message?: string): ApiResponseDto<T> {
    return {
      success: false,
      statusCode: statusCode,
      message: message,
    };
  }
}
