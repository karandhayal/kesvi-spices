import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth, BASE_URL } from './AuthContext'; 

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth(); 

  // ✅ MEMOIZED USER ID (Handles Guest/User switch)
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

  // --- 2. ADD TO CART (FIXED VARIANT BUG) ---
  const addToCart = async (productData) => {
    try {
      // ✅ FIX: Correctly extract data from the object sent by ProductCard/Details
      const { 
        productId, 
        id, 
        _id, 
        name, 
        title, 
        price, 
        image, 
        img, 
        variant, // This comes from ProductDetails (e.g., "1L")
        quantity 
      } = productData;

      // Robust ID check
      const finalProductId = productId || id || _id;
      if (!finalProductId) {
        console.error("No Product ID found in addToCart");
        return;
      }

      const payload = {
        userId,
        productId: finalProductId.toString(),
        quantity: Number(quantity) || 1,
        variant: variant || '500g', // Uses the variant passed in object, else default
        title: name || title, 
        price: Number(price) || 0, 
        image: image || img
      };

      await axios.post(`${BASE_URL}/cart/add`, payload);
      await fetchCart(); 
      // alert("Added to cart!"); // Optional: Remove if you use the Toast
    } catch (err) {
      console.error("Add to cart failed:", err);
      alert("Failed to add item.");
    }
  };

  // --- 3. REMOVE FROM CART ---
  const removeFromCart = async (productId) => {
    // Optimistic Update
    setCartItems(currentItems => currentItems.filter(item => item.productId !== productId));
    try {
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

  // --- CALCULATIONS ---
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
      loading,
      clearCart: () => setCartItems([]) // Helper to clear UI instantly on logout/order
    }}>
      {children}
    </CartContext.Provider>
  );
};