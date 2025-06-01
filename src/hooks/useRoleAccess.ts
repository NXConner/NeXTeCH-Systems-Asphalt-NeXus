
import { useAuth } from '@/contexts/AuthContext';
import { ROLE_PERMISSIONS, UserRole, RolePermissions } from '@/types/roles';

export const useRoleAccess = () => {
  const { user } = useAuth();
  
  const userRole = (user?.role as UserRole) || 'employee';
  const permissions: RolePermissions = ROLE_PERMISSIONS[userRole];

  const hasPermission = (permission: keyof RolePermissions): boolean => {
    return permissions[permission];
  };

  const canAccess = (requiredRole: UserRole | UserRole[]): boolean => {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    return roles.includes(userRole);
  };

  return {
    userRole,
    permissions,
    hasPermission,
    canAccess,
  };
};
