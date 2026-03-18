import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventsGateway } from '../events/events.gateway';
import { Reading } from './domain/reading.entity';
import { CreateReadingDto, ReadingResponseDto } from './dto';
import {
    IReadingsRepository,
    READINGS_REPOSITORY,
} from './readings.repository.interface';

export interface PaginatedReadings {
    data: ReadingResponseDto[];
    total: number;
    page: number;
    limit: number;
}

@Injectable()
export class ReadingsService {
    private readonly logger = new Logger(ReadingsService.name);

    constructor(
        @Inject(READINGS_REPOSITORY)
        private readonly readingsRepository: IReadingsRepository,
        private readonly eventsGateway: EventsGateway,
    ) { }

    async create(dto: CreateReadingDto): Promise<ReadingResponseDto> {
        this.logger.debug(`Receiving reading — level: ${dto.level}%`);

        const reading = await this.readingsRepository.create(dto);
        const response = ReadingResponseDto.fromEntity(reading);

        this.eventsGateway.emitNewReading(response);

        if (reading.isCritical()) {
            this.logger.warn(`Critical reading detected — level: ${reading.level}%`);
            this.eventsGateway.emitAlert(response);
        }

        this.logger.log(`Reading saved — id: ${reading.id}, level: ${reading.level}%`);

        return response;
    }

    async findAll(page: number, limit: number): Promise<PaginatedReadings> {
        const skip = (page - 1) * limit;

        const [readings, total] = await Promise.all([
            this.readingsRepository.findAll({ skip, take: limit }),
            this.readingsRepository.count(),
        ]);

        return {
            data: readings.map((r: Reading) => ReadingResponseDto.fromEntity(r)),
            total,
            page,
            limit,
        };
    }

    async findLatest(): Promise<ReadingResponseDto | null> {
        const reading = await this.readingsRepository.findLatest();

        return reading ? ReadingResponseDto.fromEntity(reading) : null;
    }
}
