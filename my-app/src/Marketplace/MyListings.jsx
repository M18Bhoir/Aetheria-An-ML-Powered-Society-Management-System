import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { HiOutlinePlusCircle, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";

// Function to show a placeholder image if item image is missing
const placeholderImage = (text = 'No Image') =>
  `https://placehold.co/150x100/EEE/31343C?text=${encodeURIComponent(text)}`;

function MyListings() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // ✅ Corrected endpoint
  const fetchMyItems = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/api/marketplace/my-listings');
      setItems(res.data || []);
    } catch (err) {
      console.error("Failed to fetch user listings:", err);
      if (err.message !== "Unauthorized access - Redirecting to login.") {
        setError(err.response?.data?.message || err.response?.data?.msg || 'Could not load your listings.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyItems();
  }, []);

  // ✅ Delete listing handler
  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this listing? This cannot be undone.')) {
      try {
        await api.delete(`/api/marketplace/${itemId}`);
        // Remove deleted item from local state
        setItems(prevItems => prevItems.filter(item => item._id !== itemId));
        alert('Listing deleted successfully.');
      } catch (err) {
        console.error("Failed to delete item:", err);
        alert(err.response?.data?.message || err.response?.data?.msg || 'Failed to delete listing.');
      }
    }
  };

  // ✅ Update listing status (Available / Reserved / Sold)
  const handleStatusChange = async (itemId, newStatus) => {
    try {
      await api.put(`/api/marketplace/${itemId}`, { status: newStatus });
      // Update item in state
      setItems(prevItems =>
        prevItems.map(item =>
          item._id === itemId ? { ...item, status: newStatus } : item
        )
      );
      alert(`Status updated to ${newStatus}`);
    } catch (err) {
      console.error("Failed to update status:", err);
      alert(err.response?.data?.message || err.response?.data?.msg || 'Failed to update status.');
    }
  };

  return (
    <div className="p-4 md:p-6 dark:text-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          My Marketplace Listings
        </h1>
        <button
          onClick={() => navigate('/dashboard/marketplace/new')}
          className="flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors duration-200"
          title="List New Item"
        >
          <HiOutlinePlusCircle className="h-5 w-5 mr-1" />
          List New Item
        </button>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Loading your listings...
        </p>
      )}
      {error && (
        <p className="text-center text-red-500 dark:text-red-400">
          Error: {error}
        </p>
      )}

      {/* No listings yet */}
      {!loading && !error && items.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="mb-4">You haven't listed any items yet.</p>
          <button
            onClick={() => navigate('/dashboard/marketplace/new')}
            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
          >
            List Your First Item
          </button>
        </div>
      )}

      {/* Listings */}
      {!loading && !error && items.length > 0 && (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm flex flex-col md:flex-row md:items-center gap-4"
            >
              {/* Item Image */}
              <img
                src={item.imageUrl || placeholderImage(item.title)}
                alt={item.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = placeholderImage(item.title);
                }}
                className="w-full md:w-32 h-24 md:h-20 object-cover rounded-md flex-shrink-0"
              />

              {/* Item Details */}
              <div className="flex-grow">
                <Link
                  to={`/dashboard/marketplace/${item._id}`}
                  className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {item.title}
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.category} - {item.condition}
                </p>
                <p className="text-md font-bold text-green-600 dark:text-green-400 mt-1">
                  ₹{item.price.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Listed on: {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Actions Section */}
              <div className="flex-shrink-0 flex flex-col items-start md:items-end space-y-2">
                {/* Status Selector */}
                <div className="flex items-center space-x-2">
                  <label
                    htmlFor={`status-${item._id}`}
                    className="text-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Status:
                  </label>
                  <select
                    id={`status-${item._id}`}
                    value={item.status}
                    onChange={(e) => handleStatusChange(item._id, e.target.value)}
                    className="text-xs p-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Available">Available</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>

                {/* Edit & Delete Buttons */}
                <div className="flex space-x-2">
                  <button
                    disabled // Placeholder until edit feature added
                    className="p-1 text-yellow-500 hover:text-yellow-700 disabled:opacity-50"
                    title="Edit Listing (Coming Soon)"
                  >
                    <HiOutlinePencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-1 text-red-500 hover:text-red-700"
                    title="Delete Listing"
                  >
                    <HiOutlineTrash className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyListings;
