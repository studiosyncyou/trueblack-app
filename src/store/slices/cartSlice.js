import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      
      // Check if item with same id and customizations already exists
      const existingItemIndex = state.items.findIndex(
        (cartItem) =>
          cartItem.id === item.id &&
          cartItem.size === item.size &&
          JSON.stringify(cartItem.customizations) === JSON.stringify(item.customizations)
      );

      if (existingItemIndex >= 0) {
        // Item exists, increase quantity
        state.items[existingItemIndex].quantity += item.quantity || 1;
      } else {
        // New item, add to cart
        state.items.push({
          ...item,
          quantity: item.quantity || 1,
          cartId: Date.now() + Math.random(), // Unique cart ID
        });
      }

      // Recalculate totals
      cartSlice.caseReducers.calculateTotals(state);
    },

    removeFromCart: (state, action) => {
      const cartId = action.payload;
      state.items = state.items.filter((item) => item.cartId !== cartId);
      cartSlice.caseReducers.calculateTotals(state);
    },

    updateQuantity: (state, action) => {
      const { cartId, quantity } = action.payload;
      const item = state.items.find((item) => item.cartId === cartId);
      
      if (item) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
          state.items = state.items.filter((item) => item.cartId !== cartId);
        } else {
          item.quantity = quantity;
        }
      }
      
      cartSlice.caseReducers.calculateTotals(state);
    },

    incrementQuantity: (state, action) => {
      const cartId = action.payload;
      const item = state.items.find((item) => item.cartId === cartId);
      if (item) {
        item.quantity += 1;
      }
      cartSlice.caseReducers.calculateTotals(state);
    },

    decrementQuantity: (state, action) => {
      const cartId = action.payload;
      const item = state.items.find((item) => item.cartId === cartId);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          // Remove item if quantity becomes 0
          state.items = state.items.filter((item) => item.cartId !== cartId);
        }
      }
      cartSlice.caseReducers.calculateTotals(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    },

    calculateTotals: (state) => {
      let totalItems = 0;
      let totalPrice = 0;

      state.items.forEach((item) => {
        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;
      });

      state.totalItems = totalItems;
      state.totalPrice = totalPrice;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  calculateTotals,
} = cartSlice.actions;

export default cartSlice.reducer;
