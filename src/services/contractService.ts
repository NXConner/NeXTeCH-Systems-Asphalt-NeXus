import { apiService } from './apiService';

export async function fetchCustomerContracts() {
  return await apiService.getCustomerContracts();
} 