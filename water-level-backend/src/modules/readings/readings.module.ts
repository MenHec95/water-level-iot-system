import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { ReadingsController } from './readings.controller';
import { ReadingsRepository } from './readings.repository';
import { READINGS_REPOSITORY } from './readings.repository.interface';
import { ReadingsService } from './readings.service';

@Module({
    imports: [PrismaModule, EventsModule],
    controllers: [ReadingsController],
    providers: [
        ReadingsService,
        {
            provide: READINGS_REPOSITORY,
            useClass: ReadingsRepository,
        },
    ],
    exports: [ReadingsService],
})
export class ReadingsModule { }