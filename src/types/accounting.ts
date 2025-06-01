
export interface Account {
  id: string;
  accountNumber: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  subType: string;
  balance: number;
  description?: string;
  parentAccount?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  transactionNumber: string;
  date: string;
  type: 'journal' | 'payment' | 'receipt' | 'transfer';
  reference?: string;
  description: string;
  entries: JournalEntry[];
  attachments: string[];
  status: 'draft' | 'posted' | 'reconciled';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface JournalEntry {
  id: string;
  accountId: string;
  debit: number;
  credit: number;
  description?: string;
}

export interface Customer {
  id: string;
  customerNumber: string;
  type: 'individual' | 'business';
  name: string;
  email?: string;
  phone?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billing: {
    terms: string;
    creditLimit: number;
    taxExempt: boolean;
    taxId?: string;
  };
  contact: {
    primaryContact: string;
    title?: string;
    email?: string;
    phone?: string;
  };
  balance: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Vendor {
  id: string;
  vendorNumber: string;
  name: string;
  email?: string;
  phone?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  payment: {
    terms: string;
    method: 'check' | 'ach' | 'wire' | 'credit-card';
    taxId?: string;
  };
  contact: {
    primaryContact: string;
    title?: string;
    email?: string;
    phone?: string;
  };
  balance: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorId: string;
  date: string;
  expectedDate?: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'approved' | 'received' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Bill {
  id: string;
  billNumber: string;
  vendorId: string;
  purchaseOrderId?: string;
  date: string;
  dueDate: string;
  items: BillItem[];
  subtotal: number;
  tax: number;
  total: number;
  amountPaid: number;
  status: 'unpaid' | 'partial' | 'paid' | 'overdue';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BillItem {
  id: string;
  accountId: string;
  description: string;
  amount: number;
}

export interface BankAccount {
  id: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  routingNumber: string;
  accountType: 'checking' | 'savings' | 'credit';
  balance: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BankTransaction {
  id: string;
  bankAccountId: string;
  date: string;
  description: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'transfer';
  category?: string;
  isReconciled: boolean;
  transactionId?: string;
  createdAt: string;
}

export interface TaxRate {
  id: string;
  name: string;
  rate: number;
  type: 'sales' | 'purchase';
  jurisdiction: string;
  isActive: boolean;
}

export interface FinancialReport {
  id: string;
  type: 'profit-loss' | 'balance-sheet' | 'cash-flow' | 'trial-balance';
  name: string;
  period: {
    startDate: string;
    endDate: string;
  };
  data: Record<string, any>;
  generatedAt: string;
}
