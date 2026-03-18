import { Injectable } from '@nestjs/common';
import { Reading as PrismaReading } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { Reading, SensorMode } from './domain/reading.entity';
import { CreateReadingDto } from './dto';
import { IReadingsRepository } from './readings.repository.interface';

@Injectable()
export class ReadingsRepository implements IReadingsRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(dto: CreateReadingDto): Promise<Reading> {
        const record = await this.prisma.reading.create({
            data: {
                level: dto.level,
                mode: dto.mode,
                alert: dto.alert,
                calib: dto.calib,
                uptime: dto.uptime,
                serverTimestamp: new Date(dto.server_timestamp),
            },
        });

        return this.toDomain(record);
    }

    async findAll(params: { skip?: number; take?: number }): Promise<Reading[]> {
        const records = await this.prisma.reading.findMany({
            skip: params.skip ?? 0,
            take: params.take ?? 20,
            orderBy: { savedAt: 'desc' },
        });

        return records.map((record) => this.toDomain(record));
    }

    async findLatest(): Promise<Reading | null> {
        const record = await this.prisma.reading.findFirst({
            orderBy: { savedAt: 'desc' },
        });

        return record ? this.toDomain(record) : null;
    }

    async count(): Promise<number> {
        return this.prisma.reading.count();
    }

    private toDomain(record: PrismaReading): Reading {
        return new Reading({
            id: record.id,
            level: record.level,
            mode: record.mode as SensorMode,
            alert: record.alert,
            calib: record.calib,
            uptime: record.uptime,
            savedAt: record.savedAt,
            serverTimestamp: record.serverTimestamp,
        });
    }
}