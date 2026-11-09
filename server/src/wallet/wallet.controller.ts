import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('api/v1/wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getMyWallet(@CurrentUser() user: any) {
    return this.walletService.getMyWallet(user.id);
  }

  @Post('deposit-intent')
  @UseGuards(JwtAuthGuard)
  createDepositIntent(@CurrentUser() user: any, @Body('amount') amount: number) {
    return this.walletService.createDepositIntent(user.id, amount);
  }

  @Post('zarinpal/request')
  @UseGuards(JwtAuthGuard)
  requestZarinpal(
    @CurrentUser() user: any,
    @Body('amount') amount: number,
  ) {
    return this.walletService.requestZarinpalDeposit(user.id, amount);
  }

  @Post('zarinpal/verify')
  @UseGuards(JwtAuthGuard)
  verifyZarinpal(
    @CurrentUser() user: any,
    @Body() body: { authority: string; status?: string },
  ) {
    return this.walletService.verifyZarinpalDeposit(user.id, body);
  }

  @Post('verify-sandbox')
  @UseGuards(JwtAuthGuard)
  verifySandbox(
    @CurrentUser() user: any,
    @Body() body: { trackingCode: string; amount: number },
  ) {
    return this.walletService.verifySandboxDeposit(user.id, body);
  }

  @Post('admin/adjust')
  @UseGuards(JwtAuthGuard, AdminGuard)
  adminAdjust(
    @CurrentUser() admin: any,
    @Body() body: { userId: string; amount: number; reason: string },
  ) {
    return this.walletService.adminAdjustWallet(admin.id, body);
  }
}
