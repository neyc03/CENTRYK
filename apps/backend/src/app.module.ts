import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { DevicesModule } from './modules/devices/devices.module';
import { TelemetryModule } from './modules/telemetry/telemetry.module';
import { RemoteControlModule } from './modules/remote-control/remote-control.module';
import { FocusIndexModule } from './modules/focus-index/focus-index.module';
import { AlertsModule } from './modules/alerts/alerts.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    OrganizationModule,
    DevicesModule,
    TelemetryModule,
    RemoteControlModule,
    FocusIndexModule,
    AlertsModule,
  ],
})
export class AppModule {}
