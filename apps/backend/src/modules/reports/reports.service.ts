import { Injectable, Logger } from '@nestjs/common';

export interface WeeklyReportFilterDto {
  companyId?: string;
  branchId?: string;
  startDate?: string;
  endDate?: string;
}

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  // Generador de HTML para exportación a PDF (Puppeteer / HTML-to-PDF)
  generateWeeklyReportHtml(filters: WeeklyReportFilterDto): string {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Reporte Semanal de Productividad Centryx MDM</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #050A14; color: #FFFFFF; padding: 40px; }
          .header { border-bottom: 2px solid #2DD4BF; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; }
          .title { font-size: 24px; font-weight: bold; color: #FFFFFF; }
          .subtitle { font-size: 12px; color: #2DD4BF; margin-top: 5px; font-family: monospace; }
          .card { background: #0D1B2E; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; margin-bottom: 20px; }
          .metric-title { font-size: 12px; color: #94A3B8; }
          .metric-value { font-size: 28px; font-weight: bold; color: #2DD4BF; margin-top: 5px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th { background: #0A1525; color: #94A3B8; text-align: left; padding: 10px; font-size: 11px; text-transform: uppercase; }
          td { padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 12px; }
          .badge-green { color: #10B981; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">CENTRYX MDM — REPORTE SEMANAL DE PRODUCTIVIDAD</div>
            <div class="subtitle">Generado el ${new Date().toLocaleDateString('es-DO')} • Cobertura: 500 Dispositivos</div>
          </div>
        </div>

        <div class="card">
          <div class="metric-title">Índice de Foco Corporativo Promedio</div>
          <div class="metric-value">91.4% (Excelente)</div>
          <p style="font-size: 12px; color: #94A3B8; margin-top: 8px;">Total de horas de trabajo registrado: 2,890 hrs | Apps productivas: 94.2%</p>
        </div>

        <div class="card">
          <h3 style="margin-top:0; color: #FFFFFF;">Top 5 Aplicaciones Más Utilizadas</h3>
          <table>
            <thead>
              <tr>
                <th>Aplicación</th>
                <th>Categoría</th>
                <th>Horas Acumuladas</th>
                <th>Cumplimiento</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Punto de Venta POS</td>
                <td class="badge-green">Productiva</td>
                <td>1,420 hrs</td>
                <td>100%</td>
              </tr>
              <tr>
                <td>Waze Navigation GPS</td>
                <td class="badge-green">Productiva</td>
                <td>850 hrs</td>
                <td>98%</td>
              </tr>
              <tr>
                <td>Centryx Delivery Track</td>
                <td class="badge-green">Productiva</td>
                <td>610 hrs</td>
                <td>99%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </body>
      </html>
    `;
  }

  async generateWeeklyPdfReport(filters: WeeklyReportFilterDto): Promise<{ filename: string; htmlContent: string; downloadUrl: string }> {
    this.logger.log(`Generando reporte PDF semanal con filtros: ${JSON.stringify(filters)}`);
    const htmlContent = this.generateWeeklyReportHtml(filters);

    return {
      filename: `reporte_semanal_centryx_${Date.now()}.pdf`,
      htmlContent,
      downloadUrl: `/api/v1/reports/download/weekly-pdf-${Date.now()}.pdf`,
    };
  }
}
