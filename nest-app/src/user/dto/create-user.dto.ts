import { IsNotEmpty, IsString } from 'class-validator';

/**
 * 用户登陆
 */
export class LoginUserDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString()
  username: string;
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  code: string;
}

/**
 * 用户注册
 */
export class RegisterUserDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString()
  username: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  code: string;
}
