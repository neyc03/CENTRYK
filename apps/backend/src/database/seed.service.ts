import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async seedInitialDatabase() {
    this.logger.log('Iniciando carga de datos iniciales (Seeding) en Supabase...');
    const supabase = this.supabaseService.getClient();

    // 1. Crear Empresa Principal
    const { data: company, error: compErr } = await supabase
      .from('companies')
      .upsert({ name: 'Invernandez Group SRL', tax_id: '1-30-99812-1', is_active: true }, { onConflict: 'name' })
      .select()
      .single();

    if (compErr) {
      this.logger.error('Error insertando empresa inicial:', compErr.message);
      return { success: false, error: compErr.message };
    }

    // 2. Crear Sucursales
    const { data: branch, error: branchErr } = await supabase
      .from('branches')
      .upsert({ company_id: company.id, name: 'Santo Domingo Central' })
      .select()
      .single();

    // 3. Crear Usuario Master de Pruebas
    const passwordHash = await bcrypt.hash('CentryxMaster2026!', 10);
    const { data: user, error: userErr } = await supabase
      .from('platform_users')
      .upsert({
        company_id: company.id,
        email: 'master@centryx.io',
        password_hash: passwordHash,
        full_name: 'Usuario Master Centryx',
        role: 'master',
      }, { onConflict: 'email' })
      .select()
      .single();

    this.logger.log('Seeding completado con éxito en Supabase.');

    return {
      success: true,
      message: 'Base de Datos Supabase inicializada y poblada con éxito',
      seeded: {
        companyId: company.id,
        masterEmail: 'master@centryx.io',
      },
    };
  }
}
