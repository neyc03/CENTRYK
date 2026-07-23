import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { ReportsService, WeeklyReportFilterDto } from './reports.service';

@Controller('api/v1/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('weekly-pdf')
  async generateWeeklyPdf(@Body() filters: WeeklyReportFilterDto) {
    const data = await this.reportsService.generateWeeklyPdfReport(filters);
    return {
      success: true,
      data,
    };
  }
}
