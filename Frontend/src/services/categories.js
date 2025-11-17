import { api } from './api';

export const categoriesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/v1/categories - Listar categorías
    getCategories: builder.query({
      query: () => '/api/v1/categories',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Category', id })),
              { type: 'Category', id: 'LIST' },
            ]
          : [{ type: 'Category', id: 'LIST' }],
    }),

    // GET /api/v1/categories/:id - Obtener categoría por ID
    getCategory: builder.query({
      query: (id) => `/api/v1/categories/${id}`,
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),

    // POST /api/v1/categories - Crear categoría
    createCategory: builder.mutation({
      query: (body) => ({
        url: '/api/v1/categories',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),

    // PUT /api/v1/categories/:id - Actualizar categoría
    updateCategory: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/api/v1/categories/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Category', id },
        { type: 'Category', id: 'LIST' },
      ],
    }),

    // DELETE /api/v1/categories/:id - Eliminar categoría
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/api/v1/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
