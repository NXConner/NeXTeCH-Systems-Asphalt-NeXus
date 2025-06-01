import { apiService } from './apiService';

export async function fetchAccounts() {
  return await apiService.getAccounts();
}

export async function fetchCustomers() {
  return await apiService.getCustomers();
}

export async function fetchVendors() {
  return await apiService.getVendors();
}

export async function fetchTransactions() {
  return await apiService.getTransactions();
} 