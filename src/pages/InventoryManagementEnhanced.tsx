import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Package, AlertTriangle, DollarSign, TrendingDown } from "lucide-react";
import { useInventoryManagement } from "@/hooks/useInventoryManagement";
import { toast } from "sonner";
import { InventoryList } from '../components/inventory/InventoryList';
import { ExportUtility } from '../components/export/ExportUtility';

const InventoryManagementEnhanced = () => {
  const {
    inventoryItems,
    stockMovements,
    suppliers,
    addInventoryItem,
    updateInventoryItem,
    recordStockMovement,
    getLowStockItems,
    getInventoryValue
  } = useInventoryManagement();

  const [searchTerm, setSearchTerm] = useState("");
  const [auditMode, setAuditMode] = useState(false);
  const [scannedSkus, setScannedSkus] = useState<string[]>([]);

  const filteredItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = getLowStockItems();
  const totalValue = getInventoryValue();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'asphalt': return 'bg-blue-100 text-blue-800';
      case 'aggregate': return 'bg-green-100 text-green-800';
      case 'equipment': return 'bg-orange-100 text-orange-800';
      case 'tools': return 'bg-purple-100 text-purple-800';
      case 'chemicals': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockStatus = (item: any) => {
    if (item.currentStock <= item.minimumStock) {
      return { status: 'Low Stock', color: 'bg-red-100 text-red-800' };
    } else if (item.currentStock >= item.maximumStock) {
      return { status: 'Overstocked', color: 'bg-yellow-100 text-yellow-800' };
    }
    return { status: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  const handleQuickRestock = (itemId: string, quantity: number) => {
    recordStockMovement({
      itemId,
      type: 'in',
      quantity,
      reason: 'Quick Restock',
      reference: `QR-${Date.now()}`
    });
    toast.success('Stock updated successfully');
  };

  const handleAuditScan = (sku: string) => {
    setScannedSkus(prev => [...prev, sku]);
    toast.success(`Audited SKU: ${sku}`);
  };

  const stats = {
    totalItems: inventoryItems.length,
    lowStockCount: lowStockItems.length,
    totalValue: totalValue,
    activeSuppliers: suppliers.filter(s => s.isActive).length
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-gray-600 mt-2">Track materials, supplies, and equipment</p>
          </div>
          <Button onClick={() => setAuditMode(true)}>
            Start Audit
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">{stats.totalItems}</div>
                  <div className="text-sm text-muted-foreground">Total Items</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <div className="text-2xl font-bold text-red-600">{stats.lowStockCount}</div>
                  <div className="text-sm text-muted-foreground">Low Stock Items</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Inventory Value</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold">{stats.activeSuppliers}</div>
                  <div className="text-sm text-muted-foreground">Active Suppliers</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Low Stock Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <span className="font-medium">{item.name} ({item.sku})</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-red-600">
                        {item.currentStock} {item.unit} remaining
                      </span>
                      <Button className="text-xs px-2 py-1" onClick={() => handleQuickRestock(item.id, item.minimumStock)}>
                        Quick Restock
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="inventory" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="movements">Stock Movements</TabsTrigger>
              <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
              <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
            </TabsList>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>

          <TabsContent value="inventory" className="space-y-4">
            <InventoryList
              items={inventoryItems.map(item => ({
                id: item.id,
                name: item.name,
                sku: item.sku,
                category: item.category,
                currentStock: item.currentStock,
                minStock: item.minimumStock,
                maxStock: item.maximumStock,
                unit: item.unit,
                costPerUnit: item.unitCost,
                totalValue: item.totalValue,
                supplier: item.supplierName || '',
                lastOrdered: item.lastRestocked,
                status: item.currentStock <= item.minimumStock ? 'low-stock' : item.currentStock === 0 ? 'out-of-stock' : item.currentStock >= item.maximumStock ? 'overstock' : 'in-stock',
              }))}
              onViewItem={() => {}}
              onEditItem={() => {}}
              onAddItem={() => {}}
              auditMode={auditMode}
              scannedSkus={scannedSkus}
              onAuditScan={handleAuditScan}
            />
            {auditMode && scannedSkus.length > 0 && (
              <div className="mt-6">
                <ExportUtility
                  data={inventoryItems.filter(item => scannedSkus.includes(item.sku))}
                  filename={`inventory-audit-${new Date().toISOString().split('T')[0]}`}
                  availableFields={[
                    { key: 'name', label: 'Name' },
                    { key: 'sku', label: 'SKU' },
                    { key: 'category', label: 'Category' },
                    { key: 'currentStock', label: 'Current Stock' },
                    { key: 'minStock', label: 'Min Stock' },
                    { key: 'maxStock', label: 'Max Stock' },
                    { key: 'unit', label: 'Unit' },
                    { key: 'supplier', label: 'Supplier' },
                    { key: 'lastOrdered', label: 'Last Ordered' },
                    { key: 'status', label: 'Status' },
                  ]}
                  type="inventory"
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="movements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Stock Movements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stockMovements.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No stock movements recorded yet</p>
                  ) : (
                    stockMovements.slice(0, 10).map((movement) => (
                      <div key={movement.id} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{movement.reason}</h4>
                          <p className="text-sm text-gray-600">
                            {movement.type === 'in' ? '+' : movement.type === 'out' ? '-' : ''}
                            {movement.quantity} units
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {new Date(movement.date).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {movement.reference}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suppliers" className="space-y-4">
            <div className="grid gap-4">
              {suppliers.map((supplier) => (
                <Card key={supplier.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">{supplier.name}</h3>
                        <div className="text-sm text-gray-600">
                          Contact: {supplier.contactPerson}
                        </div>
                        <div className="text-sm text-gray-600">
                          {supplier.email} | {supplier.phone}
                        </div>
                        {supplier.address && (
                          <div className="text-sm text-gray-600">
                            {supplier.address.city}, {supplier.address.state}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button className="text-xs px-2 py-1">
                          Edit
                        </Button>
                        <Button className="text-xs px-2 py-1">
                          Create Order
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Purchase Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No purchase orders created yet</p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Purchase Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InventoryManagementEnhanced;
