import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, } from '@nestjs/common';
import { Request, Response } from 'express';
import { I18nService } from 'nestjs-i18n';



@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	constructor(private readonly i18n: I18nService) {}

  
  catch(exception: unknown, host: ArgumentsHost) {
    console.log(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
  
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message;
    let error;
  
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
  
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      }
      else if (typeof exceptionResponse === 'object') {
        const res: any = exceptionResponse;
        message = res.message || message;
        error = res.error || exception.name;
      }
  
      error = exception.name;
    }

    // Final fallback for unknown errors
    if (!message) {
      if (typeof exception === 'string') {
        message = exception;
      } else if (typeof exception === 'object' && exception !== null) {
        message = (exception as any).message || JSON.stringify(exception);
      } else {
        message = 'Unexpected error occurred';
      }
    }

    if (!error) {
      error = (exception as any)?.name || 'InternalServerError';
    }


    if(Array.isArray(message))message=message[0];
    message=this.i18n.t(message);

    response.status(status).json({
      message,
      error,
      statusCode: status,
    });
  }
}
