import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly db: DatabaseService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('لطفاً ابتدا وارد حساب کاربری خود شوید.');
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = this.jwtService.verify(token);
      const user = this.db.users.find((u) => u.id === payload.sub);

      if (!user) {
        throw new UnauthorizedException('حساب کاربری یافت نشد.');
      }

      if (user.isSuspended) {
        throw new UnauthorizedException('حساب کاربری شما معلق شده است.');
      }

      // Strip sensitive fields
      const { passwordHash, ...safeUser } = user;
      request.user = safeUser;
      return true;
    } catch (err) {
      throw new UnauthorizedException('توکن نامعتبر یا منقضی شده است.');
    }
  }
}
