import { Module } from "@nestjs/common";
import { PrismaModule } from "@/modules/prisma/prisma.module";
import { UserModule } from "@/modules/user/user.module";
import { AuthModule } from "@/modules/auth/auth.module";
import { ArticleModule } from "@/modules/article/article.module";
import { TagModule } from "@/modules/tag/tag.module";

@Module({
  imports: [PrismaModule, UserModule, AuthModule, TagModule, ArticleModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
