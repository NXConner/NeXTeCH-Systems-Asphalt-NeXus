import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Package, AlertTriangle, DollarSign, TrendingDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const InventoryManagement = () => {
  const [inventoryItems] = useState([]);
  const { data: suppliers = [] } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const { data, error } = await supabase.from('suppliers').select('*');
      if (error) throw error;
      return data;
    }
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [newOrder, setNewOrder] = useState({ supplier: '', items: [{ name: '', quantity: 1, unitCost: 0 }] });

  const filteredItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = inventoryItems.filter(item => item.currentStock <= item.minimumStock && item.isActive);
  const totalValue = inventoryItems.reduce((total, item) => total + item.totalValue, 0);

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
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Inventory Item
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
                        {item.currentStock} {item.unit} remaining (min: {item.minimumStock})
                      </span>
                      <Button size="sm">
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
            <div className="grid gap-4">
              {filteredItems.map((item) => {
                const stockStatus = getStockStatus(item);
                return (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold">{item.name}</h3>
                            <Badge className={getCategoryColor(item.category)}>
                              {item.category}
                            </Badge>
                            <Badge className={stockStatus.color}>
                              {stockStatus.status}
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-gray-600">
                            SKU: {item.sku} | {item.description}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-sm">
                            <div>
                              <span className="font-medium">Current Stock:</span> {item.currentStock} {item.unit}
                            </div>
                            <div>
                              <span className="font-medium">Min Stock:</span> {item.minimumStock} {item.unit}
                            </div>
                            <div>
                              <span className="font-medium">Unit Cost:</span> ${item.unitCost.toFixed(2)}
                            </div>
                            <div>
                              <span className="font-medium">Location:</span> {item.location}
                            </div>
                          </div>

                          <div className="text-sm text-gray-500">
                            Last restocked: {new Date(item.lastRestocked).toLocaleDateString()}
                            {item.supplierName && ` | Supplier: ${item.supplierName}`}
                          </div>
                        </div>
                        
                        <div className="text-right space-y-2 ml-6">
                          <div className="text-lg font-bold text-green-600">
                            ${item.totalValue.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            Total Value
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                            <Button size="sm" variant="outline">
                              Restock
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="movements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Stock Movements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No stock movements recorded yet</p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Record Movement
                  </Button>
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
                        <div className="text-sm text-gray-600">
                          {supplier.address.city}, {supplier.address.state}
                        </div>
                        <div className="text-sm text-gray-600">
                          Payment Terms: {supplier.paymentTerms}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
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
                {purchaseOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No purchase orders created yet</p>
                    <Button onClick={() => setShowOrderModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Purchase Order
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {purchaseOrders.map((order, idx) => (
                      <Card key={idx} className="border p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold">Supplier: {order.supplier}</div>
                            <div className="text-sm text-gray-600">Items: {order.items.map(i => i.name).join(', ')}</div>
                          </div>
                          <div className="font-bold">Total: ${order.items.reduce((sum, i) => sum + (i.quantity * i.unitCost), 0).toFixed(2)}</div>
                        </div>
                      </Card>
                    ))}
                    <Button onClick={() => setShowOrderModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Purchase Order
                    </Button>
                  </div>
                )}
                <Dialog open={showOrderModal} onOpenChange={setShowOrderModal}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Purchase Order</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <label className="block text-sm font-medium">Supplier</label>
                      <input className="w-full p-2 border rounded" placeholder="Supplier name" value={newOrder.supplier} onChange={e => setNewOrder(o => ({ ...o, supplier: e.target.value }))} />
                      <label className="block text-sm font-medium">Items</label>
                      {newOrder.items.map((item, idx) => (
                        <div key={idx} className="flex gap-2 mb-2">
                          <input className="flex-1 p-2 border rounded" placeholder="Item name" value={item.name} onChange={e => setNewOrder(o => { const items = [...o.items]; items[idx].name = e.target.value; return { ...o, items }; })} />
                          <input type="number" className="w-20 p-2 border rounded" placeholder="Qty" value={item.quantity} min={1} onChange={e => setNewOrder(o => { const items = [...o.items]; items[idx].quantity = Number(e.target.value); return { ...o, items }; })} />
                          <input type="number" className="w-24 p-2 border rounded" placeholder="Unit Cost" value={item.unitCost} min={0} onChange={e => setNewOrder(o => { const items = [...o.items]; items[idx].unitCost = Number(e.target.value); return { ...o, items }; })} />
                          <Button size="sm" variant="outline" onClick={() => setNewOrder(o => { const items = o.items.filter((_, i) => i !== idx); return { ...o, items }; })}>Remove</Button>
                        </div>
                      ))}
                      <Button size="sm" variant="outline" onClick={() => setNewOrder(o => ({ ...o, items: [...o.items, { name: '', quantity: 1, unitCost: 0 }] }))}>Add Item</Button>
                    </div>
                    <DialogFooter>
                      <Button onClick={() => {
                        setPurchaseOrders(orders => [...orders, newOrder]);
                        setShowOrderModal(false);
                        setNewOrder({ supplier: '', items: [{ name: '', quantity: 1, unitCost: 0 }] });
                      }}>Create Order</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InventoryManagement;
