import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

/**
 * 创建帖子的数据传输对象
 */
export class CreateArticleDto {
  @IsString({ message: "文章标题是为字符串类型!" })
  @IsNotEmpty({ message: "文章标题不能为空!" })
  readonly title: string;

  @IsString({ message: "文章内容是为字符串类型!" })
  @IsNotEmpty({ message: "文章内容不能为空!" })
  readonly content: string;

  @IsOptional()
  @ArrayMaxSize(10)
  @IsArray({ message: "文章标题是数组类型" })
  readonly tids?: number[];
}
