import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig, databaseConfig, iotConfig } from './index';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig, databaseConfig, iotConfig],
            envFilePath: '.env',
        }),
    ],
    exports: [ConfigModule],
})
export class AppConfigModule { }