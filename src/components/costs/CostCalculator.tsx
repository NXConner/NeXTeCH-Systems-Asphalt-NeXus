import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Plus, Minus, DollarSign, Info } from "lucide-react";
import { SealcoatingSpreadsheetApp } from '../estimates/SealcoatingSpreadsheetApp';
import { PopoutCalculator } from '@/components/ui/PopoutCalculator';
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface CalculatorItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unit_price: number;
  tax_rate: number;
  total: number;
}

export const CostCalculator = () => {
  const [items, setItems] = useState<CalculatorItem[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [showSpreadsheet, setShowSpreadsheet] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showSpreadsheetModal, setShowSpreadsheetModal] = useState(false);
  const [importedValue, setImportedValue] = useState<string | number | null>(null);
  const [batchImportedValues, setBatchImportedValues] = useState<any[][] | null>(null);
  const [batchMapStep, setBatchMapStep] = useState(0);

  const materialPrices = {
    'coal_tar_sealer': { name: 'Coal Tar Sealer', price: 1.95, unit: 'gallon', tax_rate: 0.053 },
    'crack_filler': { name: 'Hot Pour Crack Filler', price: 48.50, unit: 'box', tax_rate: 0.053 },
    'asphalt_mix': { name: 'Asphalt Mix S9.5A', price: 98.00, unit: 'ton', tax_rate: 0.053 },
    'safety_cones': { name: 'Safety Cones', price: 18.50, unit: 'each', tax_rate: 0.053 },
    'diesel_fuel': { name: 'Diesel Fuel', price: 3.85, unit: 'gallon', tax_rate: 0.073 },
    'crew_leader': { name: 'Crew Leader', price: 29.50, unit: 'hour', tax_rate: 0 },
    'equipment_operator': { name: 'Equipment Operator', price: 26.00, unit: 'hour', tax_rate: 0 }
  };

  const addItem = () => {
    if (!selectedMaterial || quantity <= 0) return;

    const material = materialPrices[selectedMaterial as keyof typeof materialPrices];
    const subtotal = material.price * quantity;
    const tax = subtotal * material.tax_rate;
    const total = subtotal + tax;

    const newItem: CalculatorItem = {
      id: `item-${Date.now()}`,
      name: material.name,
      quantity,
      unit: material.unit,
      unit_price: material.price,
      tax_rate: material.tax_rate,
      total
    };

    setItems([...items, newItem]);
    setQuantity(1);
    setSelectedMaterial('');
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) return;
    
    setItems(items.map(item => {
      if (item.id === id) {
        const subtotal = item.unit_price * newQuantity;
        const tax = subtotal * item.tax_rate;
        return { ...item, quantity: newQuantity, total: subtotal + tax };
      }
      return item;
    }));
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
    const tax = items.reduce((sum, item) => sum + (item.unit_price * item.quantity * item.tax_rate), 0);
    const total = subtotal + tax;
    
    return { subtotal, tax, total };
  };

  const { subtotal, tax, total } = calculateTotals();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Job Cost Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2 mb-4">
          <Button variant="outline" onClick={() => setShowSpreadsheet(v => !v)}>
            Open Sealcoating Spreadsheet
          </Button>
          <Button variant="outline" onClick={() => setShowCalculator(v => !v)}>
            Open Calculator
          </Button>
          <Button variant="outline" onClick={() => setShowSpreadsheetModal(true)} aria-label="Import from Spreadsheet">
            Import from Spreadsheet <Info size={16} aria-label="Map each imported value to a field" />
          </Button>
        </div>
        {showSpreadsheet && <SealcoatingSpreadsheetApp />}
        {showCalculator && <PopoutCalculator />}
        <Dialog open={showSpreadsheetModal} onOpenChange={setShowSpreadsheetModal}>
          <DialogContent>
            <SealcoatingSpreadsheetApp onCellSelect={val => {
              if (Array.isArray(val) && Array.isArray(val[0])) {
                setBatchImportedValues(val);
                setBatchMapStep(0);
              } else {
                setImportedValue(val);
                setShowSpreadsheetModal(false);
              }
            }} />
            <div style={{marginTop: 16}}>
              <Button onClick={() => setShowSpreadsheetModal(false)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
        {batchImportedValues && (
          <div style={{margin:'16px 0', background:'#e6f7ff', padding:12, borderRadius:8, border:'1px solid #91d5ff'}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <span>Batch imported values:</span>
              <Info size={16} aria-label="Map each imported value to a field" />
            </div>
            <div style={{marginTop:8}}>
              {batchImportedValues.flat().map((val, idx) => (
                <div key={idx} style={{marginBottom:8}}>
                  <span>Value <strong>{val}</strong> - Map to: </span>
                  <Button size="sm" aria-label="Set Quantity" onClick={() => {
                    setQuantity(Number(val));
                    setBatchMapStep(batchMapStep + 1);
                  }}>Set Quantity</Button>
                </div>
              ))}
              <Button size="sm" variant="outline" aria-label="Cancel Batch Import" onClick={() => { setBatchImportedValues(null); setBatchMapStep(0); }}>Cancel</Button>
            </div>
          </div>
        )}
        {importedValue !== null && (
          <div style={{margin:'16px 0', background:'#f6ffed', padding:12, borderRadius:8, border:'1px solid #b7eb8f'}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <span>Imported value: <strong>{importedValue}</strong></span>
              <Info size={16} aria-label="Select which field to apply the imported value to." />
            </div>
            <div style={{marginTop:8}}>
              <Button size="sm" aria-label="Set Quantity" onClick={() => {
                setQuantity(Number(importedValue));
                setImportedValue(null);
              }}>Set Quantity</Button>
              <Button size="sm" variant="outline" aria-label="Cancel Import" onClick={() => setImportedValue(null)}>Cancel</Button>
            </div>
          </div>
        )}
        {/* Add Item Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Material/Service</label>
            <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
              <SelectTrigger>
                <SelectValue placeholder="Select item..." />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(materialPrices).map(([key, material]) => (
                  <SelectItem key={key} value={key}>
                    {material.name} - ${material.price}/{material.unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Quantity</label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
              step="0.1"
            />
          </div>
          
          <div className="flex items-end">
            <Button onClick={addItem} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>

        {/* Items List */}
        {items.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Cost Breakdown</h4>
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-muted-foreground">
                    ${item.unit_price.toFixed(2)} × {item.quantity} {item.unit}
                    {item.tax_rate > 0 && ` (+ ${(item.tax_rate * 100).toFixed(1)}% tax)`}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, item.quantity - 0.5)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="min-w-12 text-center">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, item.quantity + 0.5)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="font-semibold min-w-20 text-right">
                    ${item.total.toFixed(2)}
                  </div>
                  
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeItem(item.id)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}

            {/* Totals */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-green-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {items.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Add materials and services to calculate job costs</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
