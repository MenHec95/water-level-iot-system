import {
    CanActivate,
    ExecutionContext,
    Injectable,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    private readonly logger = new Logger(ApiKeyGuard.name);

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const apiKey = request.headers['x-api-key'];
        const validKey = process.env['SIMULATOR_API_KEY'];

        if (!validKey) {
            this.logger.error('SIMULATOR_API_KEY is not set');
            throw new UnauthorizedException('API key not configured');
        }

        if (!apiKey || apiKey !== validKey) {
            this.logger.warn(`Invalid API key attempt from ${request.ip}`);
            throw new UnauthorizedException('Invalid API key');
        }

        return true;
    }
}