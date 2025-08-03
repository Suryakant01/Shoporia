import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaSpinner, FaTrashAlt } from 'react-icons/fa';
import api from '../services/api';
import { getProductImage } from '../utils/imageHelper';
import toast from 'react-hot-toast';

const CartPage = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const { fetchCart, removeFromCart, clearCart } = useCart();
    const navigate = useNavigate();

    const loadCart = useCallback(async () => {
        setLoading(true);
        const cartData = await fetchCart();
        setCart(cartData);
        setLoading(false);
    }, [fetchCart]);

    useEffect(() => {
        loadCart();
    }, [loadCart]);

    const handleRemoveItem = async (itemId) => {
        await removeFromCart(itemId);
        await loadCart();
    };

    const handleCheckout = async () => {
        if (!cart || !cart.items || cart.items.length === 0) {
            toast.error('Your cart is empty.');
            return;
        }
        setIsCheckingOut(true);
        try {
            await api.post('/orders', {});
            clearCart();
            toast.success('Order placed successfully!');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Checkout failed.');
        } finally {
            setIsCheckingOut(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <FaSpinner className="animate-spin text-5xl text-indigo-600" />
            </div>
        );
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="container mx-auto px-6 py-12 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
                <p className="text-gray-600">Looks like you haven't added anything yet.</p>
                <button onClick={() => navigate('/')} className="mt-6 px-6 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                    Start Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Shopping Cart</h1>
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-2/3">
                    <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
                        {cart.items.map(({ Item, Quantity }) => (
                            <div key={Item.id} className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-4">
                                    <img src={getProductImage(Item.name)} alt={Item.name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded" />
                                    <div>
                                        <h2 className="font-semibold text-base sm:text-lg text-gray-800">{Item.name}</h2>
                                        <p className="text-sm text-gray-500">Item ID: {Item.id}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 sm:gap-8">
                                    <div className="text-center">
                                        <span className="font-semibold text-lg">{Quantity}</span>
                                        <p className="text-sm text-gray-500">Qty</p>
                                    </div>
                                    <button onClick={() => handleRemoveItem(Item.id)} className="text-red-500 hover:text-red-700 p-2">
                                        <FaTrashAlt size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-full lg:w-1/3">
                    <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                        <div className="flex justify-between mb-6 text-lg">
                            <span>Total Items</span>
                            <span className="font-bold">{cart.items.reduce((sum, item) => sum + item.Quantity, 0)}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            disabled={isCheckingOut}
                            className="w-full py-3 text-white bg-green-500 rounded-md hover:bg-green-600 font-bold flex items-center justify-center"
                        >
                            {isCheckingOut ? <FaSpinner className="animate-spin" /> : 'Proceed to Checkout'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;