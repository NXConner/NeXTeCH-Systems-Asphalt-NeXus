import React from 'react';
import { usePermissions } from '@/contexts/PermissionsContext';

const RequirePermission: React.FC<{ permission: string; fallback?: React.ReactNode; children: React.ReactNode }> = ({ permission, fallback = null, children }) => {
  const { hasPermission } = usePermissions();
  return hasPermission(permission) ? <>{children}</> : <>{fallback || <div>Access Denied</div>}</>;
};

export default RequirePermission;
