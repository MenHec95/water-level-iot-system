import { Logger } from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ReadingResponseDto } from '../readings/dto';

@WebSocketGateway({
    cors: {
        origin: (process.env['CORS_ORIGINS'] ?? 'http://localhost:5173')
            .split(',')
            .map((origin) => origin.trim()),
        credentials: true,
    },
})
export class EventsGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    private readonly server!: Server;

    private readonly logger = new Logger(EventsGateway.name);

    afterInit(): void {
        this.logger.log('WebSocket Gateway initialized');
    }

    handleConnection(client: Socket): void {
        this.logger.log(`Client connected — id: ${client.id}`);
    }

    handleDisconnect(client: Socket): void {
        this.logger.log(`Client disconnected — id: ${client.id}`);
    }

    emitNewReading(reading: ReadingResponseDto): void {
        this.server.emit('reading:new', reading);
    }

    emitAlert(reading: ReadingResponseDto): void {
        this.server.emit('reading:alert', reading);
    }

    emitSimulatorStatus(status: { running: boolean }): void {
        this.server.emit('simulator:status', status);
    }
}