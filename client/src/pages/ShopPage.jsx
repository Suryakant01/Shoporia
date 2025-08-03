import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import { getProductImage } from '../utils/imageHelper';
import toast from 'react-hot-toast';

const ShopPage = () => {
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [addingItemId, setAddingItemId] = useState(null);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const { data } = await api.get('/items');
                setItems(data.data || []);
            } catch (error) {
                toast.error('Could not load products.');
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    const handleAddItemToCart = async (item) => {
        setAddingItemId(item.id);
        await addToCart(item);
        setAddingItemId(null);
    };

    const filteredItems = items.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <FaSpinner className="animate-spin text-5xl text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-3xl font-semibold text-gray-800">Products</h2>
                <div className="relative w-full md:w-auto md:min-w-[300px]">
                    <input
                        type="text"
                        placeholder="Search for products..."
                        className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden group flex flex-col">
                            <div className="relative">
                                <img src={getProductImage(item.name)} alt={item.name} className="w-full h-56 object-cover" />
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleAddItemToCart(item)}
                                        disabled={addingItemId === item.id}
                                        className="text-white bg-indigo-600 px-6 py-2 rounded-full font-semibold flex items-center justify-center min-w-[140px]"
                                    >
                                        {addingItemId === item.id ? <FaSpinner className="animate-spin" /> : 'Add to Cart'}
                                    </button>
                                </div>
                            </div>
                            <div className="p-4 flex-grow">
                                <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <h3 className="text-2xl text-gray-700">No Products Found</h3>
                    <p className="text-gray-500 mt-2">
                        {items.length > 0 ? "Try adjusting your search." : "The store is currently empty. Please check back later!"}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ShopPage;