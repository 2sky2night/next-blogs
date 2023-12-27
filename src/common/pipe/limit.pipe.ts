import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";

/**
 * 校验limit参数的管道
 */
@Injectable()
export class LimitPipe implements PipeTransform<string | undefined, number> {
  transform(value?: string) {
    if (value === undefined) {
      return 20;
    }
    const _value = +value;
    if (isNaN(_value)) {
      throw new BadRequestException("limit参数非法!");
    }
    return _value;
  }
}
