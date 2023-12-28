import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateArticleDto } from "@/modules/article/dto";
import { PrismaService } from "@/modules/prisma/prisma.service";
import { TagService } from "@/modules/tag/tag.service";
import { UserService } from "@/modules/user/user.service";

@Injectable()
export class ArticleService {
  constructor(
    private prisma: PrismaService,
    private tagService: TagService,
    private userService: UserService,
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
        await this.tagService.getTagsById(tids);
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
      await this.tagService.addArticleTags(tids, article.aid);
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

  /**
   * 分页查询文章信息
   * @param limit
   * @param offset
   */
  async findLimit(limit: number, offset: number) {
    const list = await this.prisma.article.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        aid: "desc",
      },
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

  /**
   * 获取所有文章
   */
  findAll() {
    return this.prisma.article.findMany({
      orderBy: {
        aid: "desc",
      },
    });
  }

  /**
   * 获取文章的详情信息
   * @param aid
   */
  async findArticleInfo(aid: number) {
    // 查询文章
    const article = await this.findOne(aid);
    // 查询文章的作者
    const user = await this.userService.findOne(article.authorId);
    // 查询文章的标签
    const tags = await this.tagService.findArticleTags(article.aid);

    return {
      ...article,
      user,
      tags,
    };
  }

  /**
   * 查询一个文章
   * @param aid
   */
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

  /**
   * 通过标签查询文章列表
   * @param tid
   */
  async findArticlesByTid(tid: number) {
    const aids = await this.tagService.findArticlesByTag(tid);
    return Promise.all(aids.map((aid) => this.findOne(aid)));
  }
}
