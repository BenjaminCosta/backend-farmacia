import client from './client';

/**
 * Crear un Payment Intent con Stripe
 * @param {Object} data - { amount, currency, orderId }
 * @returns {Promise<Object>} - { clientSecret, paymentIntentId }
 */
export const createPaymentIntent = async (data) => {
  const response = await client.post('/api/v1/payments/create-intent', data);
  return response.data;
};

/**
 * Confirmar el pago de una orden
 * @param {number} orderId - ID de la orden
 * @param {Object} data - { paymentProvider, paymentId, amount }
 * @returns {Promise<Object>} - Orden actualizada
 */
export const confirmOrderPayment = async (orderId, data) => {
  const response = await client.post(`/api/v1/payments/orders/${orderId}/pay`, data);
  return response.data;
};
