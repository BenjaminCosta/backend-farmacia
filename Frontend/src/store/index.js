import { configureStore } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import authReducer from './auth/authSlice';
import cartReducer from './cart/cartSlice';
import ordersReducer from './orders/ordersSlice';
import toastReducer from './toast/toastSlice';
import wishlistReducer from './wishlist/wishlistSlice';

// Configurar store con middleware RTK Query + defaults
const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    orders: ordersReducer,
    toast: toastReducer,
    wishlist: wishlistReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Deshabilitar check de serialización por Axios cancel tokens
      serializableCheck: false,
    }).concat(api.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
