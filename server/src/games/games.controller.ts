import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { GamesService } from './games.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';

@Controller('api/v1/games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get('categories')
  getCategories() {
    return this.gamesService.getCategories();
  }

  @Get('scenarios')
  getScenarios() {
    return this.gamesService.getScenarios();
  }

  @Get('scenarios/:slug')
  getScenarioBySlug(@Param('slug') slug: string) {
    return this.gamesService.getScenarioBySlug(slug);
  }

  @Get('roles')
  getRoles(@Query('scenarioId') scenarioId?: string) {
    return this.gamesService.getRoles(scenarioId);
  }

  @Get('electronic')
  getElectronicGames() {
    return this.gamesService.getElectronicGames();
  }

  @Post('admin/scenarios')
  @UseGuards(JwtAuthGuard, AdminGuard)
  createScenario(@Body() data: any) {
    return this.gamesService.createScenario(data);
  }

  @Post('admin/roles')
  @UseGuards(JwtAuthGuard, AdminGuard)
  createRole(@Body() data: any) {
    return this.gamesService.createRole(data);
  }

  @Post('admin/electronic')
  @UseGuards(JwtAuthGuard, AdminGuard)
  createElectronic(@Body() data: any) {
    return this.gamesService.createElectronicGame(data);
  }
}
