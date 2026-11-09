import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ReservationsService {
  constructor(private readonly db: DatabaseService) {}

  async createReservation(userId: string, body: { eventId: string; seats: number }) {
    const seats = Number(body.seats) || 1;
    if (seats < 1 || seats > 4) {
      throw new BadRequestException('تعداد صندلی باید بین ۱ تا ۴ باشد.');
    }

    const event = this.db.events.find((e) => e.id === body.eventId);
    if (!event) {
      throw new NotFoundException('رویداد مورد نظر یافت نشد.');
    }

    if (event.status !== 'open') {
      throw new BadRequestException('ثبت‌نام برای این رویداد در حال حاضر باز نیست.');
    }

    const user = this.db.users.find((u) => u.id === userId);
    if (!user) {
      throw new NotFoundException('کاربر یافت نشد.');
    }

    // Gender check
    if (event.targetGender === 'boys' && user.gender !== 'boy') {
      throw new BadRequestException('این میز اختصاصی پسران است.');
    }
    if (event.targetGender === 'girls' && user.gender !== 'girl') {
      throw new BadRequestException('این میز اختصاصی دختران است.');
    }

    // Check existing active reservation
    const existing = this.db.reservations.find(
      (r) =>
        r.eventId === event.id &&
        r.userId === userId &&
        ['pending', 'paid', 'partially_paid', 'venue_due'].includes(r.paymentStatus),
    );
    if (existing) {
      throw new BadRequestException('شما قبلاً یک رزرو فعال برای این رویداد ثبت کرده‌اید.');
    }

    // Capacity check
    if (event.reservedCount + seats > event.capacity) {
      throw new BadRequestException('ظرفیت خالی کافی برای این تعداد صندلی وجود ندارد.');
    }

    const unitPrice = event.price;
    const totalPrice = unitPrice * seats;

    let onlineRequired = 0;
    let venueDue = 0;
    let paymentStatus = 'pending';
    let paidOnline = 0;

    if (event.payType === 'venue' || totalPrice === 0) {
      onlineRequired = 0;
      venueDue = totalPrice;
      paymentStatus = 'venue_due';
      event.reservedCount += seats;
    } else if (event.payType === 'deposit') {
      const unitDeposit = event.depositAmount > 0 ? event.depositAmount : Math.round(unitPrice * 0.3);
      onlineRequired = unitDeposit * seats;
      venueDue = totalPrice - onlineRequired;
    } else {
      // 'full'
      onlineRequired = totalPrice;
      venueDue = 0;
    }

    const newReservation = {
      id: `res-${Date.now()}`,
      eventId: event.id,
      userId: user.id,
      seats,
      totalPrice,
      paidOnline: 0,
      venueDue,
      paymentStatus,
      holdUntil: onlineRequired > 0 ? new Date(Date.now() + 15 * 60 * 1000).toISOString() : null,
      attended: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Golden rule: If wallet balance >= onlineRequired -> deduct directly from wallet!
    if (onlineRequired > 0) {
      if (user.walletBalance >= onlineRequired) {
        user.walletBalance -= onlineRequired;
        paidOnline = onlineRequired;
        newReservation.paidOnline = paidOnline;
        newReservation.paymentStatus = event.payType === 'deposit' ? 'partially_paid' : 'paid';
        newReservation.holdUntil = null;
        event.reservedCount += seats;

        // Record transaction
        this.db.walletTxs.push({
          id: `wtx-${Date.now()}`,
          userId: user.id,
          type: 'reserve_event',
          amount: -onlineRequired,
          balanceAfter: user.walletBalance,
          referenceCode: `TX-RES-${Math.floor(100000 + Math.random() * 900000)}`,
          description: `پرداخت آنلاین رزرو رویداد "${event.title}" از موجودی کیف پول`,
          status: 'completed',
          createdAt: new Date().toISOString(),
        });
      } else {
        // Pending sandbox payment
        newReservation.paymentStatus = 'pending';
      }
    }

    this.db.reservations.unshift(newReservation);
    this.db.save();

    return {
      reservation: newReservation,
      paidFromWallet: paidOnline > 0,
      requiresSandbox: newReservation.paymentStatus === 'pending',
      amountDueOnline: onlineRequired - paidOnline,
    };
  }

  getMyReservations(userId: string) {
    return this.db.reservations
      .filter((r) => r.userId === userId)
      .map((r) => {
        const event = this.db.events.find((e) => e.id === r.eventId);
        const category = event ? this.db.categories.find((c) => c.id === event.categoryId) : null;
        return {
          ...r,
          event: event ? { ...event, category } : null,
        };
      });
  }

  async payPendingWithSandbox(reservationId: string, userId: string) {
    const reservation = this.db.reservations.find((r) => r.id === reservationId && r.userId === userId);
    if (!reservation) {
      throw new NotFoundException('رزرو یافت نشد.');
    }

    if (reservation.paymentStatus !== 'pending') {
      throw new BadRequestException('این رزرو نیازی به پرداخت ندارد.');
    }

    const event = this.db.events.find((e) => e.id === reservation.eventId);
    if (!event) {
      throw new NotFoundException('رویداد مرتبط یافت نشد.');
    }

    const onlineDue = reservation.totalPrice - reservation.venueDue - reservation.paidOnline;

    reservation.paidOnline += onlineDue;
    reservation.paymentStatus = reservation.venueDue > 0 ? 'partially_paid' : 'paid';
    reservation.holdUntil = null;
    reservation.updatedAt = new Date().toISOString();

    // Increase reserved count
    event.reservedCount += reservation.seats;

    this.db.save();

    return {
      success: true,
      message: 'پرداخت سندباکس با موفقیت تأیید شد و صندلی تثبیت گردید.',
      reservation,
    };
  }

  async cancelReservation(reservationId: string, userId: string) {
    const reservation = this.db.reservations.find((r) => r.id === reservationId && r.userId === userId);
    if (!reservation) {
      throw new NotFoundException('رزرو یافت نشد.');
    }

    const event = this.db.events.find((e) => e.id === reservation.eventId);

    if (['paid', 'partially_paid', 'venue_due'].includes(reservation.paymentStatus)) {
      if (event) {
        event.reservedCount = Math.max(0, event.reservedCount - reservation.seats);
      }
      // If paid money, refund to wallet
      if (reservation.paidOnline > 0) {
        const user = this.db.users.find((u) => u.id === userId);
        if (user) {
          user.walletBalance += reservation.paidOnline;
          this.db.walletTxs.push({
            id: `wtx-${Date.now()}`,
            userId: user.id,
            type: 'refund',
            amount: reservation.paidOnline,
            balanceAfter: user.walletBalance,
            referenceCode: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
            description: `استرداد وجه لغو رزرو رویداد "${event?.title || ''}"`,
            status: 'completed',
            createdAt: new Date().toISOString(),
          });
        }
      }
    }

    reservation.paymentStatus = 'refunded';
    reservation.updatedAt = new Date().toISOString();
    this.db.save();

    return { success: true, message: 'رزرو با موفقیت لغو شد و وجه پرداختی به کیف پول برگشت.' };
  }

  getAllAdmin() {
    return this.db.reservations.map((r) => {
      const event = this.db.events.find((e) => e.id === r.eventId);
      const user = this.db.users.find((u) => u.id === r.userId);
      return {
        ...r,
        eventTitle: event?.title || 'رویداد حذف شده',
        userDisplayName: user?.displayName || 'کاربر',
        userPhone: user?.phone,
        userMembership: user?.membership,
      };
    });
  }

  toggleAttendance(id: string) {
    const reservation = this.db.reservations.find((r) => r.id === id);
    if (!reservation) {
      throw new NotFoundException('رزرو یافت نشد.');
    }

    reservation.attended = !reservation.attended;
    reservation.updatedAt = new Date().toISOString();
    this.db.save();
    return reservation;
  }
}
