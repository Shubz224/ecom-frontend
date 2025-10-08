import {createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/cart';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartSummary, setCartSummary] = useState({
    totalItems: 0,
    totalAmount: 0,
    itemCount: 0
  });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Fetch cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart([]);
      setCartSummary({ totalItems: 0, totalAmount: 0, itemCount: 0 });
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();
      setCart(response.cart);
      setCartSummary(response.summary);
    } catch (error) {
      console.error('Fetch cart error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await cartService.addToCart(productId, quantity);
      setCart(response.cart);
      // Update summary manually or refetch
      await fetchCart();
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      const response = await cartService.updateCartItem(productId, quantity);
      setCart(response.cart);
      await fetchCart();
      toast.success('Cart updated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update cart');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await cartService.removeFromCart(productId);
      setCart(response.cart);
      await fetchCart();
      toast.success('Removed from cart!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCart([]);
      setCartSummary({ totalItems: 0, totalAmount: 0, itemCount: 0 });
      toast.success('Cart cleared!');
    } catch (error) {
      toast.error('Failed to clear cart');
    }
  };

  const value = {
    cart,
    cartSummary,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
