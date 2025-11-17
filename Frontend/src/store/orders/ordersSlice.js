import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4002';

// Estado inicial
const initialState = {
  byId: {}, // { [id]: OrderSummaryDTO }
  list: [], // Array de OrderSummaryDTO
  lastCreatedId: null, // Para navegación post-checkout
  loading: false,
  error: null,
};

// Thunk: Create order (checkout) - Único que se usa desde Checkout.jsx
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await fetch(`${API_URL}/api/v1/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        credentials: 'include',
        body: JSON.stringify(orderData),
      });
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Error al crear la orden');
      }
      return await response.json(); // OrderSummaryDTO completo
    } catch (error) {
      return rejectWithValue('Error al crear la orden');
    }
  }
);

// Slice
const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearLastCreatedId: (state) => {
      state.lastCreatedId = null;
    },
  },
  extraReducers: (builder) => {
    // Create order
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastCreatedId = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        const order = action.payload;
        state.byId[order.id] = order;
        state.list.unshift(order); // Agregar al inicio
        state.lastCreatedId = order.id; // Para navegar a /orders/:id
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearLastCreatedId } = ordersSlice.actions;
export default ordersSlice.reducer;

// Selectors
export const selectOrders = (state) => state.orders.list;
export const selectOrdersLoading = (state) => state.orders.loading;
export const selectOrdersError = (state) => state.orders.error;
export const selectOrderById = (id) => (state) => state.orders.byId[id];
export const selectLastCreatedOrder = (state) => {
  const id = state.orders.lastCreatedId;
  return id ? state.orders.byId[id] : null;
};
export const selectLastCreatedOrderId = (state) => state.orders.lastCreatedId;
