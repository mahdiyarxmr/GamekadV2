import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class EventsService {
  constructor(private readonly db: DatabaseService) {}

  findAll(query?: { status?: string; gender?: string; categoryId?: string }) {
    let list = [...this.db.events];

    if (query?.status) {
      list = list.filter((e) => e.status === query.status);
    }
    if (query?.gender) {
      list = list.filter((e) => e.targetGender === query.gender || e.targetGender === 'mixed');
    }
    if (query?.categoryId) {
      list = list.filter((e) => e.categoryId === query.categoryId);
    }

    return list.map((e) => {
      const category = this.db.categories.find((c) => c.id === e.categoryId);
      const host = this.db.users.find((u) => u.id === e.hostId);
      const hostSafe = host ? { id: host.id, displayName: host.displayName, avatar: host.avatar } : null;
      const remainingSeats = Math.max(0, e.capacity - e.reservedCount);

      return {
        ...e,
        category,
        host: hostSafe,
        remainingSeats,
      };
    });
  }

  findOne(id: string) {
    const event = this.db.events.find((e) => e.id === id);
    if (!event) {
      throw new NotFoundException('میز بازی یا رویداد مورد نظر یافت نشد.');
    }

    const category = this.db.categories.find((c) => c.id === event.categoryId);
    const host = this.db.users.find((u) => u.id === event.hostId);
    const hostSafe = host ? { id: host.id, displayName: host.displayName, avatar: host.avatar } : null;
    const remainingSeats = Math.max(0, event.capacity - event.reservedCount);

    const reservations = this.db.reservations
      .filter((r) => r.eventId === id && ['paid', 'partially_paid', 'venue_due'].includes(r.paymentStatus))
      .map((r) => {
        const u = this.db.users.find((user) => user.id === r.userId);
        return {
          id: r.id,
          seats: r.seats,
          userDisplayName: u?.displayName || 'بازیکن',
          avatar: u?.avatar,
          membership: u?.membership,
          attended: r.attended,
        };
      });

    return {
      ...event,
      category,
      host: hostSafe,
      remainingSeats,
      reservations,
    };
  }

  create(data: any, adminUser: any) {
    const newEvent = {
      id: `evt-${Date.now()}`,
      title: data.title,
      description: data.description,
      coverImage: data.coverImage || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
      categoryId: data.categoryId,
      hostId: data.hostId || adminUser.id,
      targetGender: data.targetGender || 'mixed',
      payType: data.payType || 'full',
      price: Number(data.price) || 0,
      depositAmount: Number(data.depositAmount) || 0,
      venueAddress: data.venueAddress || 'مشهد، بلوار شهید فرامرز عباسی، رسالت ۳۲، بین ۴۵ و ۴۷، پلاک ۲۳',
      startTime: data.startTime || new Date(Date.now() + 86400000).toISOString(),
      endTime: data.endTime || new Date(Date.now() + 86400000 + 10800000).toISOString(),
      capacity: Number(data.capacity) || 12,
      reservedCount: 0,
      status: data.status || 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.db.events.unshift(newEvent);
    this.db.save();
    return newEvent;
  }

  update(id: string, data: any) {
    const event = this.db.events.find((e) => e.id === id);
    if (!event) {
      throw new NotFoundException('رویداد یافت نشد.');
    }

    Object.assign(event, data, { updatedAt: new Date().toISOString() });
    this.db.save();
    return event;
  }

  delete(id: string) {
    const index = this.db.events.findIndex((e) => e.id === id);
    if (index === -1) {
      throw new NotFoundException('رویداد یافت نشد.');
    }

    this.db.events.splice(index, 1);
    this.db.save();
    return { success: true };
  }
}
