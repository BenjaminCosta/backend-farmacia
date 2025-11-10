import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import client from '../../api/client';

// Estado inicial
const initialState = {
  list: [], // ProductDTO[]
  loading: false,
  error: null,
};

// Thunk: Fetch products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.categoryId) params.append('categoryId', filters.categoryId);
      if (filters.q) params.append('q', filters.q);
      if (filters.inStock !== undefined) params.append('inStock', filters.inStock);
      
      const response = await client.get(`/api/v1/products?${params.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al obtener productos'
      );
    }
  }
);

// Thunk: Create product
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await client.post('/api/v1/products', productData);
      return response.data; // ProductDTO
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al crear producto'
      );
    }
  }
);

// Thunk: Update product
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await client.put(`/api/v1/products/${id}`, data);
      return response.data; // ProductDTO
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al actualizar producto'
      );
    }
  }
);

// Thunk: Delete product
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await client.delete(`/api/v1/products/${id}`);
      return id; // Retornar ID para remover del estado
    } catch (error) {
      // Si es 409 Conflict, el mensaje viene del backend
      if (error.response?.status === 409) {
        return rejectWithValue(
          error.response?.data?.message || 'No se puede eliminar: el producto pertenece a órdenes existentes'
        );
      }
      return rejectWithValue(
        error.response?.data?.message || 'Error al eliminar producto'
      );
    }
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
        state.list = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
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
        state.list.push(action.payload);
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
        const index = state.list.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
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
        // 204 No Content: remover del estado
        state.list = state.list.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        // 409 Conflict: setear error con mensaje del backend
        state.error = action.payload;
      });
  },
});

export const { clearError } = productsSlice.actions;
export default productsSlice.reducer;

// Selectors
export const selectProducts = (state) => state.products.list;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;
export const selectProductById = (id) => (state) =>
  state.products.list.find((p) => p.id === id);
