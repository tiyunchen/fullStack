import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Generated,
  OneToMany,
} from 'typeorm';
import { Tags } from './tags.entity';

@Entity()
export class Spider {
  // 主键id 递增
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid') // 自动生成主键
  uuid: string;

  @Column({ comment: '图片地址', unique: true })
  src: string;

  @Column({ comment: '图片尺寸列表', type: 'simple-array' })
  sizeList: string[];

  @Column({ comment: '图片标题' })
  alt: string;

  @Column({
    comment: '创建时间',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @OneToMany(() => Tags, (tag) => tag.spider)
  tags: Tags[];
}
