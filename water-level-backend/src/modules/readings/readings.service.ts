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
    private lastSavedAt: Date | null = null;

    private get saveIntervalMs(): number {
        const seconds = parseInt(process.env['SAVE_INTERVAL_SECONDS'] ?? '30', 10);
        return seconds * 1000;
    }

    constructor(
        @Inject(READINGS_REPOSITORY)
        private readonly readingsRepository: IReadingsRepository,
        private readonly eventsGateway: EventsGateway,
    ) { }

    async create(dto: CreateReadingDto): Promise<ReadingResponseDto> {
        this.logger.debug(`Receiving reading — level: ${dto.level}%`);

        const shouldSave = this.shouldPersist(dto);

        let reading: Reading | null = null;

        if (shouldSave) {
            reading = await this.readingsRepository.create(dto);
            this.lastSavedAt = new Date();
            this.logger.log(`Reading saved — id: ${reading.id}, level: ${reading.level}%`);
        }

        const response = reading
            ? ReadingResponseDto.fromEntity(reading)
            : this.toTransientResponse(dto);

        this.eventsGateway.emitNewReading(response);

        if (dto.alert || dto.level <= 0 || dto.level >= 100) {
            this.logger.warn(`Critical reading detected — level: ${dto.level}%`);
            this.eventsGateway.emitAlert(response);
        }

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

    private shouldPersist(dto: CreateReadingDto): boolean {
        // Siempre guarda eventos críticos
        if (dto.alert || dto.calib || dto.level <= 0 || dto.level >= 100) {
            return true;
        }

        // Guarda por intervalo
        if (!this.lastSavedAt) {
            return true;
        }

        const elapsed = Date.now() - this.lastSavedAt.getTime();
        return elapsed >= this.saveIntervalMs;
    }

    private toTransientResponse(dto: CreateReadingDto): ReadingResponseDto {
        return {
            id: 0,
            level: dto.level,
            mode: dto.mode,
            modeLabel: dto.mode === 0 ? 'automatic' : 'manual',
            alert: dto.alert,
            calib: dto.calib,
            uptime: dto.uptime,
            isCritical: dto.alert || dto.level <= 0 || dto.level >= 100,
            savedAt: new Date(),
            serverTimestamp: new Date(dto.server_timestamp),
        };
    }
}