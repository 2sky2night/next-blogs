import { IsString, IsNotEmpty, IsNumber } from "class-validator";

export class CreateUserDto {
  @IsNumber({})
  @IsNotEmpty({ message: "uid不能为空!" })
  readonly uid: number;

  @IsString({ message: "用户名为一个字符串!" })
  @IsNotEmpty({ message: "用户名不能为空!" })
  readonly username: string;

  @IsString({ message: "用户头像为一个字符串!" })
  @IsNotEmpty({ message: "用户头像不能为空!" })
  readonly avatar_url: string;
}
