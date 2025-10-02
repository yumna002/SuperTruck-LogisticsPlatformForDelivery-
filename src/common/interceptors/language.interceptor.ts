import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class LanguageInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const langHeader = request.headers['accept-language'] || 'en';
    const lang = langHeader.toLowerCase().startsWith('ar') ? 'ar' : 'en';

    return next.handle().pipe(
      map((response) => {
        // Only transform `data`, leave top-level message/statusCode untouched
        if (response && response.data) {
          return {
            ...response,
            data: this.transformData(response.data, lang),
          };
        }
        return response;
      }),
    );
  }

  private transformData(obj: any, lang: 'en' | 'ar'): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.transformData(item, lang));
    }

    if (obj && typeof obj === 'object' && !(obj instanceof Date)) {
      const newObj: any = {};
      for (const [key, value] of Object.entries(obj)) {
        // Transform _en / _ar fields into a single key
        if (key.endsWith('_en') || key.endsWith('_ar')) {
          const baseKey = key.slice(0, -3);
          if (!newObj[baseKey]) {
            newObj[baseKey] =
              lang === 'ar'
                ? obj[`${baseKey}_ar`]
                : obj[`${baseKey}_en`];
          }
        } else if (typeof value === 'object') {
          // Recurse into nested objects/arrays
          newObj[key] = this.transformData(value, lang);
        } else {
          newObj[key] = value;
        }
      }
      return newObj;
    }

    // Primitives, nulls, Dates
    return obj;
  }
}
