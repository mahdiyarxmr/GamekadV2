import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { ReservationsModule } from './reservations/reservations.module';
import { WalletModule } from './wallet/wallet.module';
import { GamesModule } from './games/games.module';
import { GodGameModule } from './god-game/god-game.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { ArticlesModule } from './articles/articles.module';
import { HomepageModule } from './homepage/homepage.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    EventsModule,
    ReservationsModule,
    WalletModule,
    GamesModule,
    GodGameModule,
    LeaderboardModule,
    ArticlesModule,
    HomepageModule,
    AdminModule,
  ],
})
export class AppModule {}
