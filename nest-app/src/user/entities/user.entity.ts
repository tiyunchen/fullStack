import { Entity, PrimaryGeneratedColumn, Column, Generated } from 'typeorm';

// 每个 entity 就是相当于一个数据库表，需要在 module 进行引入

@Entity()
export class User {
  // 主键id 递增
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid') // 自动生成主键
  uuid: string;

  @Column({ comment: '用户名', length: 100 })
  username: string;

  @Column({
    comment: '账号密码',
    select: true, // 查询该字段的时候会被过滤
  })
  password: string;

  @Column({ comment: '邮箱地址', nullable: true })
  email?: string;

  @Column({
    comment: '性别: male 男； female: 女； other：其他',
    type: 'enum',
    enum: ['male', 'female', 'other'],
    default: 'male',
  })
  gender?: string;

  @Column({
    comment: '创建时间',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({
    comment: '用户信息更新时间',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: string;

  @Column({
    comment: '最近登录时间',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  active_at?: string;
}
