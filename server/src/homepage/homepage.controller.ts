import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { HomepageService } from './homepage.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';

@Controller('api/v1/homepage')
export class HomepageController {
  constructor(private readonly homepageService: HomepageService) {}

  @Get()
  getHomepage() {
    return this.homepageService.getHomepageData();
  }

  @Post('reorder')
  @UseGuards(JwtAuthGuard, AdminGuard)
  reorder(@Body() body: { blocks: any[] }) {
    return this.homepageService.reorderBlocks(body.blocks);
  }

  @Post('reset')
  @UseGuards(JwtAuthGuard, AdminGuard)
  reset() {
    return this.homepageService.resetBlocks();
  }
}
