import { Controller, Post, Body } from '@nestjs/common';
import { DevicesService, DeviceEnrollmentPayload } from './devices.service';

@Controller('api/v1/devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post('enrollment-qr')
  async generateEnrollmentQr(@Body() payload: DeviceEnrollmentPayload) {
    const result = await this.devicesService.generateDeviceOwnerEnrollmentQr(payload);
    return {
      success: true,
      data: result,
    };
  }
}
