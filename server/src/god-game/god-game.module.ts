import { Module } from '@nestjs/common';
import { GodGameService } from './god-game.service';
import { GodGameController } from './god-game.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [GodGameController],
  providers: [GodGameService],
  exports: [GodGameService],
})
export class GodGameModule {}
