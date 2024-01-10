import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { LoggerMiddleware } from '../middleware/logger.middleware';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 中间件使用
    consumer.apply(LoggerMiddleware).forRoutes('user');
  }
}
