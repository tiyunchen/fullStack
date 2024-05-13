import { IsNotEmpty, IsNumber } from 'class-validator';

export class SpiderDto {
  @IsNotEmpty()
  src: string;

  sizeList: string[];
  sizeListStr: string;
  // 图片标题
  alt: string;
}
export class SearchSpiderDto {
  // 要爬虫的网站
  url: string;
}

export class CreateSpiderDto {
  stores: SpiderDto[];
}

export class RemoveSpiderDto {
  @IsNumber()
  id: number;
}

export class AddTagDto {
  @IsNotEmpty()
  tags: string[];

  @IsNotEmpty()
  @IsNumber()
  spiderId: number;
}
