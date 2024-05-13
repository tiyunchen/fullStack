import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Headers,
  Res,
  Req,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtService } from '../common/authJwt/auth.service';
import { UserService } from './user.service';
import { LoginUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    // private readonly jwtService: JwtService,
    private readonly authJwtService: AuthJwtService,
  ) {}

  @Post('register')
  create(@Req() req: Request, @Body() createUserDto: RegisterUserDto) {
    const code = req.session.verifyCode;
    console.log('创建用户----post请求', code, createUserDto);
    this.userService.equalVerify(req, createUserDto.code);

    return this.userService.create(createUserDto);
  }

  @Post('login')
  login(@Req() req: Request, @Body() body: LoginUserDto) {
    const code = req.session.verifyCode;
    console.log('创建用户----post请求', code, body);
    this.userService.equalVerify(req, body.code);
    return this.userService.userLogin(body);
  }

  @Get('code')
  verifyCodeImg(@Req() req: Request, @Res() res: Response) {
    const captcha = this.userService.createVerifyCode();
    // 将验证码存入到 session 里面
    req.session.verifyCode = captcha.text;
    res.type('image/svg+xml');
    res.send(captcha.data);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Get()
  findAll(@Query() query: any, @Req() req: Request) {
    console.log('req', query);
    return this.userService.findAll();
  }
}
