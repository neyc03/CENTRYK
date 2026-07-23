import { Injectable } from '@nestjs/common';

export interface DeviceFocusScoreDto {
  deviceId: string;
  deviceName: string;
  companyName: string;
  branchName: string;
  groupName: string;
  score: number; // 0 a 100
  productiveMinutes: number;
  unproductiveMinutes: number;
  neutralMinutes: number;
  badge: 'gold' | 'silver' | 'bronze' | 'needs_improvement';
}

@Injectable()
export class FocusIndexService {
  
  // Algoritmo de Cálculo del Índice de Foco Diario
  calculateFocusScore(productiveMinutes: number, neutralMinutes: number, unproductiveMinutes: number): number {
    const totalMinutes = productiveMinutes + neutralMinutes + unproductiveMinutes;
    if (totalMinutes === 0) return 100;

    // Fórmula Ponderada de Foco: (Productivas * 1.0 + Neutrales * 0.5 - Improductivas * 1.5) / Total
    const weightedScore = (productiveMinutes * 1.0 + neutralMinutes * 0.5 - unproductiveMinutes * 1.5) / totalMinutes;
    const finalScore = Math.min(100, Math.max(0, Math.round(weightedScore * 100)));
    return finalScore;
  }

  // Ranking "Listado de Honor" (Filtrable por empresa, sucursal o grupo)
  getHonorRollRanking(companyId?: string, branchId?: string, groupId?: string): DeviceFocusScoreDto[] {
    const mockRanking: DeviceFocusScoreDto[] = [
      {
        deviceId: 'dev-1',
        deviceName: 'Galaxy Tab A9 (Caja 02)',
        companyName: 'Invernandez Group SRL',
        branchName: 'Santo Domingo Central',
        groupName: 'Cajeros & Punto de Venta',
        score: 99,
        productiveMinutes: 420,
        neutralMinutes: 15,
        unproductiveMinutes: 0,
        badge: 'gold',
      },
      {
        deviceId: 'dev-2',
        deviceName: 'Galaxy Tab A9 (Caja 01)',
        companyName: 'Invernandez Group SRL',
        branchName: 'Santo Domingo Central',
        groupName: 'Cajeros & Punto de Venta',
        score: 98,
        productiveMinutes: 410,
        neutralMinutes: 20,
        unproductiveMinutes: 2,
        badge: 'gold',
      },
      {
        deviceId: 'dev-3',
        deviceName: 'Galaxy A15 (Logística #04)',
        companyName: 'Logística & Transporte Central',
        branchName: 'Santiago Norte',
        groupName: 'Choferes & Rutas',
        score: 94,
        productiveMinutes: 380,
        neutralMinutes: 45,
        unproductiveMinutes: 5,
        badge: 'silver',
      },
      {
        deviceId: 'dev-4',
        deviceName: 'Nokia G42 (Supervisión)',
        companyName: 'Invernandez Group SRL',
        branchName: 'La Vega Central',
        groupName: 'Supervisores de Campo',
        score: 62,
        productiveMinutes: 210,
        neutralMinutes: 60,
        unproductiveMinutes: 90,
        badge: 'needs_improvement',
      },
    ];

    return mockRanking.sort((a, b) => b.score - a.score);
  }
}
