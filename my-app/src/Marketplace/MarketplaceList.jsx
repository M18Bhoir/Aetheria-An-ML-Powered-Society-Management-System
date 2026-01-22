import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { HiOutlinePlusCircle, HiOutlineRefresh } from "react-icons/hi"; // Icons

// Placeholder image function
const placeholderImage = (text = 'No Image') => `https://placehold.co/600x400/EEE/31343C?text=${encodeURIComponent(text)}`;

function MarketplaceList() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    // TODO: Add state for pagination (currentPage, totalPages)

    const fetchItems = async () => {
        setLoading(true);
        setError('');
        try {
            // TODO: Add pagination query parameters (&page=1&limit=10)
            const res = await api.get('/api/marketplace');
            setItems(res.data.items || []); // Assuming API returns { items: [...] }
            // TODO: Set pagination state (res.data.currentPage, res.data.totalPages)
        } catch (err) {
            console.error("Failed to fetch marketplace items:", err);
             if (err.message !== "Unauthorized access - Redirecting to login.") {
                 setError(err.response?.data?.message || 'Could not load marketplace items.');
             }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []); // TODO: Add dependencies if pagination/filters are added

    return (
        <div className="p-4 md:p-6 dark:text-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Marketplace</h1>
                <div className="flex space-x-2">
                    <button
                        onClick={fetchItems}
                        disabled={loading}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50"
                        title="Refresh Listings"
                    >
                         <HiOutlineRefresh className={`h-6 w-6 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                     <button
                        onClick={() => navigate('/dashboard/marketplace/new')}
                        className="flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors duration-200"
                        title="List New Item"
                    >
                        <HiOutlinePlusCircle className="h-5 w-5 mr-1" />
                        List Item
                    </button>
                </div>
            </div>

            {loading && <p className="text-center text-gray-500 dark:text-gray-400">Loading items...</p>}
            {error && <p className="text-center text-red-500 dark:text-red-400">Error: {error}</p>}

            {!loading && !error && items.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400">No items listed in the marketplace yet.</p>
            )}

            {!loading && !error && items.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.map((item) => (
                        <Link to={`/dashboard/marketplace/${item._id}`} key={item._id} className="block group">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl">
                                <img
                                    src={item.imageUrl || placeholderImage(item.title)}
                                    alt={item.title}
                                    onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage(item.title); }}
                                    className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
                                />
                                <div className="p-4">
                                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">{item.title}</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{item.category}</p>
                                    <p className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">₹{item.price.toLocaleString('en-IN')}</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">
                                        Listed by {item.seller?.name || 'Unknown'}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

             {/* TODO: Add Pagination Controls */}
             {/* <div className="mt-8 flex justify-center"> ... </div> */}

        </div>
    );
}

export default MarketplaceList;
