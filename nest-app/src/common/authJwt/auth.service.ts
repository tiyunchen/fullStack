import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthJwtService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * 创建 token
   * @param payload
   */
  generateToken(payload: { username: string; password: string; id: number }) {
    return this.jwtService.sign({
      username: payload.username,
      password: payload.password,
      id: payload.id,
    });
  }

  /**
   * 验证 token
   * @param token
   */
  validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      return null;
    }
  }
}
