import { Controller, Post, Get, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { TelemetryService, AppUsageIngestionDto, LocationPingDto } from './telemetry.service';

@Controller('api/v1/telemetry')
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @Post('ingest-usage')
  @HttpCode(HttpStatus.OK)
  async ingestUsageBatch(@Body() dto: AppUsageIngestionDto) {
    return this.telemetryService.ingestAppUsageBatch(dto);
  }

  @Post('location-ping')
  @HttpCode(HttpStatus.OK)
  async ingestLocationPing(@Body() dto: LocationPingDto) {
    return this.telemetryService.ingestLocationPing(dto);
  }

  @Get('live-metrics')
  async getLiveMetrics(@Query('companyId') companyId?: string) {
    const data = await this.telemetryService.getLiveMetrics(companyId);
    return { success: true, data };
  }
}
