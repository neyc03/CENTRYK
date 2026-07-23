import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { AlertsService } from './alerts.service';

@Controller('api/v1/alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  getAlerts(@Query('severity') severity?: string) {
    return {
      success: true,
      data: this.alertsService.getAlerts(severity),
    };
  }

  @Post(':id/resolve')
  resolveAlert(@Param('id') id: string) {
    return {
      success: true,
      data: this.alertsService.resolveAlert(id),
    };
  }
}
