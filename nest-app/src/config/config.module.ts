import { Module, Global } from '@nestjs/common';

export type ConfigType = {
  // 基本的 url
  baseUrl: string;
  [props: string]: any;
};

const config = {
  provide: 'config',
  useValue: {
    baseUrl: '/cty',
  },
};

@Global() // 需要使用 global 注册为全局模块
@Module({
  providers: [config],
  exports: [config], // 全局模块也是要导出为外部使用
})
export class ConfigModule {}
/**
 * 全局共享模块关键
 * 1. 模块要进行 Global 装饰, 并且要 exports 出去
 * 2. 在入口文件处要进行导入
 * 3. 使用的使用直接在对应的 construct 进行 inject导入
 *
 * 也可以使用动态模块的方式，动态模块就是要声明一个 静态的方法，
 * 并且在这个静态方法里返回这个之前由@Module装饰的东西
 */

// // 共享模块的动态使用方式
// @Module({})
// export class ConfigModule2 {
//   static forRoot(options) {
//     return {
//       providers: [config],
//       exports: [config], // 全局模块也是要导出为外部使用
//     };
//   }
// }
