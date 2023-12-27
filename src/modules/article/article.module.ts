import { Module } from "@nestjs/common";
import { ArticleService } from "./article.service";
import { ArticleController } from "./article.controller";
import { PrismaModule } from "@/modules/prisma/prisma.module";
import { TagModule } from "@/modules/tag/tag.module";

@Module({
  imports: [PrismaModule, TagModule],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
