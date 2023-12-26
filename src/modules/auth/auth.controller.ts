import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { CreateUserDto } from "./dto";
import { ValidationPipe } from "@/common/pipe";
import { AuthGuard, GithubTokenGuard } from "@/common/guard";
import { Request } from "express";
import { AuthService } from "@/modules/auth/auth.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * 创建用户
   * @param createUserDto
   */
  @UseGuards(GithubTokenGuard)
  @Post("/login/github")
  loginWithGithub(
    @Req() req: Request,
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const githubUser = req.githubUser as CreateUserDto;
    if (githubUser.uid !== createUserDto.uid) {
      // token与id不匹配
      throw new BadRequestException();
    }
    // 解析出token后需要校验请求体数据和token中的数据是否一致
    // 因为我们需要校验用户信息是否一致，才能正确地记录用户信息。
    return this.authService.loginWithGithub(createUserDto);
  }
  @UseGuards(AuthGuard)
  @Get("/verifyToken")
  verifyToken() {
    return null;
  }
}
