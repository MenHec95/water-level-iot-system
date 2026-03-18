import { Reading } from './domain/reading.entity';
import { CreateReadingDto } from './dto';

export interface IReadingsRepository {
    create(dto: CreateReadingDto): Promise<Reading>;
    findAll(params: { skip?: number; take?: number }): Promise<Reading[]>;
    findLatest(): Promise<Reading | null>;
    count(): Promise<number>;
}

export const READINGS_REPOSITORY = Symbol('READINGS_REPOSITORY');