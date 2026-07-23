import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum UserRole {
  MASTER = 'master',
  COMPANY_ADMIN = 'company_admin',
  BRANCH_SUPERVISOR = 'branch_supervisor',
  READ_ONLY = 'read_only',
}

@Entity('platform_users')
export class PlatformUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  companyId: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 150 })
  username: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ type: 'varchar', length: 150 })
  fullName: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.COMPANY_ADMIN })
  role: UserRole;

  @Column({ type: 'boolean', default: false })
  isTwoFactorEnabled: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  twoFactorSecret: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
