"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export interface CartItem {
  id: string;
  itemName: string;
  quantity: number;
  costPerUnit: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    // Load cart from localStorage when the component mounts
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const saveCart = useCallback(
    (newCart: CartItem[] | ((prevCart: CartItem[]) => CartItem[])) => {
      if (typeof newCart === "function") {
        const updatedCart = newCart(cart); // Use the current cart state
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      } else {
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
      }
    },
    [cart]
  );

  const addToCart = useCallback(
    (item: CartItem) => {
      saveCart((prevCart: CartItem[]) => {
        const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
        if (existingItem) {
          return prevCart.map((cartItem) =>
            cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
          );
        }
        return [...prevCart, item];
      });
    },
    [saveCart]
  );

  const removeFromCart = useCallback(
    (id: string) => {
      saveCart((prevCart: CartItem[]) => prevCart.filter((item) => item.id !== id));
    },
    [saveCart]
  );

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      saveCart((prevCart: CartItem[]) =>
        prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    },
    [saveCart]
  );

  const clearCart = useCallback(() => {
    saveCart([]);
  }, [saveCart]);

  const isInCart = useCallback(
    (id: string) => {
      return cart.some((item) => item.id === id);
    },
    [cart]
  );

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, isInCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
