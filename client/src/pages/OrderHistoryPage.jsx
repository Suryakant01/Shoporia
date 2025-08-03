import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { format } from 'date-fns';
import { FaSpinner } from 'react-icons/fa';
import { getProductImage } from '../utils/imageHelper';

const OrderHistoryPage = ({ showModal }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/my-orders');
                setOrders((data.data || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
            } catch (error) {
                console.error('Failed to fetch orders:', error);
                showModal('error', 'Could not load your order history.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [showModal]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <FaSpinner className="animate-spin text-4xl text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Order History</h1>
            {orders.length === 0 ? (
                <p className="text-gray-600 text-center mt-8">You haven't placed any orders yet.</p>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="bg-gray-100 p-4 flex justify-between items-center border-b">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">Order #{order.id}</h2>
                                    <p className="text-sm text-gray-500">
                                        Placed on: {format(new Date(order.created_at), 'MMMM d, yyyy, h:mm a')}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Ordered by: <span className="font-medium text-gray-700">{order.user?.username}</span>
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-lg font-bold text-indigo-600">
                                        {order.cart?.items?.reduce((sum, item) => sum + item.Quantity, 0) || 0} items
                                    </span>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold mb-2">Items in this order:</h3>
                                <ul className="space-y-3">
                                    {order.cart?.items?.map(({ Item, Quantity }) => (
                                        <li key={Item.id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={getProductImage(Item.name)}
                                                    alt={Item.name}
                                                    className="w-16 h-16 object-cover rounded-md"
                                                />
                                                <span className="text-gray-700">{Item.name}</span>
                                            </div>
                                            <span className="font-semibold text-gray-600">
                                                Qty: {Quantity}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistoryPage;