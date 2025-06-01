import { apiService } from './apiService';

export async function fetchMaintenanceItems() {
  return await apiService.getMaintenanceItems();
}

export async function updateMaintenanceItem(id, updates) {
  return await apiService.updateMaintenanceItem(id, updates);
} 