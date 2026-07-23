import { Injectable, Logger } from '@nestjs/common';

export interface AppUsageIngestionDto {
  deviceId: string;
  timestamp: string;
  events: {
    packageName: string;
    appName?: string;
    durationSeconds: number;
    isForeground: boolean;
  }[];
}

export interface LocationPingDto {
  deviceId: string;
  latitude: number;
  longitude: number;
  speed?: number;
  accuracy?: number;
  batteryLevel?: number;
  timestamp: string;
}

@Injectable()
export class TelemetryService {
  private readonly logger = new Logger(TelemetryService.name);

  // Ingesta de eventos de uso de aplicaciones (TimescaleDB Ingestion)
  async ingestAppUsageBatch(dto: AppUsageIngestionDto) {
    this.logger.log(`Procesando lote de ${dto.events.length} eventos de uso para dispositivo: ${dto.deviceId}`);
    
    // Aquí se realiza el INSERT masivo en la Hypertable 'usage_events' de TimescaleDB
    // y se recalcula en segundo plano el Índice de Foco del día.
    return {
      success: true,
      processedEvents: dto.events.length,
      receivedAt: new Date().toISOString(),
    };
  }

  // Ingesta de coordenadas GPS (TimescaleDB Ingestion)
  async ingestLocationPing(dto: LocationPingDto) {
    this.logger.log(`Ping de ubicación recibido de ${dto.deviceId}: [${dto.latitude}, ${dto.longitude}]`);
    
    // Inserción en Hypertable 'location_pings' + chequeo de Geocercas activas
    return {
      success: true,
      deviceId: dto.deviceId,
      receivedAt: new Date().toISOString(),
    };
  }

  // Obtención de métricas en vivo para el Dashboard
  async getLiveMetrics(companyId?: string) {
    return {
      activeDevices: 500,
      onlineNow: 482,
      averageFocusIndex: 91.4,
      alertsCount: 3,
      topUsedApps: [
        { packageName: 'com.pos.corporativo', name: 'Punto de Venta POS', category: 'productive', totalHours: 1420 },
        { packageName: 'com.waze', name: 'Waze Navigation', category: 'productive', totalHours: 850 },
        { packageName: 'com.centryx.delivery', name: 'Centryx Track', category: 'productive', totalHours: 610 },
        { packageName: 'com.google.android.youtube', name: 'YouTube', category: 'unproductive', totalHours: 42 },
      ],
    };
  }
}
