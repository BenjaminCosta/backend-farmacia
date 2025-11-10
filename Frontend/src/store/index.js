import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

// Configurar store con middleware por defecto
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Deshabilitar check de serialización por Axios cancel tokens
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
