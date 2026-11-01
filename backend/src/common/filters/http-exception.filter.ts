import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error.';

    // Log the full exception stack
    console.warn('Exception caught by filter:', {
      exception,
      type: typeof exception,
    });

    if (exception instanceof Error) {
      console.warn('Stack trace:', exception.stack);
    }

    response.status(status).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      error: message['message']
    });
  }
}
