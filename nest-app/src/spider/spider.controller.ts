import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SpiderService } from './spider.service';
import {
  CreateSpiderDto,
  SearchSpiderDto,
  RemoveSpiderDto,
  AddTagDto,
} from './dto/create-spider.dto';
import { UpdateSpiderDto } from './dto/update-spider.dto';
import {
  FilterOperator,
  FilterSuffix,
  Paginate,
  PaginateQuery,
  paginate,
  Paginated,
} from 'nestjs-paginate';
import { JwtAuthGuard } from '../common/authJwt/auth.guard';

@Controller('spider')
export class SpiderController {
  constructor(private readonly spiderService: SpiderService) {}

  @UseGuards(JwtAuthGuard)
  @Post('explore')
  explore(@Body() body: SearchSpiderDto) {
    console.log('body', body);
    return this.spiderService.spiderPage(body.url);
  }

  /**
   * 保存爬虫图片
   * @param body
   */
  @Post('store')
  async create(@Body() body: CreateSpiderDto) {
    return await this.spiderService.create(body.stores);
  }

  @Post('all')
  async findAll(@Body() query: PaginateQuery) {
    console.log('queryqueryqueryquery', query);
    const res = await this.spiderService.findAll(query);
    return res;
  }

  @Post('remove')
  async removeStores(@Body() body: RemoveSpiderDto) {
    console.log('删除', typeof body.id);
    return await this.spiderService.remove(body.id);
  }

  @Post('/addTags')
  async addTag(@Body() body: AddTagDto) {
    return await this.spiderService.addTags(body);
  }
}
