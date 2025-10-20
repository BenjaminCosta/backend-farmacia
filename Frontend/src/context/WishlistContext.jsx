import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
const WishlistContext = createContext(undefined);
export const WishlistProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    useEffect(() => {
        const storedWishlist = localStorage.getItem('wishlist');
        if (storedWishlist) {
            setItems(JSON.parse(storedWishlist));
        }
    }, []);
    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(items));
    }, [items]);
    const addItem = (item) => {
        setItems((prevItems) => {
            const exists = prevItems.find((i) => i.id === item.id);
            if (exists) {
                toast.info('Este producto ya está en favoritos');
                return prevItems;
            }
            toast.success('Producto agregado a favoritos');
            return [...prevItems, item];
        });
    };
    const removeItem = (id) => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
        toast.info('Producto eliminado de favoritos');
    };
    const isInWishlist = (id) => {
        return items.some((item) => item.id === id);
    };
    const clearWishlist = () => {
        setItems([]);
        toast.info('Favoritos vaciados');
    };
    const value = {
        items,
        addItem,
        removeItem,
        isInWishlist,
        clearWishlist,
    };
    return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
