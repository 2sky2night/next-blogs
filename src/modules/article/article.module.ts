import { Module } from "@nestjs/common";
import { ArticleService } from "./article.service";
import { ArticleController } from "./article.controller";
import { PrismaModule } from "@/modules/prisma/prisma.module";
import { TagModule } from "@/modules/tag/tag.module";
import { UserModule } from "@/modules/user/user.module";

@Module({
  imports: [PrismaModule, TagModule, UserModule],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
