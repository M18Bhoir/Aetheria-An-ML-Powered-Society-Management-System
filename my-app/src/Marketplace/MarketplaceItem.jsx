import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Corrected relative path for api utility
import api from '../utils/api';
// Corrected import path for react-icons
import { HiOutlineArrowLeft, HiOutlinePhotograph } from 'react-icons/hi';

const CATEGORIES = ['Furniture', 'Electronics', 'Clothing', 'Books', 'Vehicle', 'Other'];
const CONDITIONS = ['New', 'Like New', 'Used - Good', 'Used - Fair', 'Parts Only'];
const MAX_FILE_SIZE_MB = 5; // Max image size in MB

function CreateMarketplaceItem() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState(CATEGORIES[5]); // Default to Other
    const [condition, setCondition] = useState(CONDITIONS[2]); // Default to Used - Good
    // State for the selected file object
    const [imageFile, setImageFile] = useState(null);
    // State for the image preview URL (generated from the file)
    const [imagePreview, setImagePreview] = useState(null);

    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // --- Handle File Input Change ---
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setMessage({ type: '', text: '' }); // Clear message on new file select

        if (file) {
            // Basic validation (type and size)
            if (!file.type.startsWith('image/')) {
                setMessage({ type: 'error', text: 'Please select a valid image file (jpg, png, gif, etc.).' });
                e.target.value = null; // Clear the input
                setImageFile(null);
                setImagePreview(null);
                return;
            }
            if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                 setMessage({ type: 'error', text: `File size exceeds ${MAX_FILE_SIZE_MB} MB limit.` });
                 e.target.value = null; // Clear the input
                 setImageFile(null);
                 setImagePreview(null);
                 return;
            }

            setImageFile(file);
            // Create a preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            // No file selected or selection cancelled
            setImageFile(null);
            setImagePreview(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        setLoading(true);

        const priceNum = parseFloat(price);
        if (isNaN(priceNum) || priceNum < 0) {
            setMessage({ type: 'error', text: 'Please enter a valid non-negative price.' });
            setLoading(false);
            return;
        }

        // --- 1. REAL IMAGE UPLOAD ---
        let uploadedImageUrl = ''; // Start with an empty URL
        
        if (imageFile) {
            setMessage({ type: 'info', text: 'Uploading image...' });
            const formData = new FormData();
            formData.append('image', imageFile); // 'image' must match backend key

            try {
                // Upload the image first
                const uploadRes = await api.post('/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                // Get the URL from the backend response
                uploadedImageUrl = uploadRes.data.imageUrl;
                setMessage({ type: 'info', text: 'Image uploaded! Creating listing...' });
            } catch (err) {
                console.error("Image upload failed:", err);
                setMessage({ type: 'error', text: err.response?.data?.msg || 'Image upload failed. Please try again.' });
                setLoading(false);
                return; // Stop if image upload fails
            }
        }
        // --- 2. END OF REAL UPLOAD ---


        try {
            // --- 3. CREATE MARKETPLACE ITEM (now with real URL) ---
            await api.post('/api/marketplace', {
                title,
                description,
                price: priceNum,
                category,
                condition,
                imageUrl: uploadedImageUrl, // Send the URL from the upload
            });
            
            setMessage({ type: 'success', text: 'Item listed successfully!' });
            setTimeout(() => {
                navigate('/dashboard/marketplace'); // Redirect to marketplace list
            }, 1500); 

        } catch (err) {
            console.error("Error listing item:", err);
             if (err.message !== "Unauthorized access - Redirecting to login.") {
                 setMessage({ type: 'error', text: err.response?.data?.msg || err.response?.data?.message || 'Failed to list item.' });
             }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-6 max-w-2xl mx-auto dark:text-gray-100">
             <button onClick={() => navigate(-1)} className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-4">
                 <HiOutlineArrowLeft className="h-4 w-4 mr-1" />
                 Back
             </button>
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">List New Item</h1>

             {message.text && (
                 <div className={`mb-4 p-3 rounded-md text-sm ${
                       message.type === 'error' ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' :
                       message.type === 'success' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                       'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' // Info
                 }`}>
                     {message.text}
                 </div>
             )}

            <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required maxLength="100"
                           className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required maxLength="1000" rows="4"
                              className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"/>
                </div>

                {/* Price */}
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (₹) *</label>
                    <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" step="0.01"
                           className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>

                {/* Category */}
                 <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                         {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>

                 {/* Condition */}
                 <div>
                    <label htmlFor="condition" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Condition</label>
                    <select id="condition" value={condition} onChange={(e) => setCondition(e.target.value)}
                            className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                         {CONDITIONS.map(cond => <option key={cond} value={cond}>{cond}</option>)}
                    </select>
                </div>

                 {/* --- Image File Upload --- */}
                 <div>
                    <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image (Optional, Max {MAX_FILE_SIZE_MB}MB)</label>
                    <input
                        type="file"
                        id="imageFile"
                        accept="image/*" // Accept only image types
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 dark:text-gray-400
                                 file:mr-4 file:py-2 file:px-4
                                 file:rounded-md file:border-0
                                 file:text-sm file:font-semibold
                                 file:bg-blue-50 dark:file:bg-gray-600
                                 file:text-blue-700 dark:file:text-blue-300
                                 hover:file:bg-blue-100 dark:hover:file:bg-gray-500
                                 file:cursor-pointer"
                    />
                     {/* Image Preview */}
                     {imagePreview && (
                         <div className="mt-4">
                             <img src={imagePreview} alt="Selected preview" className="max-h-48 w-auto rounded-md border dark:border-gray-600" />
                         </div>
                     )}
                </div>


                {/* Submit Button */}
                <button type="submit" disabled={loading}
                        className={`w-full bg-green-600 text-white font-bold py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
                        }`}
                >
                    {loading ? (
                         <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
                       ) : (
                         'List Item'
                    )}
                </button>
            </form>
        </div>
    );
}

export default CreateMarketplaceItem;