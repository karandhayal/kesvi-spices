import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth, BASE_URL } from './AuthContext'; // Import BASE_URL

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth(); 

  // ✅ OPTIMIZED: Memoize userId to prevent calculation on every render
  const userId = useMemo(() => {
    if (user && user._id) return user._id;
    
    let guestId = localStorage.getItem("parosa_guest_id");
    if (!guestId) {
      guestId = "guest_" + Date.now() + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("parosa_guest_id", guestId);
    }
    return guestId;
  }, [user]);

  // --- 1. FETCH CART ---
  const fetchCart = async () => {
    if (!userId) return;
    try {
      // ✅ FIXED: Use BASE_URL
      const res = await axios.get(`${BASE_URL}/cart/${userId}`);
      
      const validItems = (res.data?.products || []).filter(item => 
        item.title && item.price && item.productId
      );

      setCartItems(validItems);
      setLoading(false);
    } catch (err) {
      console.error("Cart fetch error:", err);
      setCartItems([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userId]);

  // --- 2. ADD TO CART ---
  const addToCart = async (product, quantity = 1, variant = '500g') => {
    try {
      if (!product || (!product.name && !product.title)) {
        console.error("Attempted to add invalid product:", product);
        return;
      }

      const productId = product._id || product.id.toString(); 
      
      const payload = {
        userId,
        productId,
        quantity,
        variant,
        title: product.name || product.title, 
        price: Number(product.price) || 0, 
        image: product.image || product.img
      };

      // ✅ FIXED: Use BASE_URL
      await axios.post(`${BASE_URL}/cart/add`, payload);
      await fetchCart(); 
      alert("Added to cart!");
    } catch (err) {
      console.error("Add to cart failed:", err);
      alert("Failed to add item.");
    }
  };

  // --- 3. REMOVE FROM CART ---
  const removeFromCart = async (productId) => {
    // Optimistic Update (Visual)
    setCartItems(currentItems => currentItems.filter(item => item.productId !== productId));
    try {
      // ✅ FIXED: Use BASE_URL
      await axios.delete(`${BASE_URL}/cart/remove/${userId}/${productId}`);
    } catch (err) {
      console.error(err);
      fetchCart(); // Revert on error
    }
  };

  // --- 4. UPDATE QUANTITY ---
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    
    // Optimistic Update
    setCartItems(currentItems => 
      currentItems.map(item => 
        item.productId === productId ? { ...item, quantity } : item
      )
    );

    try {
      // ✅ FIXED: Use BASE_URL
      await axios.put(`${BASE_URL}/cart/update`, {
        userId,
        productId,
        quantity
      });
    } catch (err) {
      console.error(err);
      fetchCart();
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0);
  
  const cartTotal = cartItems.reduce((acc, item) => {
     return acc + ((Number(item.price) || 0) * (Number(item.quantity) || 0));
  }, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      cartCount, 
      cartTotal, 
      loading 
    }}>
      {children}
    </CartContext.Provider>
  );
};