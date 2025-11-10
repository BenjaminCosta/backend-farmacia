import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import client from '../../api/client';

// Estado inicial
const initialState = {
  byId: {}, // { [id]: OrderSummaryDTO }
  list: [], // Array de OrderSummaryDTO
  lastCreatedId: null, // Para navegación post-checkout
  loading: false,
  error: null,
};

// Thunk: Fetch user orders
export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await client.get('/api/v1/orders/me');
      return response.data; // OrderSummaryDTO[]
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al obtener órdenes'
      );
    }
  }
);

// Thunk: Fetch order by ID
export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await client.get(`/api/v1/orders/${id}`);
      return response.data; // OrderSummaryDTO
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al obtener la orden'
      );
    }
  }
);

// Thunk: Create order (checkout)
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await client.post('/api/v1/orders', orderData);
      return response.data; // OrderSummaryDTO completo
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al crear la orden'
      );
    }
  }
);

// Thunk: Update order status (admin/pharmacist)
export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await client.put(`/api/v1/orders/${id}/status`, { status });
      return response.data; // OrderSummaryDTO actualizado
    } catch (error) {
      // 400 si la transición no es válida
      return rejectWithValue(
        error.response?.data?.message || 'Error al actualizar el estado de la orden'
      );
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
    // Fetch my orders
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        // Indexar por ID para lookup rápido
        action.payload.forEach((order) => {
          state.byId[order.id] = order;
        });
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch order by ID
    builder
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.byId[action.payload.id] = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

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

    // Update order status
    builder
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const order = action.payload;
        state.byId[order.id] = order;
        // Actualizar en la lista también
        const index = state.list.findIndex((o) => o.id === order.id);
        if (index !== -1) {
          state.list[index] = order;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
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
