import { Module, Global } from '@nestjs/common';
import { AuthJwtService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: 'cty',
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  providers: [AuthJwtService],
  exports: [AuthJwtService], // 导出 SharedService，使其可以在其他模块中使用
})
export class AuthJwtModule {}
