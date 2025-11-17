import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base URL desde variable de entorno (SIN /api al final)
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4002';

// Base query con credentials y auth
const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    // Obtener token del estado de Redux
    const token = getState().auth.token;
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  },
});

// Base query con manejo de errores 401
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  if (result.error && result.error.status === 401) {
    // Limpiar auth y redirigir a login
    api.dispatch({ type: 'auth/logout' });
    window.location.href = '/login';
  }
  
  return result;
};

// API base con RTK Query
export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Product', 'Order', 'Category', 'Image', 'User', 'Role'],
  endpoints: () => ({}), // Los endpoints se inyectan desde archivos separados
});
