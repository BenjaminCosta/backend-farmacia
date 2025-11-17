import { api } from './api';

export const ordersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/v1/orders - Listar mis órdenes
    getMyOrders: builder.query({
      query: () => '/api/v1/orders',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Order', id })),
              { type: 'Order', id: 'MY_LIST' },
            ]
          : [{ type: 'Order', id: 'MY_LIST' }],
    }),

    // GET /api/v1/orders/all - Listar todas las órdenes (admin/pharmacist)
    getAllOrders: builder.query({
      query: () => '/api/v1/orders/all',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Order', id })),
              { type: 'Order', id: 'ALL_LIST' },
            ]
          : [{ type: 'Order', id: 'ALL_LIST' }],
    }),

    // GET /api/v1/orders/:id - Obtener orden por ID
    getOrder: builder.query({
      query: (id) => `/api/v1/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),

    // POST /api/v1/orders - Crear orden
    createOrder: builder.mutation({
      query: (body) => ({
        url: '/api/v1/orders',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Order', id: 'MY_LIST' },
        { type: 'Order', id: 'ALL_LIST' },
      ],
    }),

    // PUT /api/v1/orders/:id/status - Actualizar estado de orden
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `/api/v1/orders/${orderId}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'Order', id: orderId },
        { type: 'Order', id: 'MY_LIST' },
        { type: 'Order', id: 'ALL_LIST' },
      ],
    }),

    // PUT /api/v1/orders/:id/pickup/complete - Marcar pickup como completado
    markPickupComplete: builder.mutation({
      query: (id) => ({
        url: `/api/v1/orders/${id}/pickup/complete`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Order', id },
        { type: 'Order', id: 'MY_LIST' },
        { type: 'Order', id: 'ALL_LIST' },
      ],
    }),
  }),
});

export const {
  useGetMyOrdersQuery,
  useGetAllOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
  useMarkPickupCompleteMutation,
} = ordersApi;
