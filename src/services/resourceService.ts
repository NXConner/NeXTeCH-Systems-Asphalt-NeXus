import { apiService } from './apiService';

export async function fetchResources() {
  // Replace 'resources' with your actual table name
  return await apiService.getResources();
} 