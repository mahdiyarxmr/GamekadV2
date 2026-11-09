import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class GodGameGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || (!user.godGameAllowed && user.role !== 'admin')) {
      throw new ForbiddenException('دسترسی مجاز نیست. شما مجوز میزبانی خدای بازی را ندارید.');
    }

    return true;
  }
}
