import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
// --- 1. IMPORT ICONS ---
import { ArrowLeft, Edit, Trash2, User, Mail, Home } from 'lucide-react';

// Reusable component for item details
const DetailRow = ({ label, value }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{value}</dd>
    </div>
);

function MarketplaceItemDetail() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the logged-in user's ID from local storage
  const [currentUserId, setCurrentUserId] = useState(null);
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUserId(JSON.parse(user).id); // 'id' from login response
    }
  }, []);
  
  const isSeller = item && currentUserId === item.seller?._id;

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/api/marketplace/${itemId}`);
        setItem(res.data);
      } catch (err) {
        console.error("Failed to fetch item:", err);
        setError(err.response?.data?.message || err.response?.data?.msg || "Could not load item details.");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [itemId]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
        try {
            await api.delete(`/api/marketplace/${itemId}`);
            alert("Listing deleted.");
            navigate('/dashboard/marketplace');
        } catch (err) {
             console.error("Failed to delete item:", err);
             alert(err.response?.data?.message || "Could not delete listing.");
        }
    }
  };

  if (loading) return <div className="text-center p-6 text-gray-500 dark:text-gray-400">Loading item...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;
  if (!item) return <div className="text-center p-6 text-gray-500 dark:text-gray-400">Item not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4">
        <ArrowLeft size={16} className="mr-1" />
        Back to Marketplace
      </button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* --- Main Content (Image & Details) --- */}
        <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                {/* Image */}
                <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-gray-500 dark:text-gray-400">No Image Provided</span>
                    )}
                </div>

                {/* Item Details */}
                <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h1>
                    <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4">
                        ₹{item.price.toLocaleString('en-IN')}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                        {item.description}
                    </p>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <dl>
                            <DetailRow label="Category" value={item.category} />
                            <DetailRow label="Condition" value={item.condition} />
                            <DetailRow label="Posted" value={new Date(item.createdAt).toLocaleDateString()} />
                        </dl>
                    </div>
                </div>
            </div>
        </div>

        {/* --- Sidebar (Seller Info & Actions) --- */}
        <div className="lg:col-span-1 space-y-6">

            {/* --- 2. NEW SELLER INFORMATION CARD --- */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-5">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Seller Information
                </h2>
                {item.seller ? (
                     <ul className="space-y-3">
                        <li className="flex items-center">
                            <User size={18} className="text-gray-500 dark:text-gray-400 mr-3" />
                            <span className="text-gray-800 dark:text-gray-200">{item.seller.name}</span>
                        </li>
                        <li className="flex items-center">
                            <Home size={18} className="text-gray-500 dark:text-gray-400 mr-3" />
                            <span className="text-gray-800 dark:text-gray-200">Flat: {item.seller.userId}</span>
                        </li>
                        <li className="flex items-center">
                            <Mail size={18} className="text-gray-500 dark:text-gray-400 mr-3" />
                            <a href={`mailto:${item.seller.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                                {item.seller.email}
                            </a>
                        </li>
                    </ul>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">Seller information is not available.</p>
                )}
            </div>
            
            {/* --- 3. ACTIONS CARD (for Seller only) --- */}
            {isSeller && (
                 <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-5">
                     <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Your Listing
                    </h2>
                     <div className="space-y-3">
                         {/* Edit Button */}
                         <button 
                             disabled={true} // Edit functionality is not implemented
                             className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                             title="Edit (Coming Soon)">
                             <Edit size={16} className="mr-2" />
                             Edit Listing (Coming Soon)
                         </button>

                         {/* Delete Button */}
                         <button
                            onClick={handleDelete}
                            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-red-500"
                        >
                            <Trash2 size={16} className="mr-2" />
                            Delete Listing
                        </button>
                    </div>
                </div>
            )}
            
        </div>
      </div>
    </div>
  );
}

export default MarketplaceItemDetail;