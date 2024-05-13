import { Module } from '@nestjs/common';
import { SpiderService } from './spider.service';
import { SpiderController } from './spider.controller';
import { Spider } from './entities/spider.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tags } from './entities/tags.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Spider, Tags])],
  controllers: [SpiderController],
  providers: [SpiderService],
})
export class SpiderModule {}
