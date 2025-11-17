import { api } from './api';

export const paymentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // POST /api/v1/payments/create-intent-temp - Crear payment intent temporal
    createPaymentIntent: builder.mutation({
      query: (body) => ({
        url: '/api/v1/payments/create-intent-temp',
        method: 'POST',
        body,
      }),
    }),

    // POST /api/v1/payments/orders/:orderId/pay - Confirmar pago de orden
    confirmOrderPayment: builder.mutation({
      query: ({ orderId, paymentIntentId }) => ({
        url: `/api/v1/payments/orders/${orderId}/pay`,
        method: 'POST',
        body: { paymentIntentId },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'Order', id: orderId },
        { type: 'Order', id: 'MY_LIST' },
        { type: 'Order', id: 'ALL_LIST' },
      ],
    }),
  }),
});

export const {
  useCreatePaymentIntentMutation,
  useConfirmOrderPaymentMutation,
} = paymentsApi;
