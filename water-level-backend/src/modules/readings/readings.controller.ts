import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Post,
    Query,
} from '@nestjs/common';
import {
    ApiBody,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
import { CreateReadingDto, ReadingResponseDto } from './dto';
import { PaginatedReadings, ReadingsService } from './readings.service';

@ApiTags('readings')
@Controller('readings')
export class ReadingsController {
    constructor(private readonly readingsService: ReadingsService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Receive a reading from the serial bridge' })
    @ApiBody({ type: CreateReadingDto })
    @ApiOkResponse({ type: ReadingResponseDto })
    async create(@Body() dto: CreateReadingDto): Promise<ReadingResponseDto> {
        return this.readingsService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get paginated readings history' })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 20 })
    @ApiOkResponse({ type: ReadingResponseDto, isArray: true })
    async findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 20,
    ): Promise<PaginatedReadings> {
        return this.readingsService.findAll(page, limit);
    }

    @Get('latest')
    @ApiOperation({ summary: 'Get the latest reading' })
    @ApiOkResponse({ type: ReadingResponseDto })
    @ApiNotFoundResponse({ description: 'No readings found' })
    async findLatest(): Promise<ReadingResponseDto> {
        const reading = await this.readingsService.findLatest();

        if (!reading) {
            throw new NotFoundException('No readings found');
        }

        return reading;
    }
}