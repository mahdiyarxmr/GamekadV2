import { Controller, Get, Param, Query } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';

@Controller('api/v1')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get('leaderboard')
  getLeaderboard(
    @Query('categorySlug') categorySlug?: string,
    @Query('gender') gender?: string,
  ) {
    return this.leaderboardService.getLeaderboard(categorySlug, gender);
  }

  @Get('players')
  getPlayers(
    @Query('search') search?: string,
    @Query('membership') membership?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.leaderboardService.getPlayers({
      search,
      membership,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    });
  }

  @Get('players/:username')
  getPlayerProfile(@Param('username') username: string) {
    return this.leaderboardService.getPlayerProfile(username);
  }
}
