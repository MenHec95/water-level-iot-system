import { ApiProperty } from '@nestjs/swagger';
import { Reading, SensorMode } from '../domain/reading.entity';

export class ReadingResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 75 })
    level: number;

    @ApiProperty({ example: 0, enum: SensorMode })
    mode: SensorMode;

    @ApiProperty({ example: 'automatic' })
    modeLabel: string;

    @ApiProperty({ example: false })
    alert: boolean;

    @ApiProperty({ example: false })
    calib: boolean;

    @ApiProperty({ example: 12400 })
    uptime: number;

    @ApiProperty({ example: false })
    isCritical: boolean;

    @ApiProperty()
    savedAt: Date;

    @ApiProperty()
    serverTimestamp: Date;

    constructor(reading: Reading) {
        this.id = reading.id;
        this.level = reading.level;
        this.mode = reading.mode;
        this.modeLabel = reading.getModeLabel();
        this.alert = reading.alert;
        this.calib = reading.calib;
        this.uptime = reading.uptime;
        this.isCritical = reading.isCritical();
        this.savedAt = reading.savedAt;
        this.serverTimestamp = reading.serverTimestamp;
    }

    static fromEntity(reading: Reading): ReadingResponseDto {
        return new ReadingResponseDto(reading);
    }
}
