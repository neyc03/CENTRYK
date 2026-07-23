import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('devices')
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  companyId: string;

  @Column({ type: 'uuid', nullable: true })
  branchId: string;

  @Column({ type: 'uuid', nullable: true })
  profileId: string;

  @Column({ type: 'varchar', length: 100 })
  deviceName: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  imei: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  serialNumber: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  model: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  androidVersion: string;

  @Column({ type: 'int', default: 100 })
  batteryLevel: number;

  @Column({ type: 'boolean', default: false })
  isLocked: boolean;

  @Column({ type: 'boolean', default: false })
  isOnline: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastPingAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
