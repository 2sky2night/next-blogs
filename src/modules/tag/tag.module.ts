import { Module } from "@nestjs/common";
import { PrismaModule } from "@/modules/prisma/prisma.module";
import { TagService } from "@/modules/tag/tag.service";
import { TagController } from "@/modules/tag/tag.controller";

@Module({
  imports: [PrismaModule],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
