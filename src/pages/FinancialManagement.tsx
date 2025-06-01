import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, DollarSign, TrendingUp, CreditCard, FileText, Calendar } from "lucide-react";
import { Invoice, PaymentRecord } from "@/types/invoice";
import { FinancialDashboard } from "@/components/financial/FinancialDashboard";

const FinancialManagement = () => {
  const [invoices] = useState<Invoice[]>([
    {
      id: "inv-001",
      invoiceNumber: "INV-2024-001",
      customerId: "cust-001",
      customerName: "ABC Construction Co.",
      customerEmail: "contact@abcconstruction.com",
      customerAddress: {
        street: "123 Business Park Dr",
        city: "Richmond",
        state: "VA",
        zipCode: "23230"
      },
      estimateId: "est-001",
      status: "sent",
      items: [
        {
          id: "item-001",
          description: "Asphalt paving - 2500 sq ft",
          quantity: 2500,
          unit: "sq ft",
          unitPrice: 12,
          total: 30000,
          taxable: true
        },
        {
          id: "item-002",
          description: "Line striping",
          quantity: 500,
          unit: "linear ft",
          unitPrice: 3,
          total: 1500,
          taxable: true
        }
      ],
      subtotal: 31500,
      taxRate: 7.5,
      taxAmount: 2362.50,
      total: 33862.50,
      balanceRemaining: 33862.50,
      issueDate: "2024-01-27T00:00:00Z",
      dueDate: "2024-02-26T00:00:00Z",
      terms: "Net 30 days",
      createdAt: "2024-01-27T00:00:00Z",
      updatedAt: "2024-01-27T00:00:00Z"
    },
    {
      id: "inv-002",
      invoiceNumber: "INV-2024-002",
      customerId: "cust-002",
      customerName: "Sarah Johnson",
      customerEmail: "sarah.johnson@email.com",
      customerAddress: {
        street: "456 Oak Avenue",
        city: "Norfolk",
        state: "VA",
        zipCode: "23510"
      },
      jobId: "job-001",
      status: "paid",
      items: [
        {
          id: "item-003",
          description: "Crack sealing - 1800 sq ft",
          quantity: 1800,
          unit: "sq ft",
          unitPrice: 8,
          total: 14400,
          taxable: true
        }
      ],
      subtotal: 14400,
      taxRate: 7.5,
      taxAmount: 1080,
      total: 15480,
      balanceRemaining: 0,
      issueDate: "2024-01-20T00:00:00Z",
      dueDate: "2024-02-19T00:00:00Z",
      paidDate: "2024-01-25T00:00:00Z",
      paymentMethod: "bank_transfer",
      terms: "Net 30 days",
      createdAt: "2024-01-20T00:00:00Z",
      updatedAt: "2024-01-25T00:00:00Z"
    }
  ]);

  const [payments] = useState<PaymentRecord[]>([
    {
      id: "pay-001",
      invoiceId: "inv-002",
      amount: 15480,
      paymentMethod: "bank_transfer",
      reference: "TXN-20240125-001",
      paymentDate: "2024-01-25T00:00:00Z",
      notes: "Payment received in full"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (invoice: Invoice) => {
    return new Date(invoice.dueDate) < new Date() && invoice.status !== 'paid' && invoice.status !== 'cancelled';
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalInvoices: invoices.length,
    totalRevenue: invoices.reduce((sum, inv) => sum + inv.total, 0),
    outstandingAmount: invoices.reduce((sum, inv) => sum + (inv.balanceRemaining || 0), 0),
    overdueAmount: invoices
      .filter(inv => isOverdue(inv))
      .reduce((sum, inv) => sum + (inv.balanceRemaining || 0), 0)
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Financial Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage invoices, payments, and financial reporting
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{stats.totalInvoices}</div>
                <div className="text-sm text-muted-foreground">Total Invoices</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Revenue</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">${stats.outstandingAmount.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Outstanding</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold">${stats.overdueAmount.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Overdue</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="invoices" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          </div>
        </div>

        <TabsContent value="invoices" className="space-y-4">
          <div className="grid gap-4">
            {filteredInvoices.map((invoice) => (
              <Card key={invoice.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{invoice.invoiceNumber}</h3>
                        <Badge 
                          className={getStatusColor(isOverdue(invoice) ? 'overdue' : invoice.status)} 
                          variant="secondary"
                        >
                          {isOverdue(invoice) ? 'overdue' : invoice.status}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>Customer: {invoice.customerName}</div>
                        <div>Issue Date: {new Date(invoice.issueDate).toLocaleDateString()}</div>
                        <div>Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</div>
                        {invoice.paidDate && (
                          <div>Paid Date: {new Date(invoice.paidDate).toLocaleDateString()}</div>
                        )}
                      </div>

                      <div className="mt-3">
                        <div className="text-sm font-medium mb-2">Items:</div>
                        <div className="space-y-1">
                          {invoice.items.map((item) => (
                            <div key={item.id} className="text-xs text-muted-foreground flex justify-between">
                              <span>{item.description} - {item.quantity} {item.unit}</span>
                              <span>${item.total.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-2 ml-6">
                      <div className="text-2xl font-bold text-green-600">
                        ${invoice.total.toLocaleString()}
                      </div>
                      {invoice.balanceRemaining && invoice.balanceRemaining > 0 && (
                        <div className="text-sm text-red-600">
                          Outstanding: ${invoice.balanceRemaining.toLocaleString()}
                        </div>
                      )}
                      <div className="text-sm text-muted-foreground">
                        Tax: ${invoice.taxAmount.toLocaleString()} ({invoice.taxRate}%)
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          Send
                        </Button>
                        {invoice.balanceRemaining && invoice.balanceRemaining > 0 && (
                          <Button size="sm">
                            Record Payment
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <div className="grid gap-4">
            {payments.map((payment) => {
              const invoice = invoices.find(inv => inv.id === payment.invoiceId);
              return (
                <Card key={payment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">Payment for {invoice?.invoiceNumber}</h3>
                          <Badge variant="outline">{payment.paymentMethod.replace('_', ' ')}</Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>Amount: ${payment.amount.toLocaleString()}</div>
                          <div>Date: {new Date(payment.paymentDate).toLocaleDateString()}</div>
                          {payment.reference && <div>Reference: {payment.reference}</div>}
                          {payment.notes && <div>Notes: {payment.notes}</div>}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-600">
                          ${payment.amount.toLocaleString()}
                        </div>
                        <Button size="sm" variant="outline" className="mt-2">
                          View Receipt
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Revenue Reports
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Monthly Revenue Summary
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Quarterly Financial Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Year-to-Date Analysis
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Customer Payment History
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Accounting Reports
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Profit & Loss Statement
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Cash Flow Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Accounts Receivable Aging
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Tax Summary Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <FinancialDashboard data={{
            revenue: { total: 500000, monthly: 42000, growth: 8 },
            expenses: { total: 320000, monthly: 27000, categories: [
              { name: 'Materials', amount: 120000 },
              { name: 'Labor', amount: 90000 },
              { name: 'Equipment', amount: 60000 },
              { name: 'Other', amount: 50000 },
            ] },
            profit: { gross: 180000, net: 150000, margin: 30 },
            cashFlow: { inflow: 52000, outflow: 41000, balance: 11000 },
            accounts: { receivable: 25000, payable: 18000, overdue: 4000 }
          }} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Settings</CardTitle>
                <CardDescription>Configure invoice templates and defaults</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Default Payment Terms</label>
                  <Input defaultValue="Net 30 days" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Default Tax Rate (%)</label>
                  <Input type="number" defaultValue="7.5" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Invoice Number Prefix</label>
                  <Input defaultValue="INV-" />
                </div>
                <Button>Save Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
                <CardDescription>Configure payment methods and processing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Accepted Payment Methods</label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Cash</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Check</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Credit Card</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Bank Transfer</span>
                    </label>
                  </div>
                </div>
                <Button>Save Settings</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialManagement;
