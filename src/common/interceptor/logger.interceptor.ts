import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, catchError, throwError } from "rxjs";
import { tap } from "rxjs/operators";
import { Request } from "express";
import { format } from "util";

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(); // 实例化日志记录器

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now(); // 请求开始时间
    // 调用完handle()后得到RxJs响应对象，使用tap可以得到路由函数的返回值
    const host = context.switchToHttp();
    const request = host.getRequest<Request>();
    return next.handle().pipe(
      // 捕获错误才打印错误
      catchError((error) => {
        if (error.status >= 500) {
          // 服务器出错
          this.logger.error(
            format(
              "%s %s %dms %s",
              request.method,
              request.url,
              Date.now() - start,
              error,
            ),
          );
        } else {
          // 客户端出错
          this.logger.warn(
            format(
              "%s %s %dms %s",
              request.method,
              request.url,
              Date.now() - start,
              error.toString(),
            ),
          );
        }
        return throwError(error);
      }),
      // 成功
      tap((response) => {
        // 打印请求方法，请求链接，处理时间和响应数据
        this.logger.log(
          format(
            "%s %s %dms %s",
            request.method,
            request.url,
            Date.now() - start,
            JSON.stringify(response),
          ),
        );
      }),
    );
  }
}
