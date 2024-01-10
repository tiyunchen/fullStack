import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Request, Response, NextFunction } from 'express';
import * as session from 'express-session';

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
  const app = await NestFactory.create(AppModule);
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
  await app.listen(3000);
}
bootstrap();
