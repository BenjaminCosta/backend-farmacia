import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cookieStorage } from '../../lib/cookieStorage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4002';

// Cargar token desde cookies (NO localStorage según reglas)
const loadTokenFromStorage = () => {
  try {
    const token = cookieStorage.getItem('authToken');
    return token || null;
  } catch (error) {
    console.error('Error loading token from cookies:', error);
    return null;
  }
};

// Guardar token en cookies (NO localStorage según reglas)
const saveTokenToStorage = (token) => {
  try {
    if (token) {
      cookieStorage.setItem('authToken', token, 7); // 7 días
    } else {
      cookieStorage.removeItem('authToken');
    }
  } catch (error) {
    console.error('Error saving token to cookies:', error);
  }
};

// Estado inicial (con token desde cookies)
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
      const response = await fetch(`${API_URL}/api/v1/auth/authenticate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Error al iniciar sesión');
      }
      return await response.json(); // { token, user }
    } catch (error) {
      return rejectWithValue('Error al iniciar sesión');
    }
  }
);

// Thunk: Register
export const register = createAsyncThunk(
  'auth/register',
  async ({ email, password, name }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
        credentials: 'include',
      });
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Error al registrarse');
      }
      return await response.json(); // { token, user }
    } catch (error) {
      return rejectWithValue('Error al registrarse');
    }
  }
);

// Thunk: Obtener usuario actual
export const me = createAsyncThunk(
  'auth/me',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await fetch(`${API_URL}/api/v1/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        credentials: 'include',
      });
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Error al obtener usuario');
      }
      return await response.json(); // user
    } catch (error) {
      return rejectWithValue('Error al obtener usuario');
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
