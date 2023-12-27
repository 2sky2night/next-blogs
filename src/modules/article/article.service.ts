import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateArticleDto } from "@/modules/article/dto";
import { PrismaService } from "@/modules/prisma/prisma.service";
import { TagService } from "@/modules/tag/tag.service";

@Injectable()
export class ArticleService {
  constructor(
    private prisma: PrismaService,
    private tagServie: TagService,
  ) {}

  /**
   * 创建帖子
   * @param createArticleDto 请求体
   * @param authorId 创建帖子的用户id
   */
  async create({ title, tids, content }: CreateArticleDto, authorId: number) {
    if (tids) {
      // 传入了文章标签
      try {
        // 查询tids的合法性，tid必须存在
        await this.tagServie.getTagsById(tids);
      } catch {
        throw new BadRequestException("参数tids不合法!");
      }
      // 创建文章
      const article = await this.prisma.article.create({
        data: {
          title,
          content,
          authorId,
        },
      });
      // 添加标签
      await this.tagServie.addArticleTags(tids, article.aid);
      return article;
    } else {
      // 未传入文章标签
      return this.prisma.article.create({
        data: {
          title,
          content,
          authorId,
        },
      });
    }
  }

  async findLimit(limit: number, offset: number) {
    const list = await this.prisma.article.findMany({
      skip: offset,
      take: limit,
    });
    const total = (await this.findAll()).length;
    return {
      list,
      total,
      limit,
      offset,
      has_more: total > limit + offset,
    };
  }

  findAll() {
    return this.prisma.article.findMany();
  }

  async findOne(aid: number) {
    const article = await this.prisma.article.findUnique({
      where: {
        aid,
      },
    });
    if (article === null) {
      throw new NotFoundException();
    }
    return article;
  }
}
