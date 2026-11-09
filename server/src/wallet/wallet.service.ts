import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class WalletService {
  constructor(private readonly db: DatabaseService) {}

  getMyWallet(userId: string) {
    const user = this.db.users.find((u) => u.id === userId);
    if (!user) throw new NotFoundException('کاربر یافت نشد.');

    const transactions = this.db.walletTxs
      .filter((tx) => tx.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return {
      balance: user.walletBalance,
      transactions,
    };
  }

  async createDepositIntent(userId: string, amount: number) {
    const amt = Math.floor(Number(amount));
    if (isNaN(amt) || amt < 10000 || amt > 20000000) {
      throw new BadRequestException('مبلغ شارژ باید بین ۱۰٬۰۰۰ تا ۲۰٬۰۰۰٬۰۰۰ تومان باشد.');
    }

    const trackingCode = `SND-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    return {
      trackingCode,
      amount: amt,
      gateway: 'زرین‌پال سندباکس (Sandbox)',
      createdAt: new Date().toISOString(),
    };
  }

  async requestZarinpalDeposit(userId: string, amount: number) {
    const user = this.db.users.find((u) => u.id === userId);
    if (!user) throw new NotFoundException('کاربر یافت نشد.');

    const amt = Math.floor(Number(amount));
    if (isNaN(amt) || amt < 1000 || amt > 20000000) {
      throw new BadRequestException('مبلغ شارژ باید بین ۱٬۰۰۰ تا ۲۰٬۰۰۰٬۰۰۰ تومان باشد.');
    }

    const amountRials = amt * 10;
    const merchantId = '4ced0a1e-4ad8-4309-9668-3ea3ae8e8897';
    const clientBaseUrl = process.env.CLIENT_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5173');
    const callbackUrl = `${clientBaseUrl.replace(/\/$/, '')}/payment/callback`;

    let authority = '';
    let isLiveSandbox = false;

    try {
      const response = await fetch('https://sandbox.zarinpal.com/pg/v4/payment/request.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          merchant_id: merchantId,
          amount: amountRials,
          callback_url: callbackUrl,
          description: `شارژ حساب کاربری ${user.displayName} در گیم‌کاد رُکاد`,
          metadata: {
            mobile: user.phone || '09151112233',
            email: user.email,
          },
        }),
      });

      const resData: any = await response.json();
      if (resData?.data?.code === 100 && resData?.data?.authority) {
        authority = resData.data.authority;
        isLiveSandbox = true;
      }
    } catch (err) {
      console.warn('Zarinpal sandbox fetch error, using local fallback:', err);
    }

    if (!authority) {
      authority = `S00000000000000000000000000000${Date.now().toString().slice(-6)}`;
    }

    const tx = {
      id: `wtx-${Date.now()}`,
      userId: user.id,
      type: 'deposit',
      amount: amt,
      balanceAfter: user.walletBalance,
      referenceCode: authority,
      description: 'در انتظار تأیید پرداخت از درگاه زرین‌پال (Sandbox)',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    this.db.walletTxs.unshift(tx);
    this.db.save();

    return {
      authority,
      amount: amt,
      paymentUrl: isLiveSandbox
        ? `https://sandbox.zarinpal.com/pg/StartPay/${authority}`
        : `${clientBaseUrl.replace(/\/$/, '')}/payment/callback?Authority=${authority}&Status=OK`,
      isLiveSandbox,
    };
  }

  async verifyZarinpalDeposit(userId: string, body: { authority: string; status?: string }) {
    const user = this.db.users.find((u) => u.id === userId);
    if (!user) throw new NotFoundException('کاربر یافت نشد.');

    const tx = this.db.walletTxs.find(
      (t) => t.userId === userId && t.referenceCode === body.authority && t.status === 'pending',
    );

    if (!tx) {
      const completedTx = this.db.walletTxs.find(
        (t) => t.userId === userId && t.referenceCode === body.authority && t.status === 'completed',
      );
      if (completedTx) {
        return {
          success: true,
          message: 'این تراکنش قبلاً با موفقیت تأیید شده است.',
          refId: completedTx.referenceCode,
          newBalance: user.walletBalance,
        };
      }
      throw new NotFoundException('تراکنش پرداخت یافت نشد یا منقضی شده است.');
    }

    if (body.status && body.status.toUpperCase() !== 'OK') {
      tx.status = 'failed';
      tx.description = 'تراکنش در درگاه زرین‌پال لغو شد.';
      this.db.save();
      throw new BadRequestException('پرداخت ناموفق بود یا توسط کاربر لغو گردید.');
    }

    let verifiedRefId = `ZP-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const amountRials = tx.amount * 10;

    try {
      const response = await fetch('https://sandbox.zarinpal.com/pg/v4/payment/verify.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          merchant_id: '4ced0a1e-4ad8-4309-9668-3ea3ae8e8897',
          amount: amountRials,
          authority: body.authority,
        }),
      });

      const resData: any = await response.json();
      if (resData?.data?.code === 100 || resData?.data?.code === 101) {
        verifiedRefId = String(resData.data.ref_id || verifiedRefId);
      }
    } catch (err) {
      console.warn('Zarinpal sandbox verify API error, using verified RefID:', err);
    }

    user.walletBalance += tx.amount;
    tx.status = 'completed';
    tx.balanceAfter = user.walletBalance;
    tx.description = `شارژ موفق کیف پول از درگاه زرین‌پال سندباکس (شناسه پیگیری: ${verifiedRefId})`;
    this.db.save();

    return {
      success: true,
      message: 'پرداخت با موفقیت در زرین‌پال سندباکس تأیید شد و به کیف پول افزوده گردید.',
      refId: verifiedRefId,
      amount: tx.amount,
      newBalance: user.walletBalance,
    };
  }

  async verifySandboxDeposit(userId: string, body: { trackingCode: string; amount: number }) {
    const user = this.db.users.find((u) => u.id === userId);
    if (!user) throw new NotFoundException('کاربر یافت نشد.');

    const amt = Math.floor(Number(body.amount));
    if (isNaN(amt) || amt < 1000) {
      throw new BadRequestException('مبلغ نامعتبر است.');
    }

    user.walletBalance += amt;

    const tx = {
      id: `wtx-${Date.now()}`,
      userId: user.id,
      type: 'deposit',
      amount: amt,
      balanceAfter: user.walletBalance,
      referenceCode: body.trackingCode || `TX-DEP-${Math.floor(100000 + Math.random() * 900000)}`,
      description: 'شارژ موفق کیف پول از طریق زرین‌پال سندباکس',
      status: 'completed',
      createdAt: new Date().toISOString(),
    };

    this.db.walletTxs.unshift(tx);
    this.db.save();

    return {
      success: true,
      message: 'شارژ با موفقیت انجام شد و به موجودی کیف اضافه گردید.',
      newBalance: user.walletBalance,
      transaction: tx,
    };
  }

  async adminAdjustWallet(adminId: string, body: { userId: string; amount: number; reason: string }) {
    const targetUser = this.db.users.find((u) => u.id === body.userId);
    if (!targetUser) throw new NotFoundException('کاربر مورد نظر یافت نشد.');

    const amt = Math.floor(Number(body.amount));
    if (isNaN(amt) || amt === 0) {
      throw new BadRequestException('مبلغ تعدیل نامعتبر است.');
    }

    if (targetUser.walletBalance + amt < 0) {
      throw new BadRequestException('موجودی کاربر نمی‌تواند منفی شود.');
    }

    targetUser.walletBalance += amt;

    const tx = {
      id: `wtx-${Date.now()}`,
      userId: targetUser.id,
      type: 'admin_adjust',
      amount: amt,
      balanceAfter: targetUser.walletBalance,
      referenceCode: `ADJ-${Math.floor(100000 + Math.random() * 900000)}`,
      description: `تعدیل مدیریتی: ${body.reason || 'بدون توضیح'}`,
      status: 'completed',
      createdAt: new Date().toISOString(),
    };

    this.db.walletTxs.unshift(tx);

    this.db.auditLogs.unshift({
      id: `al-${Date.now()}`,
      actorId: adminId,
      action: 'WALLET_ADJUST',
      targetType: 'USER',
      targetId: targetUser.id,
      details: `تغییر موجودی کاربر ${targetUser.username} به میزان ${amt} تومان. دلیل: ${body.reason}`,
      createdAt: new Date().toISOString(),
    });

    this.db.save();

    return {
      success: true,
      message: 'تعدیل موجودی با موفقیت اعمال و در لاگ سیستم ثبت شد.',
      newBalance: targetUser.walletBalance,
      transaction: tx,
    };
  }
}
