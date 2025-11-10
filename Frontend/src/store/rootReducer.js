import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import cartReducer from './cart/cartSlice';
import productsReducer from './products/productsSlice';
import categoriesReducer from './categories/categoriesSlice';
import ordersReducer from './orders/ordersSlice';
import toastReducer from './toast/toastSlice';

// Combinar todos los slices
const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  products: productsReducer,
  categories: categoriesReducer,
  orders: ordersReducer,
  toast: toastReducer,
});

export default rootReducer;
