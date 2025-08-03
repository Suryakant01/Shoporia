import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);

    const fetchCart = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setCartCount(0);
            return null;
        }
        try {
            const { data } = await api.get('/my-cart');
            const count = data.data?.items?.reduce((sum, item) => sum + item.Quantity, 0) || 0;
            setCartCount(count);
            return data.data;
        } catch (error) {
            setCartCount(0);
            return null;
        }
    }, []);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (item) => {

        setCartCount(prevCount => prevCount + 1);
        toast.success(`'${item.name}' added to cart!`);

        try {
            await api.post('/carts', { item_id: item.id });
            await fetchCart();
        } catch (error) {

            setCartCount(prevCount => prevCount - 1);
            toast.error('Failed to add item. Please try again.');
            await fetchCart();

        }
    };

    const removeFromCart = async (itemId) => {
        setCartCount(prevCount => Math.max(0, prevCount - 1));

        try {
            await api.delete(`/carts/items/${itemId}`);
            await fetchCart();
            toast.success('Item quantity updated.');
        } catch (error) {
            toast.error('Failed to update cart.');
            await fetchCart();
        }
    };

    const clearCart = () => {
        setCartCount(0);
    };

    const value = {
        cartCount,
        addToCart,
        removeFromCart,
        fetchCart,
        clearCart,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};