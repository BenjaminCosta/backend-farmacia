import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4002';

// Estado inicial
const initialState = {
  data: [],
  currentProduct: null,
  loading: false,
  error: null,
};

// Thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    
    const searchParams = new URLSearchParams();
    if (params.categoryId) searchParams.append('categoryId', params.categoryId);
    if (params.rx !== undefined) searchParams.append('rx', params.rx);
    if (params.q) searchParams.append('q', params.q);
    if (params.inStock !== undefined) searchParams.append('inStock', params.inStock);
    
    const queryString = searchParams.toString();
    const url = `${API_URL}/api/v1/products${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      return rejectWithValue(error.message || 'Error al obtener productos');
    }
    
    return await response.json();
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    
    const response = await fetch(`${API_URL}/api/v1/products/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      return rejectWithValue(error.message || 'Error al obtener producto');
    }
    
    return await response.json();
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    
    const response = await fetch(`${API_URL}/api/v1/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      credentials: 'include',
      body: JSON.stringify(productData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      return rejectWithValue(error.message || 'Error al crear producto');
    }
    
    return await response.json();
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, ...productData }, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    
    const response = await fetch(`${API_URL}/api/v1/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      credentials: 'include',
      body: JSON.stringify(productData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      return rejectWithValue(error.message || 'Error al actualizar producto');
    }
    
    return await response.json();
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    
    const response = await fetch(`${API_URL}/api/v1/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      return rejectWithValue(error.message || 'Error al eliminar producto');
    }
    
    return { id };
  }
);

// Slice
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch product by ID
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create product
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
        state.error = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update product
    builder
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.data.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
        if (state.currentProduct?.id === action.payload.id) {
          state.currentProduct = action.payload;
        }
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete product
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter((p) => p.id !== action.payload.id);
        if (state.currentProduct?.id === action.payload.id) {
          state.currentProduct = null;
        }
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentProduct } = productsSlice.actions;
export default productsSlice.reducer;

// Selectors
export const selectProducts = (state) => state.products.data;
export const selectCurrentProduct = (state) => state.products.currentProduct;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;
export const selectProductById = (id) => (state) =>
  state.products.data.find((p) => p.id === id);
