export const hasPermission = (permission: string, permissions: string[]): boolean => {
  return permissions.includes(permission);
};
