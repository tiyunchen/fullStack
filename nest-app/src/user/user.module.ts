import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { LoggerMiddleware } from '../middleware/logger.middleware';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([User])], // forFeature 会自动创建数据库表
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // 将 userService 进行导出成为共享模块
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 中间件使用
    consumer.apply(LoggerMiddleware).forRoutes('user');
  }
}
