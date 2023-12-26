import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { UserService } from "@/modules/user/user.service";
import { CreateUserDto } from "@/modules/auth/dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * github登录
   * @param createUserDto
   */
  async loginWithGithub(createUserDto: CreateUserDto) {
    const user = await this.userService.find(createUserDto.uid);
    if (user === null) {
      // 用户未注册过，保存用户信息
      await this.userService.create(createUserDto);
    }
    return {
      access_token: await this.createToken(createUserDto.uid),
    };
  }

  /**
   * 生成token信息
   * @param uid 用户id
   */
  async createToken(uid: number) {
    // 获取用户信息
    const user = await this.userService.findOne(uid);
    try {
      const token = await this.jwtService.signAsync({
        sub: uid,
        username: user.username,
      });
      return token;
    } catch (e) {
      // 生成token失败
      throw new InternalServerErrorException();
    }
  }
}
