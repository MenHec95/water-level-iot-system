import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsDateString,
    IsIn,
    IsInt,
    IsString,
    Max,
    Min,
} from 'class-validator';

export class CreateReadingDto {
    @ApiProperty({ example: 'reading' })
    @IsString()
    type: string = 'reading';

    @ApiProperty({ example: 75, minimum: 0, maximum: 100 })
    @IsInt()
    @Min(0)
    @Max(100)
    level: number = 0;

    @ApiProperty({ example: 0, enum: [0, 1] })
    @IsInt()
    @IsIn([0, 1])
    mode: number = 0;

    @ApiProperty({ example: false })
    @IsBoolean()
    alert: boolean = false;

    @ApiProperty({ example: false })
    @IsBoolean()
    calib: boolean = false;

    @ApiProperty({ example: 12400 })
    @IsInt()
    @Min(0)
    uptime: number = 0;

    @ApiProperty({ example: '2026-03-01T17:03:04.123456' })
    @IsDateString()
    server_timestamp: string = '';
}
