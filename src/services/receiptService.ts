import { apiService } from './apiService';

export async function fetchReceipts() {
  return await apiService.getReceipts();
}

export async function updateReceipt(id, updates) {
  return await apiService.updateReceipt(id, updates);
} 