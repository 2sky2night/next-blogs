import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  BadRequestException,
  ParseIntPipe,
} from "@nestjs/common";
import { ArticleService } from "./article.service";
import { CreateArticleDto } from "@/modules/article/dto";
import { LimitPipe, OffsetPipe, ValidationPipe } from "@/common/pipe";
import { AuthGuard } from "@/common/guard";
import { Token } from "@/common/decorator";

@Controller("article")
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  /**
   * 创建帖子
   * @param tids
   * @param title
   * @param content
   * @param authorId
   */
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

  /**
   * 查询所有帖子
   */
  @Get()
  findAll() {
    return this.articleService.findAll();
  }

  /**
   * 分页查询帖子
   * @param limit
   * @param offset
   */
  @Get("/list")
  findLimit(
    @Query("limit", LimitPipe) limit: number,
    @Query("offset", OffsetPipe) offset: number,
  ) {
    return this.articleService.findLimit(limit, offset);
  }

  /**
   * 获取帖子基本信息
   * @param aid
   */
  @Get("/base/:aid")
  findOne(@Param("aid", ParseIntPipe) aid: number) {
    return this.articleService.findOne(aid);
  }

  /**
   * 获取帖子详情信息
   * @param aid
   */
  @Get("/info/:aid")
  findOneInfo(@Param("aid", ParseIntPipe) aid: number) {
    return this.articleService.findArticleInfo(aid);
  }

  /**
   * 查询对应标签下的文章列表
   * @param tid
   */
  @Get("/tag/:tid")
  findArticlesByTid(@Param("tid", ParseIntPipe) tid: number) {
    return this.articleService.findArticlesByTid(tid);
  }
}
