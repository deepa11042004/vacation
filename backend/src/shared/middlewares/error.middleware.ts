import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { UniqueConstraintError, ValidationError as SequelizeValidationError } from 'sequelize';
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
  const safe = error instanceof Error
    ? { name: error.name, message: error.message, stack: error.stack }
    : String(error);
  try { console.error('Error occurred:', safe); } catch { console.error('Error occurred:', String(error)); }

  if (error instanceof UniqueConstraintError) {
    const field = error.errors?.[0]?.path ?? 'field';
    return NextResponse.json(
      ResponseUtil.failure(`A record with this ${field} already exists.`),
      { status: 409 },
    );
  }

  if (error instanceof SequelizeValidationError) {
    const messages = error.errors.map(e => e.message);
    return NextResponse.json(
      ResponseUtil.failure('Validation failed', messages),
      { status: 400 },
    );
  }

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
