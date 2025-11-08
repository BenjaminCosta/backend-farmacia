import apiClient from '../lib/axios';

/**
 * Crear un Payment Intent con Stripe
 * @param {Object} data - { amount, currency, orderId }
 * @returns {Promise<Object>} - { clientSecret, paymentIntentId }
 */
export const createPaymentIntent = async (data) => {
  const response = await apiClient.post('/payments/create-intent', data);
  return response.data;
};

/**
 * Confirmar el pago de una orden
 * @param {number} orderId - ID de la orden
 * @param {Object} data - { paymentProvider, paymentId, amount }
 * @returns {Promise<Object>} - Orden actualizada
 */
export const confirmOrderPayment = async (orderId, data) => {
  const response = await apiClient.post(`/payments/orders/${orderId}/pay`, data);
  return response.data;
};
