import { Controller, Get, Query } from '@nestjs/common';
import { FocusIndexService } from './focus-index.service';

@Controller('api/v1/focus-index')
export class FocusIndexController {
  constructor(private readonly focusService: FocusIndexService) {}

  @Get('ranking')
  getHonorRollRanking(
    @Query('companyId') companyId?: string,
    @Query('branchId') branchId?: string,
    @Query('groupId') groupId?: string,
  ) {
    const data = this.focusService.getHonorRollRanking(companyId, branchId, groupId);
    return {
      success: true,
      data,
    };
  }
}
