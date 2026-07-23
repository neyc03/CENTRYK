import { Injectable } from '@nestjs/common';
import * as qrcode from 'qrcode';

export interface DeviceEnrollmentPayload {
  companyId: string;
  branchId: string;
  profileId: string;
  serverUrl: string;
}

@Injectable()
export class DevicesService {

  async generateDeviceOwnerEnrollmentQr(payload: DeviceEnrollmentPayload): Promise<{ jsonPayload: any; qrCodeDataUrl: string }> {
    const androidDpcPayload = {
      "android.app.extra.PROVISIONING_DEVICE_ADMIN_COMPONENT_NAME": "io.centryx.mdm/.CentryxDeviceAdminReceiver",
      "android.app.extra.PROVISIONING_DEVICE_ADMIN_PACKAGE_DOWNLOAD_LOCATION": "https://api.centryx.io/apk/centryx-mdm-latest.apk",
      "android.app.extra.PROVISIONING_DEVICE_ADMIN_PACKAGE_CHECKSUM": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "android.app.extra.PROVISIONING_LEAVE_ALL_SYSTEM_APPS_ENABLED": false,
      "android.app.extra.PROVISIONING_ADMIN_EXTRAS_BUNDLE": {
        "company_id": payload.companyId,
        "branch_id": payload.branchId,
        "profile_id": payload.profileId,
        "server_url": payload.serverUrl || "https://api.centryx.io",
      }
    };

    const jsonString = JSON.stringify(androidDpcPayload);
    const qrCodeDataUrl = await qrcode.toDataURL(jsonString);

    return {
      jsonPayload: androidDpcPayload,
      qrCodeDataUrl,
    };
  }
}
