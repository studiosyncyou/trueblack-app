import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(
        item => item.id === newItem.id && 
        JSON.stringify(item.customizations) === JSON.stringify(newItem.customizations)
      );

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
        existingItem.totalPrice = existingItem.quantity * existingItem.price;
      } else {
        state.items.push({
          ...newItem,
          totalPrice: newItem.price * newItem.quantity,
        });
      }

      state.totalQuantity += newItem.quantity;
      state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice, 0);
    },

    removeFromCart: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find(item => item.cartItemId === id);

      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalAmount -= existingItem.totalPrice;
        state.items = state.items.filter(item => item.cartItemId !== id);
      }
    },

    updateQuantity: (state, action) => {
      const { cartItemId, quantity } = action.payload;
      const existingItem = state.items.find(item => item.cartItemId === cartItemId);

      if (existingItem && quantity > 0) {
        const quantityDiff = quantity - existingItem.quantity;
        existingItem.quantity = quantity;
        existingItem.totalPrice = existingItem.quantity * existingItem.price;
        
        state.totalQuantity += quantityDiff;
        state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice, 0);
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
