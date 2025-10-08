import api from './api';

export const paymentService = {
  createRazorpayOrder: async (orderId) => {
    const response = await api.post('/payments/create-order', { orderId });
    return response.data;
  },

  verifyPayment: async (paymentData) => {
    const response = await api.post('/payments/verify-payment', paymentData);
    return response.data;
  },

  getPaymentStatus: async (orderId) => {
    const response = await api.get(`/payments/status/${orderId}`);
    return response.data;
  }
};
