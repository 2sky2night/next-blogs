import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/modules/prisma/prisma.service";
import { CreateTagDto } from "@/modules/tag/dto";

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}
  create(createTagDto: CreateTagDto) {
    return this.prisma.tag.create({ data: createTagDto });
  }
  find(tid: number) {
    return this.prisma.tag.findUnique({ where: { tid } });
  }
  async findOne(tid: number) {
    const tag = await this.find(tid);
    if (tag === null) {
      throw new NotFoundException();
    }
    return tag;
  }
  findAll() {
    return this.prisma.tag.findMany();
  }

  /**
   * 根据标签id获取标签信息
   * @param tids
   */
  getTagsById(tids: number[]) {
    return Promise.all(tids.map((tid) => this.findOne(tid)));
  }

  /**
   * 查询帖子是否存在该标签
   * @param tid
   * @param aid
   */
  checkArticleTag(tid: number, aid: number) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.prisma.articleWithTags.findUnique({ where: { tid, aid } });
  }
  /**
   * 添加文章标签
   * @param tids
   * @param aid
   */
  async addArticleTags(tids: number[], aid: number) {
    const res = await Promise.all(
      tids.map((tid) => {
        return this.prisma.articleWithTags.create({
          data: {
            tid,
            aid,
          },
        });
      }),
    );
    return res;
  }
}
