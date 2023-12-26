import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { LoggerInterceptor, ResponseInterceptor } from "./common/interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      // 设置允许跨域的源
      origin: ["http://127.0.0.1:3000", "http://localhost:3000"],
    },
  });
  // 注册打印日志
  app.useGlobalInterceptors(new LoggerInterceptor());
  // 注册响应拦截器-格式化响应结果
  app.useGlobalInterceptors(new ResponseInterceptor());
  // 设置接口前缀
  app.setGlobalPrefix("/api");
  // 启动端口
  await app.listen(4000);
}
bootstrap();
