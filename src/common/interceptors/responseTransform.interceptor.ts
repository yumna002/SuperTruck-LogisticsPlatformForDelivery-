import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { I18nService } from 'nestjs-i18n';



@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  constructor(
    private readonly i18n: I18nService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        let {message,data}=
          typeof response === 'object' && response !== null &&
          'message' in response && 'data' in response
          ? response
          : { message: 'Success', data: response };
          
        message=this.i18n.t(message);

        return {
          message,
          statusCode: context.switchToHttp().getResponse().statusCode,
          data,
        };
      }),
    );
  }
}
