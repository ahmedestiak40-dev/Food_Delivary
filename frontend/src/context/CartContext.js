import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0, restaurantId: null });
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({ items: [], total: 0, restaurantId: null });
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/cart');
      setCart(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = async (menuItem, restaurantId) => {
    try {
      const res = await axios.post('http://localhost:5000/api/cart/add', { menuItem, restaurantId });
      setCart(res.data);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/cart/remove/${itemId}`);
      setCart(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete('http://localhost:5000/api/cart/clear');
      setCart({ items: [], total: 0, restaurantId: null });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};