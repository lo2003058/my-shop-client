// redux/cartSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  quantity: number;
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
};

const MAX_QUANTITY = 10; // Maximum quantity per product

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id,
      );
      if (existingItem) {
        const newQuantity = existingItem.quantity + action.payload.quantity;
        if (newQuantity > MAX_QUANTITY) {
          const allowableAdd = MAX_QUANTITY - existingItem.quantity;
          if (allowableAdd > 0) {
            existingItem.quantity += allowableAdd;
            state.totalAmount += action.payload.price * allowableAdd;
          }
          // Optionally, you can notify the user here if desired
        } else {
          existingItem.quantity = newQuantity;
          state.totalAmount += action.payload.price * action.payload.quantity;
        }
      } else {
        const quantityToAdd = Math.min(action.payload.quantity, MAX_QUANTITY);
        state.items.push({ ...action.payload, quantity: quantityToAdd });
        state.totalAmount += action.payload.price * quantityToAdd;
      }
    },
    removeItem: (state, action: PayloadAction<number>) => {
      const itemIndex = state.items.findIndex(
        (item) => item.id === action.payload,
      );
      if (itemIndex !== -1) {
        const item = state.items[itemIndex];
        state.totalAmount -= item.price * item.quantity;
        state.items.splice(itemIndex, 1);
      }
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>,
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        const newQuantity = Math.min(action.payload.quantity, MAX_QUANTITY);
        state.totalAmount += item.price * (newQuantity - item.quantity);
        item.quantity = newQuantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
