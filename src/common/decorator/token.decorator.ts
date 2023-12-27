import {
  InternalServerErrorException,
  createParamDecorator,
} from "@nestjs/common";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";
import { TokenPayload } from "@/types/user";

/**
 * 解析出上下文中的token负载数据
 */
export const Token = createParamDecorator(
  (data: keyof TokenPayload, input: ExecutionContextHost) => {
    const request = input.switchToHttp().getRequest();
    const payload = request.user as TokenPayload;
    if (payload === undefined) {
      // 上下文未解析token负载的数据
      throw new InternalServerErrorException();
    }

    if (data === undefined) {
      // 未指定属性值,返回整个token
      return payload;
    } else {
      const value = payload[data];
      if (value === undefined) {
        throw new InternalServerErrorException();
      } else {
        return value;
      }
    }
  },
);
