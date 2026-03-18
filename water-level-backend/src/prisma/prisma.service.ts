import {
    Injectable,
    Logger,
    OnModuleDestroy,
    OnModuleInit,
} from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);

    constructor() {
        const adapter = new PrismaPg({
            connectionString: process.env['DATABASE_URL'],
        });
        super({ adapter });
    }

    async onModuleInit(): Promise<void> {
        this.logger.log('Connecting to database...');
        await this.$connect();
        this.logger.log('Database connected');
    }

    async onModuleDestroy(): Promise<void> {
        this.logger.log('Disconnecting from database...');
        await this.$disconnect();
        this.logger.log('Database disconnected');
    }
}