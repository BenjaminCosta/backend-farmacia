import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4002';

// Estado inicial
const initialState = {
  paymentIntent: null, // Payment intent temporal
  loading: false,
  error: null,
};

// Thunks
export const createPaymentIntent = createAsyncThunk(
  'payments/createPaymentIntent',
  async (paymentData, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    
    const response = await fetch(`${API_URL}/api/v1/payments/create-intent-temp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      credentials: 'include',
      body: JSON.stringify(paymentData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      return rejectWithValue(error.message || 'Error al crear payment intent');
    }
    
    return await response.json();
  }
);

export const confirmOrderPayment = createAsyncThunk(
  'payments/confirmOrderPayment',
  async ({ orderId, paymentIntentId }, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    
    const response = await fetch(`${API_URL}/api/v1/payments/orders/${orderId}/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      credentials: 'include',
      body: JSON.stringify({ paymentIntentId }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      return rejectWithValue(error.message || 'Error al confirmar pago');
    }
    
    return await response.json();
  }
);

// Slice
const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearPaymentIntent: (state) => {
      state.paymentIntent = null;
    },
  },
  extraReducers: (builder) => {
    // Create payment intent
    builder
      .addCase(createPaymentIntent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentIntent = action.payload;
        state.error = null;
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Confirm order payment
    builder
      .addCase(confirmOrderPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmOrderPayment.fulfilled, (state, action) => {
        state.loading = false;
        // Limpiar payment intent después de confirmar
        state.paymentIntent = null;
        state.error = null;
      })
      .addCase(confirmOrderPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearPaymentIntent } = paymentsSlice.actions;
export default paymentsSlice.reducer;

// Selectors
export const selectPaymentIntent = (state) => state.payments.paymentIntent;
export const selectPaymentsLoading = (state) => state.payments.loading;
export const selectPaymentsError = (state) => state.payments.error;
