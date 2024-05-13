import {
  Injectable,
  ExecutionContext,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { AuthJwtService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly authJwtService: AuthJwtService,
    private readonly reflector: Reflector,
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 在这里可以访问请求对象和用户信息
    //   const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler())
    //   if (isPublic) {
    //       return true
    //   }

    console.log('this.reflector', this.reflector);
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('请登录');
    }
    try {
      const user = this.authJwtService.validateToken(authHeader);
      if (!user) {
        throw new UnauthorizedException('请登录');
      }
      console.log('user', user);
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('请登录');
    }
  }
  handleRequest(err: Error, user: any) {
    // 在这里处理验证结果
    if (err || !user) {
      throw err || new HttpException('token 无效', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
