import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import client from '../../api/client';

// Estado inicial
const initialState = {
  list: [], // CategoryDTO[]
  loading: false,
  error: null,
};

// Thunk: Fetch categories
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await client.get('/api/v1/categories');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al obtener categorías'
      );
    }
  }
);

// Thunk: Create category
export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await client.post('/api/v1/categories', categoryData);
      return response.data; // CategoryDTO
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al crear categoría'
      );
    }
  }
);

// Thunk: Update category
export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await client.put(`/api/v1/categories/${id}`, data);
      return response.data; // CategoryDTO
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al actualizar categoría'
      );
    }
  }
);

// Thunk: Delete category
export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      await client.delete(`/api/v1/categories/${id}`);
      return id; // Retornar ID para remover del estado
    } catch (error) {
      // Si es 409 Conflict, el mensaje viene del backend
      if (error.response?.status === 409) {
        return rejectWithValue(
          error.response?.data?.message || 'No se puede eliminar: la categoría tiene productos asociados'
        );
      }
      return rejectWithValue(
        error.response?.data?.message || 'Error al eliminar categoría'
      );
    }
  }
);

// Slice
const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create category
    builder
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update category
    builder
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete category
    builder
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        // 204 No Content: remover del estado
        state.list = state.list.filter((c) => c.id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        // 409 Conflict: setear error con mensaje del backend
        state.error = action.payload;
      });
  },
});

export const { clearError } = categoriesSlice.actions;
export default categoriesSlice.reducer;

// Selectors
export const selectCategories = (state) => state.categories.list;
export const selectCategoriesLoading = (state) => state.categories.loading;
export const selectCategoriesError = (state) => state.categories.error;
export const selectCategoryById = (id) => (state) =>
  state.categories.list.find((c) => c.id === id);
