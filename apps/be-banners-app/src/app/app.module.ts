import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BannersModule } from './banners/banners.module';

@Module({
  imports: [BannersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
