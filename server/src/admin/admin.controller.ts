import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('api/v1/admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  getUsers(@Query('search') search?: string) {
    return this.adminService.getUsers({ search });
  }

  @Post('users')
  createUser(@CurrentUser() admin: any, @Body() body: any) {
    return this.adminService.createUser(admin, body);
  }

  @Put('users/:id')
  updateUser(@CurrentUser() admin: any, @Param('id') id: string, @Body() body: any) {
    return this.adminService.updateUser(admin, id, body);
  }

  @Get('medals')
  getMedals() {
    return this.adminService.getMedals();
  }

  @Post('medals/award')
  awardMedal(@CurrentUser() admin: any, @Body() body: any) {
    return this.adminService.awardMedal(admin, body);
  }

  @Get('mvp')
  getMvp() {
    return this.adminService.getMvpList();
  }

  @Post('mvp')
  createMvp(@CurrentUser() admin: any, @Body() body: any) {
    return this.adminService.createMvpAward(admin, body);
  }

  @Get('settings')
  getSettings() {
    return this.adminService.getSettings();
  }

  @Put('settings')
  updateSettings(@Body() body: Record<string, string>) {
    return this.adminService.updateSettings(body);
  }

  @Get('audit-logs')
  getAuditLogs() {
    return this.adminService.getAuditLogs();
  }
}
