import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
    statusCode: number;
    message: string | string[];
    error: string;
    path: string;
    timestamp: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: HttpException, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        const message =
            typeof exceptionResponse === 'object' &&
                'message' in exceptionResponse
                ? (exceptionResponse as Record<string, unknown>)['message'] as string | string[]
                : exception.message;

        const errorBody: ErrorResponse = {
            statusCode: status,
            message,
            error: exception.name,
            path: request.url,
            timestamp: new Date().toISOString(),
        };

        this.logger.error(
            `${request.method} ${request.url} — ${status}`,
            JSON.stringify(errorBody),
        );

        response.status(status).json(errorBody);
    }
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const message =
            exception instanceof Error ? exception.message : 'Internal server error';

        this.logger.error(
            `Unhandled exception — ${request.method} ${request.url}`,
            exception instanceof Error ? exception.stack : String(exception),
        );

        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message,
            error: 'InternalServerError',
            path: request.url,
            timestamp: new Date().toISOString(),
        });
    }
}