// LeftInventory.tsx

import InventoryGrid from './InventoryGrid';
import { useAppSelector, useAppDispatch } from '../../store';
import { Slot } from '../../typings'; // Předpokládá se, že useAppDispatch je k dispozici z redux toolkit
import { selectRightInventory, addItem } from '../../store/inventory'; // Import akce addItem

const RightInventory: React.FC = () => {
  const dispatch = useAppDispatch(); // Získat dispatch funkci pro volání akcí
  const rightInventory = useAppSelector(selectRightInventory);

  const handleAddItem = (item: Slot) => {
    dispatch(addItem({ item, inventoryType: 'right' })); // Volání akce pro přidání předmětu do levého inventáře
  };

  return <InventoryGrid inventory={rightInventory} onAddItem={handleAddItem} />;
};

export default RightInventory;
