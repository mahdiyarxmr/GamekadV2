import { Controller, Get, Post, Body, Param, Put, UseGuards } from '@nestjs/common';
import { GodGameService } from './god-game.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GodGameGuard } from '../common/guards/god-game.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('api/v1/god-game')
export class GodGameController {
  constructor(private readonly godGameService: GodGameService) {}

  @Get('sessions')
  @UseGuards(JwtAuthGuard, GodGameGuard)
  getSessions(@CurrentUser() user: any) {
    return this.godGameService.getSessions(user);
  }

  @Get('sessions/:id')
  @UseGuards(JwtAuthGuard, GodGameGuard)
  getSessionById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.godGameService.getSessionById(id, user);
  }

  @Post('sessions')
  @UseGuards(JwtAuthGuard, GodGameGuard)
  createSession(@CurrentUser() user: any, @Body() body: any) {
    return this.godGameService.createSession(user, body);
  }

  @Post('sessions/:id/distribute-roles')
  @UseGuards(JwtAuthGuard, GodGameGuard)
  distributeRoles(@Param('id') id: string, @CurrentUser() user: any) {
    return this.godGameService.distributeRoles(id, user);
  }

  @Post('sessions/:id/phase')
  @UseGuards(JwtAuthGuard, GodGameGuard)
  updatePhase(@Param('id') id: string, @CurrentUser() user: any, @Body() body: any) {
    return this.godGameService.updatePhase(id, user, body);
  }

  @Put('sessions/:id/seats/:seatNumber')
  @UseGuards(JwtAuthGuard, GodGameGuard)
  updateSeat(
    @Param('id') id: string,
    @Param('seatNumber') seatNumber: string,
    @Body() body: any,
  ) {
    return this.godGameService.updateSeat(id, Number(seatNumber), body);
  }

  @Post('sessions/:id/log')
  @UseGuards(JwtAuthGuard, GodGameGuard)
  addLog(@Param('id') id: string, @Body('text') text: string) {
    return this.godGameService.addLog(id, text);
  }

  @Post('sessions/:id/import-stats')
  @UseGuards(JwtAuthGuard, GodGameGuard)
  importStats(@Param('id') id: string, @CurrentUser() user: any, @Body() body: any) {
    return this.godGameService.importStats(id, user, body);
  }
}
