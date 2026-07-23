import { Injectable } from '@nestjs/common';

export interface AlertDto {
  id: string;
  deviceId: string;
  deviceName: string;
  companyName: string;
  branchName: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: 'unauthorized_app' | 'geofence_violation' | 'off_hours_activity' | 'low_focus_score';
  title: string;
  description: string;
  timestamp: string;
  isResolved: boolean;
}

@Injectable()
export class AlertsService {
  private alerts: AlertDto[] = [
    {
      id: 'alt-1',
      deviceId: 'dev-3',
      deviceName: 'Nokia G42 (Supervisión)',
      companyName: 'Invernandez Group SRL',
      branchName: 'La Vega Central',
      severity: 'high',
      type: 'unauthorized_app',
      title: 'Uso de Aplicación No Permitida',
      description: 'Se detectó la app "YouTube" en primer plano durante 45 minutos continuos.',
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
      isResolved: false,
    },
    {
      id: 'alt-2',
      deviceId: 'dev-5',
      deviceName: 'Galaxy A05 (Entregas #12)',
      companyName: 'Logística & Transporte Central',
      branchName: 'Puerto Plata Hub',
      severity: 'critical',
      type: 'geofence_violation',
      title: 'Salida de Geocerca Autorizada',
      description: 'El dispositivo salió del perímetro de la sucursal Puerto Plata sin orden de despacho.',
      timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
      isResolved: false,
    },
    {
      id: 'alt-3',
      deviceId: 'dev-4',
      deviceName: 'Galaxy Tab A9 (Caja 03)',
      companyName: 'Invernandez Group SRL',
      branchName: 'Santo Domingo Central',
      severity: 'medium',
      type: 'off_hours_activity',
      title: 'Actividad Fuera de Horario Laboral',
      description: 'Dispositivo encendido a las 11:45 PM.',
      timestamp: new Date(Date.now() - 360 * 60000).toISOString(),
      isResolved: true,
    },
  ];

  getAlerts(severity?: string) {
    if (severity) {
      return this.alerts.filter((a) => a.severity === severity);
    }
    return this.alerts;
  }

  resolveAlert(alertId: string) {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (alert) {
      alert.isResolved = true;
    }
    return alert;
  }
}
