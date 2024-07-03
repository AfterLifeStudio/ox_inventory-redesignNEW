// store/inventory.ts

import { createSlice, PayloadAction, current, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import type { RootState } from '.';
import { Slot, State } from '../typings';
import {
  setupInventoryReducer,
  refreshSlotsReducer,
  stackSlotsReducer,
  swapSlotsReducer,
  moveSlotsReducer,
} from '../reducers';

// Funkce pro nalezení první neobsazené pozice v poli slotů
function findFirstEmptySlot(items: Slot[]): number {
  for (let i = 0; i < items.length; i++) {
    if (!items[i]) {
      return i;
    }
  }
  return -1; // Vrací -1, pokud není žádná neobsazená pozice
}

const initialState: State = {
  leftInventory: {
    id: '',
    type: '',
    slots: 0,
    maxWeight: 0,
    items: [],
  },
  rightInventory: {
    id: '',
    type: '',
    slots: 0,
    maxWeight: 0,
    items: [],
  },
  additionalMetadata: {},
  contextMenu: { coords: null },
  itemAmount: 0,
  shiftPressed: false,
  isBusy: false,
};

export const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    stackSlots: stackSlotsReducer,
    swapSlots: swapSlotsReducer,
    setupInventory: setupInventoryReducer,
    moveSlots: moveSlotsReducer,
    refreshSlots: refreshSlotsReducer,
    setContextMenu: (
      state,
      action: PayloadAction<{ coords: { mouseX: number; mouseY: number } | null; item?: Slot }>
    ) => {
      state.contextMenu = action.payload;
    },
    setAdditionalMetadata: (state, action: PayloadAction<{ [key: string]: any }>) => {
      state.additionalMetadata = { ...state.additionalMetadata, ...action.payload };
    },
    setItemAmount: (state, action: PayloadAction<number>) => {
      state.itemAmount = action.payload;
    },
    setShiftPressed: (state, action: PayloadAction<boolean>) => {
      state.shiftPressed = action.payload;
    },
    setContainerWeight: (state, action: PayloadAction<number>) => {
      const container = state.leftInventory.items.find((item) => item.metadata?.container === state.rightInventory.id);

      if (!container) return;

      container.weight = action.payload;
    },
    addItem: (state, action: PayloadAction<{ item: Slot; inventoryType: 'left' | 'right' }>) => {
      const { item, inventoryType } = action.payload;
      const inventory = inventoryType === 'left' ? state.leftInventory : state.rightInventory;

      // Najít první volnou pozici
      const emptySlotIndex = findFirstEmptySlot(inventory.items);

      if (emptySlotIndex !== -1) {
        // Pokud je nalezena neobsazená pozice, vložit předmět na tuto pozici
        inventory.items[emptySlotIndex] = item;
      } else {
        // Pokud není nalezena neobsazená pozice, přidat předmět na konec
        inventory.items.push(item);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(isPending, (state) => {
      state.isBusy = true;

      state.history = {
        leftInventory: current(state.leftInventory),
        rightInventory: current(state.rightInventory),
      };
    });
    builder.addMatcher(isFulfilled, (state) => {
      state.isBusy = false;
    });
    builder.addMatcher(isRejected, (state) => {
      if (state.history && state.history.leftInventory && state.history.rightInventory) {
        state.leftInventory = state.history.leftInventory;
        state.rightInventory = state.history.rightInventory;
      }
      state.isBusy = false;
    });
  },
});

export const {
  setAdditionalMetadata,
  setContextMenu,
  setItemAmount,
  setShiftPressed,
  setupInventory,
  swapSlots,
  moveSlots,
  stackSlots,
  refreshSlots,
  setContainerWeight,
  addItem, // Export akce pro přidání předmětu
} = inventorySlice.actions;

export const selectLeftInventory = (state: RootState) => state.inventory.leftInventory;
export const selectRightInventory = (state: RootState) => state.inventory.rightInventory;
export const selectItemAmount = (state: RootState) => state.inventory.itemAmount;
export const selectIsBusy = (state: RootState) => state.inventory.isBusy;

export default inventorySlice.reducer;
