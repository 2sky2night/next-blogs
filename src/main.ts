import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 设置接口前缀
  app.setGlobalPrefix("/api");
  // 启动端口
  await app.listen(4000);
}
bootstrap();
