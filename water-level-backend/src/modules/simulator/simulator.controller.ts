import { Controller, Post, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiOkResponse,
    ApiSecurity,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiKeyGuard } from '../../common/guards';
import { SimulatorService } from './simulator.service';

@ApiTags('simulator')
@Controller('simulator')
export class SimulatorController {
    constructor(private readonly simulatorService: SimulatorService) { }

    @Post('start')
    @HttpCode(HttpStatus.OK)
    @UseGuards(ApiKeyGuard)
    @ApiSecurity('x-api-key')
    @ApiOperation({ summary: 'Start the data simulator' })
    @ApiOkResponse({ description: 'Simulator started' })
    @ApiUnauthorizedResponse({ description: 'Invalid API key' })
    start(): { running: boolean; message: string } {
        return this.simulatorService.start();
    }

    @Post('stop')
    @HttpCode(HttpStatus.OK)
    @UseGuards(ApiKeyGuard)
    @ApiSecurity('x-api-key')
    @ApiOperation({ summary: 'Stop the data simulator' })
    @ApiOkResponse({ description: 'Simulator stopped' })
    @ApiUnauthorizedResponse({ description: 'Invalid API key' })
    stop(): { running: boolean; message: string } {
        return this.simulatorService.stop();
    }

    @Get('status')
    @ApiOperation({ summary: 'Get simulator status' })
    @ApiOkResponse({ description: 'Simulator status' })
    status(): { running: boolean; currentLevel: number; uptime: number } {
        return this.simulatorService.getStatus();
    }
}