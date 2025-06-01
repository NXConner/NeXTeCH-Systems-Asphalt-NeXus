import { apiService } from './apiService';

export async function fetchTimeEntries() {
  return await apiService.getTimeEntries();
}

export async function fetchTimeSummary() {
  return await apiService.getTimeSummary();
} 