import { useState, useEffect } from 'react';
import { fetchAccounts, fetchCustomers, fetchVendors, fetchTransactions } from '@/services/accountingService';
import { 
  Account, Transaction, JournalEntry, Customer, Vendor, 
  Bill, BankAccount, BankTransaction, PurchaseOrder 
} from '@/types/accounting';

export function useAccountingSystem() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchAccounts(),
      fetchCustomers(),
      fetchVendors(),
      fetchTransactions()
    ]).then(([a, c, v, t]) => {
      setAccounts(a);
      setCustomers(c);
      setVendors(v);
      setTransactions(t);
    }).finally(() => setLoading(false));
  }, []);

  const addAccount = (account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAccount: Account = {
      ...account,
      id: `acc-${String(accounts.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setAccounts(prev => [...prev, newAccount]);
    return newAccount;
  };

  const updateAccount = (id: string, updates: Partial<Account>) => {
    setAccounts(prev => 
      prev.map(acc => 
        acc.id === id 
          ? { ...acc, ...updates, updatedAt: new Date().toISOString() } 
          : acc
      )
    );
  };

  const createInvoice = (customerId: string, items: { description: string; quantity: number; unitPrice: number }[], taxRate = 0.075) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) throw new Error("Customer not found");
    
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;
    
    // Update customer balance
    setCustomers(prev => 
      prev.map(c => 
        c.id === customerId 
          ? { ...c, balance: c.balance + total } 
          : c
      )
    );
    
    // Create journal entries for this invoice
    const journalEntries: JournalEntry[] = [];
    
    // Add revenue entry for the subtotal
    const revenueAccount = accounts.find(a => a.type === 'revenue');
    if (revenueAccount) {
      journalEntries.push({
        id: `entry-${new Date().getTime()}-1`,
        accountId: revenueAccount.id,
        credit: subtotal,
        debit: 0,
        description: `Invoice revenue`
      });
      
      // Update account balance
      setAccounts(prev => 
        prev.map(a => 
          a.id === revenueAccount.id 
            ? { ...a, balance: a.balance + subtotal } 
            : a
        )
      );
    }
    
    // Add accounts receivable entry for the total
    const arAccount = accounts.find(a => a.name.includes('Receivable'));
    if (arAccount) {
      journalEntries.push({
        id: `entry-${new Date().getTime()}-2`,
        accountId: arAccount.id,
        debit: total,
        credit: 0,
        description: `Invoice accounts receivable`
      });
      
      // Update account balance
      setAccounts(prev => 
        prev.map(a => 
          a.id === arAccount.id 
            ? { ...a, balance: a.balance + total } 
            : a
        )
      );
    }
    
    // Create the transaction record
    const transaction: Transaction = {
      id: `txn-${new Date().getTime()}`,
      transactionNumber: `INV-${new Date().getFullYear()}-${String(transactions.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString(),
      type: 'journal',
      description: `Invoice for ${customer.name}`,
      entries: journalEntries,
      attachments: [],
      status: 'posted',
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setTransactions(prev => [...prev, transaction]);
    return transaction;
  };

  const recordPayment = (customerId: string, amount: number, paymentMethod: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) throw new Error("Customer not found");
    if (amount <= 0) throw new Error("Payment amount must be positive");
    if (amount > customer.balance) amount = customer.balance;
    
    // Update customer balance
    setCustomers(prev => 
      prev.map(c => 
        c.id === customerId 
          ? { ...c, balance: c.balance - amount } 
          : c
      )
    );
    
    // Create journal entries for this payment
    const journalEntries: JournalEntry[] = [];
    
    // Add cash entry for the amount
    const cashAccount = accounts.find(a => a.name.includes('Cash'));
    if (cashAccount) {
      journalEntries.push({
        id: `entry-${new Date().getTime()}-1`,
        accountId: cashAccount.id,
        debit: amount,
        credit: 0,
        description: `Payment received from ${customer.name}`
      });
      
      // Update account balance
      setAccounts(prev => 
        prev.map(a => 
          a.id === cashAccount.id 
            ? { ...a, balance: a.balance + amount } 
            : a
        )
      );
    }
    
    // Add accounts receivable entry for the amount
    const arAccount = accounts.find(a => a.name.includes('Receivable'));
    if (arAccount) {
      journalEntries.push({
        id: `entry-${new Date().getTime()}-2`,
        accountId: arAccount.id,
        credit: amount,
        debit: 0,
        description: `Payment applied to accounts receivable`
      });
      
      // Update account balance
      setAccounts(prev => 
        prev.map(a => 
          a.id === arAccount.id 
            ? { ...a, balance: a.balance - amount } 
            : a
        )
      );
    }
    
    // Create the transaction record
    const transaction: Transaction = {
      id: `txn-${new Date().getTime()}`,
      transactionNumber: `PMT-${new Date().getFullYear()}-${String(transactions.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString(),
      type: 'payment',
      reference: paymentMethod,
      description: `Payment received from ${customer.name}`,
      entries: journalEntries,
      attachments: [],
      status: 'posted',
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setTransactions(prev => [...prev, transaction]);
    return transaction;
  };

  const recordExpense = (vendorId: string, items: { accountId: string; description: string; amount: number }[]) => {
    const vendor = vendors.find(v => v.id === vendorId);
    if (!vendor) throw new Error("Vendor not found");
    
    const total = items.reduce((sum, item) => sum + item.amount, 0);
    
    // Update vendor balance
    setVendors(prev => 
      prev.map(v => 
        v.id === vendorId 
          ? { ...v, balance: v.balance + total } 
          : v
      )
    );
    
    // Create journal entries for this expense
    const journalEntries: JournalEntry[] = [];
    
    // Add expense entries for each item
    items.forEach((item, index) => {
      journalEntries.push({
        id: `entry-${new Date().getTime()}-${index}`,
        accountId: item.accountId,
        debit: item.amount,
        credit: 0,
        description: item.description
      });
      
      // Update account balance
      setAccounts(prev => 
        prev.map(a => 
          a.id === item.accountId 
            ? { ...a, balance: a.balance + item.amount } 
            : a
        )
      );
    });
    
    // Add accounts payable entry for the total
    const apAccount = accounts.find(a => a.name.includes('Payable'));
    if (apAccount) {
      journalEntries.push({
        id: `entry-${new Date().getTime()}-${items.length}`,
        accountId: apAccount.id,
        credit: total,
        debit: 0,
        description: `Expense payable to ${vendor.name}`
      });
      
      // Update account balance
      setAccounts(prev => 
        prev.map(a => 
          a.id === apAccount.id 
            ? { ...a, balance: a.balance + total } 
            : a
        )
      );
    }
    
    // Create the transaction record
    const transaction: Transaction = {
      id: `txn-${new Date().getTime()}`,
      transactionNumber: `EXP-${new Date().getFullYear()}-${String(transactions.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString(),
      type: 'journal',
      description: `Expense for ${vendor.name}`,
      entries: journalEntries,
      attachments: [],
      status: 'posted',
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setTransactions(prev => [...prev, transaction]);
    return transaction;
  };

  const generateFinancialReports = () => {
    // Generate simplified financial reports
    
    // Income Statement / Profit & Loss
    const revenues = accounts.filter(a => a.type === 'revenue');
    const expenses = accounts.filter(a => a.type === 'expense');
    
    const totalRevenue = revenues.reduce((sum, a) => sum + a.balance, 0);
    const totalExpenses = expenses.reduce((sum, a) => sum + a.balance, 0);
    const netIncome = totalRevenue - totalExpenses;
    
    // Balance Sheet
    const assets = accounts.filter(a => a.type === 'asset');
    const liabilities = accounts.filter(a => a.type === 'liability');
    const equity = accounts.filter(a => a.type === 'equity');
    
    const totalAssets = assets.reduce((sum, a) => sum + a.balance, 0);
    const totalLiabilities = liabilities.reduce((sum, a) => sum + a.balance, 0);
    const totalEquity = equity.reduce((sum, a) => sum + a.balance, 0) + netIncome; // Adding net income to retained earnings
    
    return {
      incomeStatement: {
        totalRevenue,
        totalExpenses,
        netIncome,
        revenueAccounts: revenues,
        expenseAccounts: expenses
      },
      balanceSheet: {
        totalAssets,
        totalLiabilities,
        totalEquity,
        assetAccounts: assets,
        liabilityAccounts: liabilities,
        equityAccounts: equity
      }
    };
  };

  return {
    accounts,
    customers,
    vendors,
    transactions,
    bankAccounts,
    addAccount,
    updateAccount,
    createInvoice,
    recordPayment,
    recordExpense,
    generateFinancialReports,
    loading
  };
}
