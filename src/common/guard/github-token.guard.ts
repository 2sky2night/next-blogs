import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import axios from "axios";
import { httpsAgent } from "@/utils/http";
import type { Request } from "express";
import { GithubUserResponse } from "@/types/user";

/**
 * 校验github的token的守卫
 */
export class GithubTokenGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers.authorization;
    if (token === undefined) {
      // 无token
      return false;
    }
    // 有token
    try {
      const res = await axios.get<GithubUserResponse>(
        "https://api.github.com/user",
        {
          httpsAgent,
          headers: {
            accept: "application/json",
            authorization: token,
          },
        },
      );

      // 响应状态码不为200，依旧走错误流程
      if (res.status !== 200) throw new Error();
      // 将用户的token信息保存在上下文中
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      request.githubUser = {
        username: res.data.login,
        avatar_url: res.data.avatar_url,
        uid: res.data.id,
      };
      return true;
    } catch (e) {
      // 获取用户信息失败
      throw new UnauthorizedException();
    }
  }
}
