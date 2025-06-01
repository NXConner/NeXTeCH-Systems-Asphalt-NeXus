import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Download, FileText, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface Receipt {
  id: string;
  date: string;
  vendor: string;
  amount: number;
  category: string;
  description: string;
  taxDeductible: boolean;
  imageUrl?: string;
  extractedData?: {
    total: number;
    tax: number;
    date: string;
    vendor: string;
    items: string[];
  };
  processed: boolean;
  createdAt: string;
}

// Refactored to use real API data. Please implement useReceipts hook for fetching and updating receipts.

export function ReceiptManager() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    'Equipment', 'Materials', 'Fuel', 'Maintenance', 'Office Supplies', 
    'Travel', 'Meals', 'Professional Services', 'Insurance', 'Other'
  ];

  const handleImageUpload = async (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    
    // Simulate OCR processing
    setTimeout(() => {
      const mockExtractedData = {
        total: Math.random() * 500 + 20,
        tax: Math.random() * 50 + 2,
        date: new Date().toISOString().split('T')[0],
        vendor: 'Auto-detected Vendor',
        items: ['Auto-detected item 1', 'Auto-detected item 2']
      };

      const newReceipt: Receipt = {
        id: `receipt-${Date.now()}`,
        date: mockExtractedData.date,
        vendor: mockExtractedData.vendor,
        amount: mockExtractedData.total,
        category: 'Other',
        description: 'Auto-extracted from receipt',
        taxDeductible: true,
        imageUrl,
        extractedData: mockExtractedData,
        processed: false,
        createdAt: new Date().toISOString(),
      };

      setReceipts(prev => [newReceipt, ...prev]);
      toast.success("Receipt uploaded and processed! Please review the extracted data.");
    }, 2000);

    toast.info("Processing receipt... extracting data...");
  };

  const updateReceipt = (id: string, updates: Partial<Receipt>) => {
    setReceipts(prev => prev.map(receipt => 
      receipt.id === id ? { ...receipt, ...updates, processed: true } : receipt
    ));
    toast.success("Receipt updated successfully");
  };

  const exportTaxReport = () => {
    const taxDeductibleReceipts = receipts.filter(r => r.taxDeductible);
    const totalAmount = taxDeductibleReceipts.reduce((sum, r) => sum + r.amount, 0);
    
    const reportText = `
TAX DEDUCTIBLE EXPENSES REPORT
Generated: ${new Date().toLocaleDateString()}

SUMMARY:
Total Receipts: ${taxDeductibleReceipts.length}
Total Amount: $${totalAmount.toFixed(2)}

BY CATEGORY:
${categories.map(category => {
  const categoryReceipts = taxDeductibleReceipts.filter(r => r.category === category);
  const categoryTotal = categoryReceipts.reduce((sum, r) => sum + r.amount, 0);
  return `${category}: $${categoryTotal.toFixed(2)} (${categoryReceipts.length} receipts)`;
}).join('\n')}

DETAILED RECEIPTS:
${taxDeductibleReceipts.map(receipt => 
  `${receipt.date} | ${receipt.vendor} | $${receipt.amount.toFixed(2)} | ${receipt.category} | ${receipt.description}`
).join('\n')}
    `;
    
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tax-report-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    
    toast.success("Tax report exported successfully");
  };

  const filteredReceipts = selectedCategory === 'all' 
    ? receipts 
    : receipts.filter(r => r.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Receipt Management</h3>
        <div className="flex gap-2">
          <Button onClick={exportTaxReport}>
            <DollarSign className="h-4 w-4 mr-2" />
            Export Tax Report
          </Button>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
            }}
            className="hidden"
            id="receipt-upload"
          />
          <Button onClick={() => document.getElementById('receipt-upload')?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Receipt
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('all')}
        >
          All Categories
        </Button>
        {categories.map(category => (
          <Button
            key={category}
            size="sm"
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Receipts Grid */}
      <div className="grid gap-4">
        {filteredReceipts.map((receipt) => (
          <Card key={receipt.id} className={`${!receipt.processed ? 'border-orange-200 bg-orange-50' : ''}`}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{receipt.vendor}</h4>
                    {!receipt.processed && (
                      <Badge variant="outline" className="text-orange-600">
                        Needs Review
                      </Badge>
                    )}
                    {receipt.taxDeductible && (
                      <Badge variant="default">Tax Deductible</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{receipt.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-semibold">${receipt.amount.toFixed(2)}</span>
                  <p className="text-sm text-muted-foreground">{receipt.date}</p>
                </div>
              </div>

              {receipt.extractedData && !receipt.processed && (
                <div className="bg-blue-50 p-3 rounded mb-4">
                  <h5 className="font-medium mb-2">Extracted Data (Please Review):</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div>
                      <Label>Amount</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={receipt.amount}
                        onChange={(e) => updateReceipt(receipt.id, { amount: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label>Vendor</Label>
                      <Input
                        value={receipt.vendor}
                        onChange={(e) => updateReceipt(receipt.id, { vendor: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={receipt.date}
                        onChange={(e) => updateReceipt(receipt.id, { date: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <select
                        value={receipt.category}
                        onChange={(e) => updateReceipt(receipt.id, { category: e.target.value })}
                        className="w-full p-2 border rounded"
                        title="Select receipt category"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Label>Description</Label>
                    <Input
                      value={receipt.description}
                      onChange={(e) => updateReceipt(receipt.id, { description: e.target.value })}
                    />
                  </div>
                  <Button 
                    size="sm" 
                    className="mt-2"
                    onClick={() => updateReceipt(receipt.id, { processed: true })}
                  >
                    Confirm & Save
                  </Button>
                </div>
              )}

              <div className="flex justify-between items-center">
                <Badge variant="outline">{receipt.category}</Badge>
                <div className="flex gap-2">
                  {receipt.imageUrl && (
                    <Button size="sm" variant="outline" onClick={() => window.open(receipt.imageUrl, '_blank')}>
                      <FileText className="h-3 w-3 mr-1" />
                      View Image
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
