import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AddTagDto, CreateSpiderDto, SpiderDto } from './dto/create-spider.dto';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FilterOperator,
  FilterSuffix,
  Paginate,
  PaginateQuery,
  paginate,
  Paginated,
} from 'nestjs-paginate';

import { Repository, Like } from 'typeorm';
import { Spider } from './entities/spider.entity';
import { paginateD } from '../common/paginate';
import { Tags } from './entities/tags.entity';
@Injectable()
export class SpiderService {
  constructor(
    @InjectRepository(Spider) private readonly spider: Repository<Spider>,
    @InjectRepository(Tags) private readonly tags: Repository<Tags>,
  ) {}
  async create(stores: SpiderDto[]) {
    for (const store of stores) {
      const existingUser = await this.spider.findOne({
        where: {
          src: store.src,
        },
      });
      if (!existingUser) {
        await this.spider.save(store);
      } else {
        console.log('目标存在');
      }
    }
    const res = await this.spider.find();
    console.log('查询', res.length);
    return true;
    // return res;
  }

  async findAll(query: PaginateQuery) {
    const res = await paginateD(query, this.spider, {
      sortableColumns: ['id'],
      relations: ['tags'],
      // nullSort: 'last',
      // defaultSortBy: [['id', 'DESC']],
      // searchableColumns: ['name', 'color', 'age'],
      // select: ['id', 'name', 'color', 'age', 'lastVetVisit'],
      // filterableColumns: {
      //   name: [FilterOperator.EQ, FilterSuffix.NOT],
      //   age: true,
      // },
    });
    return res;
  }

  async getPage(url: string) {
    return await axios
      .get(url)
      .then((res) => res.data)
      .catch((err) => {
        throw new HttpException(err, HttpStatus.BAD_REQUEST);
      });
  }

  async spiderPage(url: string) {
    const imgList = [];
    const body = await this.getPage(url);

    const $ = cheerio.load(body);
    $('figure[data-test="photo-grid-list-figure"]').each(function (i, el) {
      const img = $($(el).find('img[itemprop="thumbnailUrl"]').get(0));
      const alt = img.attr('alt');
      const srcset = img.attr('srcset');
      const itemprop = img.attr('itemprop');
      if (img && srcset && itemprop) {
        const srcList = srcset.split(',');
        const highQuailt = srcList[srcList.length - 1];
        imgList.push({
          src: highQuailt,
          alt,
          sizeList: srcList,
        });
      }
    });

    // 查询是否已经存在数据库里
    for (const el of imgList) {
      const isExist = await this.spider.findOne({ where: { src: el.src } });
      el.isExist = !!isExist;
    }

    return {
      imgList,
      size: imgList.length,
    };
  }

  async remove(id: number) {
    const store = await this.spider.findOne({ where: { id: id } });
    if (store) {
      await this.spider.remove(store);
      return true;
    } else {
      throw new HttpException('资源不存在', HttpStatus.NOT_FOUND);
    }
  }

  async addTags(body: AddTagDto) {
    console.log('dddddddd', body);
    const spider = await this.spider.findOne({ where: { id: body.spiderId } });
    if (!spider) {
      throw new HttpException('资源不存在', HttpStatus.NOT_FOUND);
    }

    const tagList: Tags[] = [];
    for (const tag of body.tags) {
      const nT = new Tags();
      nT.name = tag;
      await this.tags.save(nT);
      tagList.push(nT);
    }
    spider.tags = tagList;
    await this.spider.save(spider);

    return spider;
  }
}
