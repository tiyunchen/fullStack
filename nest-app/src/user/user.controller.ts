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

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(
    @Req() req: Request,
    @Body() createUserDto: CreateUserDto & { code?: string },
    @Headers() headers: Headers,
  ) {
    const code = req.session.code;

    if (!createUserDto.code || code.toLowerCase() !== createUserDto.code) {
      console.log('创建用户----post请求', code, createUserDto);
      return {
        result: false,
        msg: '验证码不正确',
      };
    }
    // return this.userService.create(createUserDto);
    return {
      result: true,
      data: createUserDto,
    };
  }

  @Get('code')
  verifyCode(@Req() req: Request, @Res() res: Response) {
    // res.send('22222222');
    const captcha = this.userService.verifyCode();
    req.session.code = captcha.text;
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
