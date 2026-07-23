import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { OrganizationService, CompanyDto, BranchDto, StaffGroupDto, ProfileDto } from './organization.service';

@Controller('api/v1/organization')
export class OrganizationController {
  constructor(private readonly orgService: OrganizationService) {}

  // Companies
  @Get('companies')
  getCompanies() {
    return { success: true, data: this.orgService.getCompanies() };
  }

  @Post('companies')
  createCompany(@Body() dto: CompanyDto) {
    return { success: true, data: this.orgService.createCompany(dto) };
  }

  // Branches
  @Get('branches')
  getBranches(@Query('companyId') companyId?: string) {
    return { success: true, data: this.orgService.getBranches(companyId) };
  }

  @Post('branches')
  createBranch(@Body() dto: BranchDto) {
    return { success: true, data: this.orgService.createBranch(dto) };
  }

  // Staff Groups
  @Get('staff-groups')
  getStaffGroups(@Query('branchId') branchId?: string) {
    return { success: true, data: this.orgService.getStaffGroups(branchId) };
  }

  @Post('staff-groups')
  createStaffGroup(@Body() dto: StaffGroupDto) {
    return { success: true, data: this.orgService.createStaffGroup(dto) };
  }

  // Profiles
  @Get('profiles')
  getProfiles() {
    return { success: true, data: this.orgService.getProfiles() };
  }

  @Post('profiles')
  createProfile(@Body() dto: ProfileDto) {
    return { success: true, data: this.orgService.createProfile(dto) };
  }
}
