import { IsNotEmpty, IsString } from "class-validator";

/**
 * 创建帖子的数据传输对象
 */
export class CreateTagDto {
  @IsString({ message: "文章标签是为字符串类型!" })
  @IsNotEmpty({ message: "文章标签不能为空!" })
  readonly tag_name: string;
}
