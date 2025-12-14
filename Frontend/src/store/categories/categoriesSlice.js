import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4002';

// Estado inicial
const initialState = {
  data: [],
  currentCategory: null,
  loading: false,
  error: null,
};

// Thunks
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    
    const response = await fetch(`${API_URL}/api/v1/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      return rejectWithValue(error.message || 'Error al obtener categorías');
    }
    
    return await response.json();
  }
);

export const fetchCategoryById = createAsyncThunk(
  'categories/fetchCategoryById',
  async (id, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    
    const response = await fetch(`${API_URL}/api/v1/categories/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      return rejectWithValue(error.message || 'Error al obtener categoría');
    }
    
    return await response.json();
  }
);

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    
    const response = await fetch(`${API_URL}/api/v1/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      credentials: 'include',
      body: JSON.stringify(categoryData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      return rejectWithValue(error.message || 'Error al crear categoría');
    }
    
    return await response.json();
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, ...categoryData }, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    
    const response = await fetch(`${API_URL}/api/v1/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      credentials: 'include',
      body: JSON.stringify(categoryData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      return rejectWithValue(error.message || 'Error al actualizar categoría');
    }
    
    return await response.json();
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    
    const response = await fetch(`${API_URL}/api/v1/categories/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      return rejectWithValue(error.message || 'Error al eliminar categoría');
    }
    
    return { id };
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
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
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
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch category by ID
    builder
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCategory = action.payload;
        state.error = null;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
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
        state.data.push(action.payload);
        state.error = null;
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
        const index = state.data.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
        if (state.currentCategory?.id === action.payload.id) {
          state.currentCategory = action.payload;
        }
        state.error = null;
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
        state.data = state.data.filter((c) => c.id !== action.payload.id);
        if (state.currentCategory?.id === action.payload.id) {
          state.currentCategory = null;
        }
        state.error = null;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;

// Selectors
export const selectCategories = (state) => state.categories.data;
export const selectCurrentCategory = (state) => state.categories.currentCategory;
export const selectCategoriesLoading = (state) => state.categories.loading;
export const selectCategoriesError = (state) => state.categories.error;
export const selectCategoryById = (id) => (state) =>
  state.categories.data.find((c) => c.id === id);
