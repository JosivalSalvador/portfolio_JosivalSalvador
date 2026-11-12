import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor<T> implements NestInterceptor<T, T> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    const startTime = Date.now();
    const request = context.switchToHttp().getRequest();
    
    console.log(`Starting request to ${request.url} at ${new Date(startTime).toISOString()}`);
    
    return next.handle().pipe(
      tap(() => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        console.log(`Completed request to ${request.url} in ${duration}ms at ${new Date(endTime).toISOString()}`);
      }),
    );
  }
}