export interface CustomerContract {
  id: string;
  customerId: string;
  customerName: string;
  contractType: 'service' | 'maintenance' | 'project' | 'master';
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  value: number;
  status: 'draft' | 'pending' | 'signed' | 'active' | 'completed' | 'cancelled';
  signedDate?: string;
  documentUrl?: string;
  terms: string;
  createdAt: string;
  customerEmail?: string;
  signature?: string; // base64 data URL for digital signature
} 