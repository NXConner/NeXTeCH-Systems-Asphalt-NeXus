
export type UserRole = 'admin' | 'manager' | 'operator' | 'employee' | 'accountant' | 'hr';

export interface RolePermissions {
  canViewFinancials: boolean;
  canEditEmployees: boolean;
  canManageFleet: boolean;
  canViewReports: boolean;
  canManageContracts: boolean;
  canViewPayroll: boolean;
  canManageSettings: boolean;
  canViewAllProjects: boolean;
  canCreateEstimates: boolean;
  canApproveInvoices: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  admin: {
    canViewFinancials: true,
    canEditEmployees: true,
    canManageFleet: true,
    canViewReports: true,
    canManageContracts: true,
    canViewPayroll: true,
    canManageSettings: true,
    canViewAllProjects: true,
    canCreateEstimates: true,
    canApproveInvoices: true,
  },
  manager: {
    canViewFinancials: true,
    canEditEmployees: true,
    canManageFleet: true,
    canViewReports: true,
    canManageContracts: true,
    canViewPayroll: false,
    canManageSettings: false,
    canViewAllProjects: true,
    canCreateEstimates: true,
    canApproveInvoices: true,
  },
  operator: {
    canViewFinancials: false,
    canEditEmployees: false,
    canManageFleet: false,
    canViewReports: false,
    canManageContracts: false,
    canViewPayroll: false,
    canManageSettings: false,
    canViewAllProjects: false,
    canCreateEstimates: true,
    canApproveInvoices: false,
  },
  employee: {
    canViewFinancials: false,
    canEditEmployees: false,
    canManageFleet: false,
    canViewReports: false,
    canManageContracts: false,
    canViewPayroll: false,
    canManageSettings: false,
    canViewAllProjects: false,
    canCreateEstimates: false,
    canApproveInvoices: false,
  },
  accountant: {
    canViewFinancials: true,
    canEditEmployees: false,
    canManageFleet: false,
    canViewReports: true,
    canManageContracts: false,
    canViewPayroll: true,
    canManageSettings: false,
    canViewAllProjects: false,
    canCreateEstimates: false,
    canApproveInvoices: true,
  },
  hr: {
    canViewFinancials: false,
    canEditEmployees: true,
    canManageFleet: false,
    canViewReports: true,
    canManageContracts: true,
    canViewPayroll: true,
    canManageSettings: false,
    canViewAllProjects: false,
    canCreateEstimates: false,
    canApproveInvoices: false,
  },
};
