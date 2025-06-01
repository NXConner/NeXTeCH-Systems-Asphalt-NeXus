import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { InventoryItem, StockMovement, Supplier, PurchaseOrder } from '@/types/inventory';
import { useCallback } from 'react';

export const useInventoryManagement = () => {
  const queryClient = useQueryClient();

  // Inventory Items
  const { data: inventoryItems = [], isLoading: inventoryLoading, error: inventoryError } = useQuery({
    queryKey: ['inventory-items'],
    queryFn: async () => {
      const { data, error } = await supabase.from('inventory_items').select('*');
      if (error) throw error;
      return data as InventoryItem[];
    }
  });

  // Suppliers
  const { data: suppliers = [], isLoading: suppliersLoading, error: suppliersError } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const { data, error } = await supabase.from('suppliers').select('*');
      if (error) throw error;
      return data as Supplier[];
    }
  });

  // Stock Movements
  const { data: stockMovements = [], isLoading: stockMovementsLoading, error: stockMovementsError } = useQuery({
    queryKey: ['stock-movements'],
    queryFn: async () => {
      const { data, error } = await supabase.from('stock_movements').select('*');
      if (error) throw error;
      return data as StockMovement[];
    }
  });

  // Add Inventory Item
  const addInventoryItem = useMutation({
    mutationFn: async (item: Omit<InventoryItem, 'id'>) => {
      const { data, error } = await supabase.from('inventory_items').insert(item).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inventory-items'] })
  });

  // Update Inventory Item
  const updateInventoryItem = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<InventoryItem> & { id: string }) => {
      const { data, error } = await supabase.from('inventory_items').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inventory-items'] })
  });

  // Record Stock Movement
  const recordStockMovement = useMutation({
    mutationFn: async (movement: Omit<StockMovement, 'id'>) => {
      const { data, error } = await supabase.from('stock_movements').insert(movement).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stock-movements'] })
  });

  // Add Supplier
  const addSupplier = useMutation({
    mutationFn: async (supplier: Omit<Supplier, 'id'>) => {
      const { data, error } = await supabase.from('suppliers').insert(supplier).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['suppliers'] })
  });

  // Update Supplier
  const updateSupplier = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Supplier> & { id: string }) => {
      const { data, error } = await supabase.from('suppliers').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['suppliers'] })
  });

  // Utility functions
  const getLowStockItems = useCallback(() => {
    return inventoryItems.filter(item => item.currentStock <= item.minimumStock && item.isActive);
  }, [inventoryItems]);

  const getInventoryValue = useCallback(() => {
    return inventoryItems.reduce((total, item) => total + item.totalValue, 0);
  }, [inventoryItems]);

  return {
    inventoryItems,
    inventoryLoading,
    inventoryError,
    suppliers,
    suppliersLoading,
    suppliersError,
    stockMovements,
    stockMovementsLoading,
    stockMovementsError,
    addInventoryItem,
    updateInventoryItem,
    recordStockMovement,
    getLowStockItems,
    getInventoryValue,
    addSupplier,
    updateSupplier
  };
};
