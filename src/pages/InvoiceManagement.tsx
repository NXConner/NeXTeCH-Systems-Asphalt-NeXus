import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvoiceStats } from "@/components/invoices/InvoiceStats";
import { InvoicesList } from "@/components/invoices/InvoicesList";
import { Invoice } from "@/types/invoice";
import { Plus, FileText, Send, Download } from "lucide-react";
import { toast } from "sonner";
import jsPDF from 'jspdf';
import emailjs from '@emailjs/browser';

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "INV-001",
      invoiceNumber: "INV-2024-001",
      customerId: "CUST-001",
      customerName: "ABC Construction Co.",
      customerEmail: "contact@abcconstruction.com",
      customerAddress: {
        street: "123 Business Park Dr",
        city: "Richmond",
        state: "VA",
        zipCode: "23230"
      },
      estimateId: "EST-001",
      jobId: "JOB-001",
      items: [
        {
          id: "item-1",
          description: "Asphalt Paving - Parking Lot",
          quantity: 5000,
          unitPrice: 6.50,
          unit: "sq ft",
          total: 32500,
          taxable: true
        },
        {
          id: "item-2",
          description: "Line Striping",
          quantity: 1,
          unitPrice: 2500,
          unit: "job",
          total: 2500,
          taxable: true
        }
      ],
      subtotal: 35000,
      taxRate: 0.06,
      taxAmount: 2100,
      total: 37100,
      balanceRemaining: 0,
      status: "paid",
      issueDate: "2024-01-15T00:00:00Z",
      dueDate: "2024-02-14T00:00:00Z",
      paidDate: "2024-02-10T00:00:00Z",
      paymentMethod: "check",
      notes: "Thank you for your business!",
      terms: "Payment due within 30 days",
      createdAt: "2024-01-15T00:00:00Z",
      updatedAt: "2024-02-10T00:00:00Z"
    },
    {
      id: "INV-002",
      invoiceNumber: "INV-2024-002",
      customerId: "CUST-002",
      customerName: "Sarah Johnson",
      customerEmail: "sarah.johnson@email.com",
      customerAddress: {
        street: "456 Oak Avenue",
        city: "Norfolk",
        state: "VA",
        zipCode: "23510"
      },
      items: [
        {
          id: "item-3",
          description: "Driveway Paving",
          quantity: 800,
          unitPrice: 12.00,
          unit: "sq ft",
          total: 9600,
          taxable: true
        }
      ],
      subtotal: 9600,
      taxRate: 0.06,
      taxAmount: 576,
      total: 10176,
      balanceRemaining: 10176,
      status: "sent",
      issueDate: "2024-01-25T00:00:00Z",
      dueDate: "2024-02-24T00:00:00Z",
      notes: "Residential driveway project",
      terms: "Payment due within 30 days",
      createdAt: "2024-01-25T00:00:00Z",
      updatedAt: "2024-01-25T00:00:00Z"
    }
  ]);

  const handleNewInvoice = () => {
    toast.info("New invoice form - coming soon");
  };

  const handleViewInvoice = (invoice: Invoice) => {
    toast.info(`Viewing invoice ${invoice.invoiceNumber}`);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    toast.info(`Editing invoice ${invoice.invoiceNumber}`);
  };

  const handleSendInvoice = async (invoice: Invoice) => {
    try {
      // Generate PDF
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('Invoice', 10, 10);
      doc.setFontSize(12);
      doc.text(`Invoice #: ${invoice.invoiceNumber}`, 10, 20);
      doc.text(`Customer: ${invoice.customerName}`, 10, 30);
      doc.text(`Status: ${invoice.status}`, 10, 40);
      doc.text(`Total: $${invoice.total}`, 10, 50);
      // Add more fields as needed
      const pdfBlob = doc.output('blob');
      // Prepare form for emailjs.sendForm
      const form = document.createElement('form');
      form.style.display = 'none';
      form.innerHTML = `
        <input name="to_name" value="${invoice.customerName}" />
        <input name="to_email" value="${invoice.customerEmail || ''}" />
        <input name="message" value="Please find your invoice attached." />
        <input name="invoice_id" value="${invoice.invoiceNumber}" />
      `;
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.name = 'attachment';
      const file = new File([pdfBlob], `invoice-${invoice.invoiceNumber}.pdf`, { type: 'application/pdf' });
      // @ts-ignore
      fileInput.files = { 0: file, length: 1, item: (i: number) => file };
      form.appendChild(fileInput);
      document.body.appendChild(form);
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const userId = import.meta.env.VITE_EMAILJS_USER_ID;
      if (!serviceId || !templateId || !userId) {
        toast.error('EmailJS environment variables are not set.');
        document.body.removeChild(form);
        return;
      }
      await emailjs.sendForm(serviceId, templateId, form, userId);
      document.body.removeChild(form);
      setInvoices(prev => prev.map(inv => inv.id === invoice.id ? { ...inv, status: 'sent' as const } : inv));
      toast.success(`Invoice ${invoice.invoiceNumber} sent to ${invoice.customerName}`);
    } catch (error) {
      toast.error('Failed to send invoice');
    }
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('Invoice', 10, 10);
      doc.setFontSize(12);
      doc.text(`Invoice #: ${invoice.invoiceNumber}`, 10, 20);
      doc.text(`Customer: ${invoice.customerName}`, 10, 30);
      doc.text(`Status: ${invoice.status}`, 10, 40);
      doc.text(`Total: $${invoice.total}`, 10, 50);
      // Add more fields as needed
      doc.save(`invoice-${invoice.invoiceNumber}.pdf`);
      toast.success('PDF downloaded');
    } catch (error) {
      toast.error('Failed to download PDF');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoice Management</h1>
            <p className="text-gray-600 mt-2">Create, send, and track invoices</p>
          </div>
          <Button onClick={handleNewInvoice}>
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        </div>

        <InvoiceStats invoices={invoices} />

        <Tabs defaultValue="invoices" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
            <TabsTrigger value="invoices">
              <FileText className="h-4 w-4 mr-2" />
              All Invoices
            </TabsTrigger>
            <TabsTrigger value="pending">
              <Send className="h-4 w-4 mr-2" />
              Pending
            </TabsTrigger>
            <TabsTrigger value="overdue">
              <Download className="h-4 w-4 mr-2" />
              Overdue
            </TabsTrigger>
          </TabsList>

          <TabsContent value="invoices">
            <InvoicesList
              invoices={invoices}
              onViewInvoice={handleViewInvoice}
              onEditInvoice={handleEditInvoice}
              onNewInvoice={handleNewInvoice}
              onSendInvoice={handleSendInvoice}
              onDownloadInvoice={handleDownloadInvoice}
            />
          </TabsContent>

          <TabsContent value="pending">
            <InvoicesList
              invoices={invoices.filter(inv => inv.status === 'sent')}
              onViewInvoice={handleViewInvoice}
              onEditInvoice={handleEditInvoice}
              onNewInvoice={handleNewInvoice}
              onSendInvoice={handleSendInvoice}
              onDownloadInvoice={handleDownloadInvoice}
            />
          </TabsContent>

          <TabsContent value="overdue">
            <InvoicesList
              invoices={invoices.filter(inv => inv.status === 'overdue')}
              onViewInvoice={handleViewInvoice}
              onEditInvoice={handleEditInvoice}
              onNewInvoice={handleNewInvoice}
              onSendInvoice={handleSendInvoice}
              onDownloadInvoice={handleDownloadInvoice}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InvoiceManagement;
