import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
  jwtService = new JwtService();
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 获取请求头部
    const request = context.switchToHttp().getRequest();
    // 获取请求头部的token
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      // 解析token
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SERCERT,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      // 将解析出来的token数据保存到上下文中
      request["user"] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
  // 从authorization中解析token
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
