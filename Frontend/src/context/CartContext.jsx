import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
const CartContext = createContext(undefined);
export const CartProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            setItems(JSON.parse(storedCart));
        }
    }, []);
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);
    const addItem = (item, quantity = 1) => {
        setItems((prevItems) => {
            const existingItem = prevItems.find((i) => i.id === item.id);
            if (existingItem) {
                toast.success('Cantidad actualizada en el carrito');
                return prevItems.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i);
            }
            toast.success('Producto agregado al carrito');
            return [...prevItems, { ...item, quantity }];
        });
    };
    const removeItem = (id) => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
        toast.info('Producto eliminado del carrito');
    };
    const updateQuantity = (id, quantity) => {
        if (quantity <= 0) {
            removeItem(id);
            return;
        }
        setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)));
    };
    const clearCart = () => {
        setItems([]);
        toast.info('Carrito vaciado');
    };
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const value = {
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
    };
    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
