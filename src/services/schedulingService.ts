import { apiService } from './apiService';

export async function fetchScheduleItems() {
  return await apiService.getScheduleItems();
}

export async function updateScheduleItem(id, updates) {
  return await apiService.updateScheduleItem(id, updates);
} 