import React from 'react';
import { Inventory } from '../../typings';
import WeightBar from '../utils/WeightBar';
import InventorySlot from './InventorySlot';
import InventoryContext from './InventoryContext';
import { getTotalWeight } from '../../helpers';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWeightHanging } from '@fortawesome/free-solid-svg-icons';
import { Slot } from '../../typings'; // Ujistěte se, že importujete Slot z vašich typings

interface InventoryGridProps {
  inventory: Inventory;
  onAddItem: (item: Slot) => void;
}

const InventoryGrid: React.FC<InventoryGridProps> = ({ inventory, onAddItem }) => {
  const weight = React.useMemo(
    () => (inventory.maxWeight !== undefined ? Math.floor(getTotalWeight(inventory.items) * 1000) / 1000 : 0),
    [inventory.maxWeight, inventory.items]
  );

  const hotInv = inventory.items.slice(0, 5);

  return (
    <>
      <div className="inventory-grid-wrapper">
        <div>
          <div className='inv-name'>{inventory.label}</div>
          <div className="inventory-grid-header-wrapper">
            {inventory.maxWeight && (
              <>
                <div>
                  <FontAwesomeIcon icon={faWeightHanging} />
                </div>
                <div>
                  {weight / 1000}/{inventory.maxWeight / 1000}KG
                </div>
              </>
            )}
          </div>
          <WeightBar percent={inventory.maxWeight ? (weight / inventory.maxWeight) * 100 : 0} />
        </div>

        <div
          className={
            inventory.type === 'player'
              ? 'inventory-grid-container'
              : 'secinventory-grid-container'
          }
        >
          <>
            {inventory.items.map((item, index) => {
              if (index < 5 && inventory.type === 'player') {
                return '';
              }
              return (
                <InventorySlot
                  key={`${inventory.type}-${inventory.id}-${item.slot}`}
                  item={item}
                  inventory={inventory}
                />
              );
            })}
            {inventory.type === 'player' && createPortal(<InventoryContext />, document.body)}
          </>
        </div>

        <div className='hotbar-title'>
          <div
            className={
              inventory.type === 'player'
                ? 'inventory-Hotbart'
                : 'secinventory-Hotbart'
            }
          >
            Hotbar
            <div className='hotbarline'></div>
          </div>
        </div>

        <div
          className={
            inventory.type === 'player'
              ? 'secinventory-hotslot-grid-container'
              : 'inventory-hotslot-grid-container'
          }
        >
          <>
            {hotInv.map((item) => (
              <InventorySlot
                key={`${inventory.type}-${inventory.id}-${item.slot}`}
                item={item}
                inventory={inventory}
              />
            ))}
            {inventory.type === 'player' && createPortal(<InventoryContext />, document.body)}
          </>
        </div>
      </div>
    </>
  );
};

export default InventoryGrid;
