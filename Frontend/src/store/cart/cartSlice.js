import { createSlice } from '@reduxjs/toolkit';

// Estado inicial
const initialState = {
  items: [], // { productId, name, price, quantity }
  total: 0,
};

// Helper para calcular total
const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

// Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Agregar item al carrito
    addItem: (state, action) => {
      const { productId, name, price, quantity = 1 } = action.payload;
      
      const existingItem = state.items.find((item) => item.productId === productId);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ productId, name, price, quantity });
      }
      
      state.total = calculateTotal(state.items);
    },
    
    // Remover item del carrito
    removeItem: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.productId !== productId);
      state.total = calculateTotal(state.items);
    },
    
    // Actualizar cantidad de un item
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((item) => item.productId === productId);
      
      if (item) {
        if (quantity <= 0) {
          // Si cantidad es 0 o negativa, remover item
          state.items = state.items.filter((item) => item.productId !== productId);
        } else {
          item.quantity = quantity;
        }
      }
      
      state.total = calculateTotal(state.items);
    },
    
    // Limpiar carrito
    clear: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
});

export const { addItem, removeItem, updateQuantity, clear } = cartSlice.actions;
export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.total;
export const selectCartItemsCount = (state) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);
export const selectCartItemByProductId = (productId) => (state) =>
  state.cart.items.find((item) => item.productId === productId);
