import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import client from '../../api/client';

// Cargar token desde localStorage
const loadTokenFromStorage = () => {
  try {
    const token = localStorage.getItem('authToken');
    return token || null;
  } catch (error) {
    console.error('Error loading token from localStorage:', error);
    return null;
  }
};

// Guardar token en localStorage
const saveTokenToStorage = (token) => {
  try {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  } catch (error) {
    console.error('Error saving token to localStorage:', error);
  }
};

// Estado inicial (con token desde localStorage)
const initialState = {
  user: null, // { id, email, name, role }
  token: loadTokenFromStorage(),
  loading: false,
  error: null,
};

// Thunk: Login
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await client.post('/api/v1/auth/authenticate', credentials);
      return response.data; // { token, user }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al iniciar sesión'
      );
    }
  }
);

// Thunk: Register
export const register = createAsyncThunk(
  'auth/register',
  async ({ email, password, name }, { rejectWithValue }) => {
    try {
      const response = await client.post('/api/v1/auth/register', { 
        email, 
        password, 
        name 
      });
      return response.data; // { token, user }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al registrarse'
      );
    }
  }
);

// Thunk: Obtener usuario actual
export const me = createAsyncThunk(
  'auth/me',
  async (_, { rejectWithValue }) => {
    try {
      const response = await client.get('/api/v1/auth/me');
      return response.data; // user
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al obtener usuario'
      );
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Setear credenciales manualmente
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      saveTokenToStorage(action.payload.token);
    },
    // Logout: limpiar todo
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.loading = false;
      saveTokenToStorage(null);
    },
    // Limpiar error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user || null;
        state.error = null;
        saveTokenToStorage(action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user || null;
        state.error = null;
        saveTokenToStorage(action.payload.token);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Me
    builder
      .addCase(me.pending, (state) => {
        state.loading = true;
      })
      .addCase(me.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(me.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Si falla me(), probablemente el token es inválido
        state.token = null;
        state.user = null;
        saveTokenToStorage(null);
      });
  },
});

export const { setCredentials, logout, clearError } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => !!state.auth.token;
