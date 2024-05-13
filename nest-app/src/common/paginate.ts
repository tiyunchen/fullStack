import {
  FilterOperator,
  FilterSuffix,
  Paginate,
  PaginateQuery,
  paginate,
  PaginateConfig,
} from 'nestjs-paginate';
import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';

export interface PaginateD<T> {
  items: T[];
  // 总数
  total: number;
  // 是否有下一页
  hasNext: boolean;
}
export async function paginateD<T>(
  query: PaginateQuery,
  repo: Repository<T> | SelectQueryBuilder<T>,
  config: PaginateConfig<T>,
): Promise<PaginateD<T>> {
  query.page = query.page || 1;
  query.limit = query.limit || 10;
  const res = await paginate(query, repo, config);
  return {
    items: res.data,
    total: res.meta.totalItems,
    hasNext: !!res.links.next,
  };
}
