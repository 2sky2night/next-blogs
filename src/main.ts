import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ResponseInterceptor } from "./common/interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 注册响应拦截器-格式化响应结果
  app.useGlobalInterceptors(new ResponseInterceptor());
  // 设置接口前缀
  app.setGlobalPrefix("/api");
  // 启动端口
  await app.listen(4000);
}
bootstrap();
