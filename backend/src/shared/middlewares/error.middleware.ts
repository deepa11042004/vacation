import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { ResponseUtil } from '../utils/response.util';

export class AppError extends Error {
  public statusCode: number;
  public errors: any[];

  constructor(message: string, statusCode = 500, errors: any[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = 'AppError';
  }
}

export function errorHandler(error: unknown) {
  console.error('Error occurred:', error);

  if (error instanceof ZodError) {
    const formattedErrors = error.errors.map((err) => ({
      path: err.path.join('.'),
      message: err.message,
    }));
    return NextResponse.json(
      ResponseUtil.failure('Validation Failed', formattedErrors),
      { status: 400 }
    );
  }

  if (error instanceof AppError) {
    return NextResponse.json(
      ResponseUtil.failure(error.message, error.errors),
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      ResponseUtil.failure('Internal Server Error'),
      { status: 500 }
    );
  }

  return NextResponse.json(
    ResponseUtil.failure('Internal Server Error'),
    { status: 500 }
  );
}
