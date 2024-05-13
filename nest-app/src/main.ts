import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Request, Response, NextFunction } from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';
import { Response as ResponseY } from './common/response';
import { HttpFilter } from './common/filter';
import * as path from 'path';
import { ValidationPipe } from '@nestjs/common';

/**
 * 全局中间件---- 是个函数，
 * @param req
 * @param res
 * @param next
 * @constructor
 */
function MiddleWareAll(req: Request, res: Response, next: NextFunction) {
  console.log('全局中间件');
  next();
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(
    session({
      secret: 'cty.cty',
      rolling: true,
      name: 'cty',
    }),
  );
  app.use(MiddleWareAll);
  // 跨域设置
  app.enableCors();

  // 配置静态资源访问
  app.useStaticAssets(path.join(__dirname, 'images'));

  // 引入全局异常过滤器
  app.useGlobalFilters(new HttpFilter());

  // 引入全局的拦截器
  app.useGlobalInterceptors(new ResponseY());

  // 入参校验
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
