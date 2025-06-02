import React, { useEffect, useState } from 'react';
import { fetchInventory, updateInventoryItem } from '@/services/inventoryService';

export const InventoryList = ({ onSelect }: { onSelect?: (item: any) => void }) => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetchInventory().then(setItems);
  }, []);
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Inventory List</h2>
      <ul>
        {items.map((item: any) => (
          <li key={item.id} onClick={() => onSelect && onSelect(item)}>{item.name} - {item.quantity}</li>
        ))}
      </ul>
    </div>
  );
}

export default InventoryList; 