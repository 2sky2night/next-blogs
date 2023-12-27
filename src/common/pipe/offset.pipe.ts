import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";

/**
 * 校验limit参数的管道
 */
@Injectable()
export class OffsetPipe implements PipeTransform<string | undefined, number> {
  transform(value?: string) {
    if (value === undefined) {
      return 0;
    }
    const _value = +value;
    if (isNaN(_value)) {
      throw new BadRequestException("offset参数非法!");
    }
    return _value;
  }
}
