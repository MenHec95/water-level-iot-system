export enum SensorMode {
    AUTOMATIC = 0,
    MANUAL = 1,
}

export class Reading {
    readonly id: number;
    readonly level: number;
    readonly mode: SensorMode;
    readonly alert: boolean;
    readonly calib: boolean;
    readonly uptime: number;
    readonly savedAt: Date;
    readonly serverTimestamp: Date;

    constructor(params: {
        id: number;
        level: number;
        mode: SensorMode;
        alert: boolean;
        calib: boolean;
        uptime: number;
        savedAt: Date;
        serverTimestamp: Date;
    }) {
        this.id = params.id;
        this.level = params.level;
        this.mode = params.mode;
        this.alert = params.alert;
        this.calib = params.calib;
        this.uptime = params.uptime;
        this.savedAt = params.savedAt;
        this.serverTimestamp = params.serverTimestamp;
    }

    isCritical(): boolean {
        return this.alert || this.level <= 0 || this.level >= 100;
    }

    isCalibrating(): boolean {
        return this.calib;
    }

    getModeLabel(): string {
        return this.mode === SensorMode.AUTOMATIC ? 'automatic' : 'manual';
    }
}