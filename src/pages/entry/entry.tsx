// EntryForm.jsx with improved error handling and debugging

import React, { useState, useEffect } from 'react';

const EntryForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    videoUrl: '',
    actress: '',
    genre: '',
    rating: '5',
    site: ''
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [detailedError, setDetailedError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    // Basic validation
    if (!formData.title.trim()) return "Title is required";
    if (!formData.videoUrl.trim()) return "Video URL is required";
    
    // URL validation
    try {
      new URL(formData.videoUrl);
    } catch (e) {
      return "Please enter a valid URL";
    }
    
    return null; // No errors
  };

  const handleSubmit = async () => {
    // Clear previous messages
    setMessage('');
    setDetailedError(null);
    
    // Client-side validation
    const validationError = validateForm();
    if (validationError) {
      setMessage(`Error: ${validationError}`);
      return;
    }
    
    setLoading(true);

    const token = localStorage.getItem('token');

    if (!token) {
      setMessage('Error: Auth token not found in local storage.');
      setLoading(false);
      return;
    }

    // Prepare payload with proper formatting
    const payload = {
      ...formData,
      actress: formData.actress ? formData.actress.split(',').map(a => a.trim()).filter(a => a) : [],
      genre: formData.genre ? formData.genre.split(',').map(g => g.trim()).filter(g => g) : [],
      rating: parseInt(formData.rating),
    };

    try {
      console.log("Sending payload:", JSON.stringify(payload));
      
      const response = await fetch('http://localhost:5000/api/videos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      // Get the raw response text first
      const rawResponse = await response.text();
      
      // Try to parse as JSON (might fail if response isn't valid JSON)
      let data;
      try {
        data = JSON.parse(rawResponse);
      } catch (e) {
        console.error("Failed to parse response as JSON:", rawResponse);
        throw new Error("Server returned an invalid response format");
      }
      
      if (!response.ok) {
        // Extract detailed error information
        if (data.errors && Array.isArray(data.errors)) {
          setDetailedError(data.errors);
          throw new Error(data.errors.map(err => err.msg || err.message).join(', '));
        } else {
          throw new Error(data.message || 'Something went wrong');
        }
      }

      setMessage(`Success: ${data.title || formData.title} was added.`);
      
      // Reset form after successful submission
      setFormData({
        title: '',
        videoUrl: '',
        actress: '',
        genre: '',
        rating: '5',
        site: ''
      });
    } catch (err) {
      setMessage(`Error: ${err.message || 'Something went wrong.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = (field) => {
    setActiveField(field);
  };

  const handleBlur = () => {
    setActiveField(null);
  };

  const getFieldClass = (field) => {
    return `relative border-b ${activeField === field 
      ? 'border-blue-500' 
      : 'border-gray-200'} transition-all duration-300`;
  };

  return (
    <div className='bg-[#342E37] min-h-screen py-8'>
      <div className="max-w-xl mx-auto p-6 bg-[#483f4d] text-white rounded-3xl shadow-lg overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-light mb-8 text-white text-center">Add New Video</h2>
          
          {message && (
            <div className={`mb-8 p-4 rounded-xl text-sm flex items-center justify-center ${message.includes('Success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
              <span className={message.includes('Success') ? 'text-green-500' : 'text-red-500'}>●</span>
              <span className="ml-2">{message}</span>
            </div>
          )}
          
          {detailedError && (
            <div className="mb-8 p-4 bg-red-50 rounded-xl text-sm">
              <p className="font-medium text-red-600 mb-2">Validation errors:</p>
              <ul className="list-disc pl-5 text-red-600">
                {detailedError.map((err, index) => (
                  <li key={index}>{err.param ? `${err.param}: ${err.msg}` : err.msg || JSON.stringify(err)}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="space-y-6">
            <div className={getFieldClass('title')}>
              <input 
                id="title"
                name="title" 
                value={formData.title} 
                onChange={handleChange}
                onFocus={() => handleFocus('title')}
                onBlur={handleBlur}
                placeholder="Title" 
                className="w-full px-2 py-3 bg-transparent focus:outline-none text-white" 
                required
              />
            </div>
            
            <div className={getFieldClass('videoUrl')}>
              <input 
                id="videoUrl"
                name="videoUrl" 
                type="url"
                value={formData.videoUrl} 
                onChange={handleChange}
                onFocus={() => handleFocus('videoUrl')}
                onBlur={handleBlur}
                placeholder="Video URL" 
                className="w-full px-2 py-3 bg-transparent focus:outline-none text-white" 
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div className={getFieldClass('actress')}>
                <input 
                  id="actress"
                  name="actress" 
                  value={formData.actress} 
                  onChange={handleChange}
                  onFocus={() => handleFocus('actress')}
                  onBlur={handleBlur}
                  placeholder="Actresses (comma separated)" 
                  className="w-full px-2 py-3 bg-transparent focus:outline-none text-white" 
                />
              </div>
              
              <div className={getFieldClass('genre')}>
                <input 
                  id="genre"
                  name="genre" 
                  value={formData.genre} 
                  onChange={handleChange}
                  onFocus={() => handleFocus('genre')}
                  onBlur={handleBlur}
                  placeholder="Genres (comma separated)" 
                  className="w-full px-2 py-3 bg-transparent focus:outline-none text-white" 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div className={getFieldClass('rating')}>
                <select 
                  id="rating"
                  name="rating" 
                  value={formData.rating} 
                  onChange={handleChange}
                  onFocus={() => handleFocus('rating')}
                  onBlur={handleBlur}
                  className="w-full px-2 py-3 focus:outline-none text-white appearance-none bg-[#483f4d]"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                  ▼
                </div>
              </div>
              
              <div className={getFieldClass('site')}>
                <input 
                  id="site"
                  name="site" 
                  value={formData.site} 
                  onChange={handleChange}
                  onFocus={() => handleFocus('site')}
                  onBlur={handleBlur}
                  placeholder="Source website" 
                  className="w-full px-2 py-3 bg-transparent focus:outline-none text-white" 
                />
              </div>
            </div>
            
            <div className="pt-6">
              <button 
                onClick={handleSubmit} 
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-xl font-normal hover:from-blue-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-pulse">Adding</span>
                    <span className="ml-1 animate-bounce delay-100">.</span>
                    <span className="animate-bounce delay-200">.</span>
                    <span className="animate-bounce delay-300">.</span>
                  </span>
                ) : 'Add Video'}
              </button>
            </div>
            
            {/* Debug Info Section - can be removed in production */}
            <div className="mt-8 p-4 bg-gray-800 rounded text-xs text-gray-400 overflow-auto hidden">
              <p className="font-medium mb-2">Debug Info:</p>
              <pre>{JSON.stringify({formData, token: localStorage.getItem('token') ? "Present" : "Missing"}, null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntryForm;