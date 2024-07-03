// LeftInventory.tsx
import React from 'react';
import InventoryGrid from './InventoryGrid';
import { useAppSelector, useAppDispatch } from '../../store';
import { selectLeftInventory } from '../../store/inventory';
import { Slot } from '../../typings'; // Ujistěte se, že importujete Slot z vašich typings

const LeftInventory: React.FC = () => {
  const leftInventory = useAppSelector(selectLeftInventory);
  const dispatch = useAppDispatch();

  const handleAddItem = (item: Slot) => {
    // Implementace logiky pro přidání položky do inventáře
    console.log('Adding item:', item);
    // Například dispatch akce pro přidání položky
    // dispatch(addItem({ item, inventoryType: 'left' }));
  };

  return <InventoryGrid inventory={leftInventory} onAddItem={handleAddItem} />;
};

export default LeftInventory;
