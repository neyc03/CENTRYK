import { Injectable, NotFoundException } from '@nestjs/common';

export interface CompanyDto {
  id?: string;
  name: string;
  taxId?: string;
  isActive?: boolean;
}

export interface BranchDto {
  id?: string;
  companyId: string;
  name: string;
}

export interface StaffGroupDto {
  id?: string;
  branchId: string;
  name: string;
}

export interface ProfileDto {
  id?: string;
  staffGroupId: string;
  name: string;
  allowedApps: { packageName: string; appName: string; category: 'productive' | 'neutral' | 'unproductive' }[];
}

@Injectable()
export class OrganizationService {
  private companies: CompanyDto[] = [
    { id: 'comp-1', name: 'Invernandez Group SRL', taxId: '1-30-99812-1', isActive: true },
    { id: 'comp-2', name: 'Logística & Transporte Central', taxId: '1-31-44510-9', isActive: true },
  ];

  private branches: BranchDto[] = [
    { id: 'branch-1', companyId: 'comp-1', name: 'Santo Domingo Central' },
    { id: 'branch-2', companyId: 'comp-1', name: 'Santiago Norte' },
    { id: 'branch-3', companyId: 'comp-2', name: 'Puerto Plata Hub' },
  ];

  private staffGroups: StaffGroupDto[] = [
    { id: 'group-1', branchId: 'branch-1', name: 'Cajeros & Punto de Venta' },
    { id: 'group-2', branchId: 'branch-2', name: 'Despacho & Almacén' },
    { id: 'group-3', branchId: 'branch-3', name: 'Choferes & Entregas' },
  ];

  private profiles: ProfileDto[] = [
    {
      id: 'prof-1',
      staffGroupId: 'group-1',
      name: 'Perfil Cajero POS',
      allowedApps: [
        { packageName: 'com.pos.invernandez', appName: 'Punto de Venta POS', category: 'productive' },
        { packageName: 'com.android.calculator2', appName: 'Calculadora', category: 'neutral' }
      ]
    },
    {
      id: 'prof-2',
      staffGroupId: 'group-3',
      name: 'Perfil Conductor Waze/GPS',
      allowedApps: [
        { packageName: 'com.waze', appName: 'Waze Navigation', category: 'productive' },
        { packageName: 'com.centryx.delivery', appName: 'Centryx Delivery Track', category: 'productive' }
      ]
    }
  ];

  // Companies
  getCompanies() {
    return this.companies;
  }

  createCompany(dto: CompanyDto) {
    const newCompany = { id: `comp-${Date.now()}`, isActive: true, ...dto };
    this.companies.push(newCompany);
    return newCompany;
  }

  // Branches
  getBranches(companyId?: string) {
    if (companyId) {
      return this.branches.filter((b) => b.companyId === companyId);
    }
    return this.branches;
  }

  createBranch(dto: BranchDto) {
    const newBranch = { id: `branch-${Date.now()}`, ...dto };
    this.branches.push(newBranch);
    return newBranch;
  }

  // Staff Groups
  getStaffGroups(branchId?: string) {
    if (branchId) {
      return this.staffGroups.filter((g) => g.branchId === branchId);
    }
    return this.staffGroups;
  }

  createStaffGroup(dto: StaffGroupDto) {
    const newGroup = { id: `group-${Date.now()}`, ...dto };
    this.staffGroups.push(newGroup);
    return newGroup;
  }

  // Productivity Profiles
  getProfiles() {
    return this.profiles;
  }

  createProfile(dto: ProfileDto) {
    const newProfile = { id: `prof-${Date.now()}`, ...dto };
    this.profiles.push(newProfile);
    return newProfile;
  }
}
