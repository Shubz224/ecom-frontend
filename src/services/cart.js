import api from './api';

export const cartService = {
  getCart: async () => {
    const response = await api.get('/users/cart');
    return response.data;
  },

  addToCart: async (productId, quantity = 1) => {
    const response = await api.post('/users/cart', { productId, quantity });
    return response.data;
  },

  updateCartItem: async (productId, quantity) => {
    const response = await api.put('/users/cart', { productId, quantity });
    return response.data;
  },

  removeFromCart: async (productId) => {
    const response = await api.delete(`/users/cart/${productId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete('/users/cart');
    return response.data;
  }
};
