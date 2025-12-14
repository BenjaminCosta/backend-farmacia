import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4002';

// Estado inicial
const initialState = {
  byId: {}, // { [id]: OrderSummaryDTO }
  list: [], // Array de OrderSummaryDTO (mis órdenes)
  allOrders: [], // Array de todas las órdenes (admin/pharmacist)
  currentOrder: null, // Orden actual en detalle
  lastCreatedId: null, // Para navegación post-checkout
  loading: false,
  error: null,
};

// Thunks
export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    const response = await fetch(`${API_URL}/api/v1/orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      credentials: 'include',
    });
    if (!response.ok) {
      const error = await response.json();
      return rejectWithValue(error.message || 'Error al obtener órdenes');
    }
    return await response.json();
  }
);

export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAllOrders',
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    const response = await fetch(`${API_URL}/api/v1/orders/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      credentials: 'include',
    });
    if (!response.ok) {
      const error = await response.json();
      return rejectWithValue(error.message || 'Error al obtener todas las órdenes');
    }
    return await response.json();
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    const response = await fetch(`${API_URL}/api/v1/orders/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      credentials: 'include',
    });
    if (!response.ok) {
      const error = await response.json();
      return rejectWithValue(error.message || 'Error al obtener orden');
    }
    return await response.json();
  }
);

// Thunk: Create order (checkout)
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { getState, rejectWithValue }) => {
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
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    const response = await fetch(`${API_URL}/api/v1/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      credentials: 'include',
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      const error = await response.json();
      return rejectWithValue(error.message || 'Error al actualizar estado de orden');
    }
    return await response.json();
  }
);

export const pickupComplete = createAsyncThunk(
  'orders/pickupComplete',
  async (orderId, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    const response = await fetch(`${API_URL}/api/v1/orders/${orderId}/pickup/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      credentials: 'include',
    });
    if (!response.ok) {
      const error = await response.json();
      return rejectWithValue(error.message || 'Error al completar retiro');
    }
    return await response.json();
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
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
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
        action.payload.forEach((order) => {
          state.byId[order.id] = order;
        });
        state.error = null;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch all orders
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.allOrders = action.payload;
        action.payload.forEach((order) => {
          state.byId[order.id] = order;
        });
        state.error = null;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
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
        state.currentOrder = action.payload;
        state.byId[action.payload.id] = action.payload;
        state.error = null;
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
        state.error = null;
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
        const updatedOrder = action.payload;
        state.byId[updatedOrder.id] = updatedOrder;
        
        // Update in list
        const listIndex = state.list.findIndex((o) => o.id === updatedOrder.id);
        if (listIndex !== -1) {
          state.list[listIndex] = updatedOrder;
        }
        
        // Update in allOrders
        const allIndex = state.allOrders.findIndex((o) => o.id === updatedOrder.id);
        if (allIndex !== -1) {
          state.allOrders[allIndex] = updatedOrder;
        }
        
        // Update currentOrder if it's the same
        if (state.currentOrder?.id === updatedOrder.id) {
          state.currentOrder = updatedOrder;
        }
        
        state.error = null;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Pickup complete
    builder
      .addCase(pickupComplete.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(pickupComplete.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action.payload;
        state.byId[updatedOrder.id] = updatedOrder;
        
        // Update in list
        const listIndex = state.list.findIndex((o) => o.id === updatedOrder.id);
        if (listIndex !== -1) {
          state.list[listIndex] = updatedOrder;
        }
        
        // Update in allOrders
        const allIndex = state.allOrders.findIndex((o) => o.id === updatedOrder.id);
        if (allIndex !== -1) {
          state.allOrders[allIndex] = updatedOrder;
        }
        
        // Update currentOrder if it's the same
        if (state.currentOrder?.id === updatedOrder.id) {
          state.currentOrder = updatedOrder;
        }
        
        state.error = null;
      })
      .addCase(pickupComplete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearLastCreatedId, clearCurrentOrder } = ordersSlice.actions;
export default ordersSlice.reducer;

// Selectors
export const selectOrders = (state) => state.orders.list;
export const selectAllOrders = (state) => state.orders.allOrders;
export const selectCurrentOrder = (state) => state.orders.currentOrder;
export const selectOrdersLoading = (state) => state.orders.loading;
export const selectOrdersError = (state) => state.orders.error;
export const selectOrderById = (id) => (state) => state.orders.byId[id];
export const selectLastCreatedOrder = (state) => {
  const id = state.orders.lastCreatedId;
  return id ? state.orders.byId[id] : null;
};
export const selectLastCreatedOrderId = (state) => state.orders.lastCreatedId;
