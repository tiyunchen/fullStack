import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface DATA<T> {
  data: T;
  status?: 0 | 1 | 2;
  msg?: string;
  success?: boolean;
}

/**
 * 响应拦截器
 */
@Injectable()
export class Response<T> implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<DATA<T>> {
    return next.handle().pipe(
      map((data) => {
        // console.log('响应拦截器', data);
        return {
          data,
          status: 0,
          msg: 'success',
          success: true,
        };
      }),
    );
  }
}
