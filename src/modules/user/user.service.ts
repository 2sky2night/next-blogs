import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/modules/prisma/prisma.service";
import { CreateUserDto } from "./dto";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /**
   * 创建用户
   * @param createUserDto
   */
  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  /**
   * 通过uid查询一个用户
   * @param uid 用户唯一标识
   */
  find(uid: number) {
    return this.prisma.user.findUnique({ where: { uid } });
  }

  /**
   * 通过uid必定查找到一个用户
   * @param uid
   */
  async findOne(uid: number) {
    const user = await this.prisma.user.findUnique({ where: { uid } });
    if (user === null) {
      throw new NotFoundException();
    }
    return user;
  }
}
