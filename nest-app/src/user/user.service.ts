import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as svgCaptcha from 'svg-captcha';
import type { ConfigObject } from 'svg-captcha';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import type { Request } from 'express';
import { AuthJwtService } from '../common/authJwt/auth.service';

const sleep = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 3000);
  });
};

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
    private readonly jwtService: AuthJwtService,
  ) {}
  async create(createUserDto: RegisterUserDto) {
    const oldU = await this.user.findOne({
      where: { username: createUserDto.username },
    });
    if (oldU) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }
    const nU = new User();
    nU.username = createUserDto.username;
    nU.password = createUserDto.password;
    await this.user.save(nU);
    const token = this.jwtService.generateToken({
      username: nU.username,
      password: nU.password,
      id: nU.id,
    });
    return {
      ...nU,
      token: token,
    };
  }

  async userLogin(body: LoginUserDto) {
    const user = await this.user.findOne({
      where: { username: body.username },
    });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    if (user.password !== body.password) {
      throw new HttpException('用户名或密码不正确', HttpStatus.BAD_REQUEST);
    }
    // todo 创建 token
    const token = this.jwtService.generateToken({
      username: user.username,
      password: user.password,
      id: user.id,
    });
    return { ...user, token };
  }

  equalVerify(req: Request, code: string) {
    const sCode = req.session.verifyCode;
    if (!code || !sCode || sCode.toLowerCase() !== code.toLowerCase()) {
      delete req.session.verifyCode;
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  /**
   * 创建验证码
   * @param option
   */
  createVerifyCode(option?: ConfigObject) {
    return svgCaptcha.create(option);
  }
}
