import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { EventsModule } from './modules/events/events.module';
import { ReadingsModule } from './modules/readings/readings.module';
import { SimulatorModule } from './modules/simulator/simulator.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
    ReadingsModule,
    EventsModule,
    SimulatorModule,
  ],
})
export class AppModule { }