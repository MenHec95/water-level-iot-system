import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { ReadingsModule } from './modules/readings/readings.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
    ReadingsModule,
  ],
})
export class AppModule { }