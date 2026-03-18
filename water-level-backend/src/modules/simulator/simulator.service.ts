import { Injectable, Logger } from '@nestjs/common';
import { ReadingsService } from '../readings/readings.service';
import { CreateReadingDto } from '../readings/dto';

interface SimulatorState {
    running: boolean;
    intervalRef: NodeJS.Timeout | null;
    currentLevel: number;
    currentMode: number;
    uptime: number;
    direction: 1 | -1;
}

@Injectable()
export class SimulatorService {
    private readonly logger = new Logger(SimulatorService.name);

    private readonly state: SimulatorState = {
        running: false,
        intervalRef: null,
        currentLevel: 50,
        currentMode: 0,
        uptime: 0,
        direction: 1,
    };

    constructor(private readonly readingsService: ReadingsService) { }

    start(): { running: boolean; message: string } {
        if (this.state.running) {
            return { running: true, message: 'Simulator already running' };
        }

        this.state.running = true;
        this.state.uptime = 0;

        this.state.intervalRef = setInterval(() => {
            void this.tick();
        }, 500);

        this.logger.log('Simulator started');
        return { running: true, message: 'Simulator started' };
    }

    stop(): { running: boolean; message: string } {
        if (!this.state.running) {
            return { running: false, message: 'Simulator is not running' };
        }

        if (this.state.intervalRef) {
            clearInterval(this.state.intervalRef);
            this.state.intervalRef = null;
        }

        this.state.running = false;
        this.logger.log('Simulator stopped');
        return { running: false, message: 'Simulator stopped' };
    }

    getStatus(): { running: boolean; currentLevel: number; uptime: number } {
        return {
            running: this.state.running,
            currentLevel: this.state.currentLevel,
            uptime: this.state.uptime,
        };
    }

    private async tick(): Promise<void> {
        this.state.uptime += 500;

        this.updateLevel();
        this.maybeToggleMode();

        const dto: CreateReadingDto = {
            type: 'reading',
            level: this.state.currentLevel,
            mode: this.state.currentMode,
            alert: this.state.currentLevel <= 15 || this.state.currentLevel >= 95,
            calib: false,
            uptime: this.state.uptime,
            server_timestamp: new Date().toISOString(),
        };

        try {
            await this.readingsService.create(dto);
        } catch (error) {
            this.logger.error('Simulator tick failed', error);
        }
    }

    private updateLevel(): void {
        // Cambia dirección en los extremos
        if (this.state.currentLevel >= 95) {
            this.state.direction = -1;
        } else if (this.state.currentLevel <= 5) {
            this.state.direction = 1;
        }

        // Incremento gradual con pequeña variación aleatoria
        const delta = this.state.direction * (Math.random() * 2 + 0.5);
        this.state.currentLevel = Math.min(
            100,
            Math.max(0, Math.round(this.state.currentLevel + delta)),
        );
    }

    private maybeToggleMode(): void {
        // Cambia de modo ocasionalmente (1% de probabilidad por tick)
        if (Math.random() < 0.01) {
            this.state.currentMode = this.state.currentMode === 0 ? 1 : 0;
            this.logger.debug(`Mode toggled to ${this.state.currentMode}`);
        }
    }
}