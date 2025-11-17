import { api } from './api';

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/v1/admin/users - Listar usuarios
    getUsers: builder.query({
      query: () => '/api/v1/admin/users',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'User', id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),

    // GET /api/v1/admin/users/:id - Obtener usuario por ID
    getUser: builder.query({
      query: (id) => `/api/v1/admin/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    // POST /api/v1/admin/users - Crear usuario
    createUser: builder.mutation({
      query: (body) => ({
        url: '/api/v1/admin/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    // PUT /api/v1/admin/users/:id/role - Actualizar rol de usuario
    updateUserRole: builder.mutation({
      query: ({ id, roleId }) => ({
        url: `/api/v1/admin/users/${id}/role`,
        method: 'PUT',
        body: { roleId },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),

    // DELETE /api/v1/admin/users/:id - Eliminar usuario
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/api/v1/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    // GET /api/v1/admin/roles - Listar roles
    getRoles: builder.query({
      query: () => '/api/v1/admin/roles',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Role', id })),
              { type: 'Role', id: 'LIST' },
            ]
          : [{ type: 'Role', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
  useGetRolesQuery,
} = adminApi;
