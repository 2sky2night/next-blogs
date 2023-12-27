import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  BadRequestException,
} from "@nestjs/common";
import { ArticleService } from "./article.service";
import { CreateArticleDto } from "@/modules/article/dto";
import { LimitPipe, OffsetPipe, ValidationPipe } from "@/common/pipe";
import { AuthGuard } from "@/common/guard";
import { Token } from "@/common/decorator";
import { TagService } from "@/modules/tag/tag.service";

@Controller("article")
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly tagSevice: TagService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body(new ValidationPipe())
    { tids, title, content }: CreateArticleDto,
    @Token("sub") authorId: number,
  ) {
    if (tids) {
      if (tids.some((tid) => typeof tid !== "number")) {
        throw new BadRequestException("tids参数非法!");
      }
      if (tids.length !== new Set(tids).size) {
        throw new BadRequestException("tids参数不允许重复!");
      }
      return this.articleService.create({ title, content, tids }, authorId);
    } else {
      return this.articleService.create({ title, content }, authorId);
    }
  }
  @Get()
  findAll() {
    return this.articleService.findAll();
  }
  @Get("/list")
  findLimit(
    @Query("limit", LimitPipe) limit: number,
    @Query("offset", OffsetPipe) offset: number,
  ) {
    return this.articleService.findLimit(limit, offset);
  }

  @Get(":aid")
  findOne(@Param("aid") aid: string) {
    return this.articleService.findOne(+aid);
  }
}
