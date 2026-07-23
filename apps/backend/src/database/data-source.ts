import { DataSource } from 'typeorm';
import { Company } from '../entities/Company.entity';
import { Branch } from '../entities/Branch.entity';
import { StaffGroup } from '../entities/StaffGroup.entity';
import { Device } from '../entities/Device.entity';
import { PlatformUser } from '../entities/PlatformUser.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'centryx_admin',
  password: process.env.DB_PASSWORD || 'centryx_secure_password_2026',
  database: process.env.DB_NAME || 'centryx_db',
  synchronize: false, // En producción se usan las migraciones de TimescaleDB
  logging: process.env.NODE_ENV === 'development',
  entities: [Company, Branch, StaffGroup, Device, PlatformUser],
  migrations: [__dirname + '/migrations/*.ts'],
});
