import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('api/v1/reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@CurrentUser() user: any, @Body() body: { eventId: string; seats: number }) {
    return this.reservationsService.createReservation(user.id, body);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  getMy(@CurrentUser() user: any) {
    return this.reservationsService.getMyReservations(user.id);
  }

  @Post(':id/pay-sandbox')
  @UseGuards(JwtAuthGuard)
  paySandbox(@Param('id') id: string, @CurrentUser() user: any) {
    return this.reservationsService.payPendingWithSandbox(id, user.id);
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  cancel(@Param('id') id: string, @CurrentUser() user: any) {
    return this.reservationsService.cancelReservation(id, user.id);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, AdminGuard)
  getAllAdmin() {
    return this.reservationsService.getAllAdmin();
  }

  @Post(':id/attendance')
  @UseGuards(JwtAuthGuard, AdminGuard)
  toggleAttendance(@Param('id') id: string) {
    return this.reservationsService.toggleAttendance(id);
  }
}
