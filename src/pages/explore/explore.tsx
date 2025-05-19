import React, { useState, useEffect } from 'react'
import axios from 'axios'

interface Video {
  _id: string;
  title: string;
  videoUrl: string;
  actress: string[];
  genre: string[];
  rating: number;
  site: string;
  createdAt: string;
}

interface ApiResponse {
  videos: Video[];
  totalPages: number;
  currentPage: number;
  totalVideos: number;
}

interface EditFormData {
  title: string;
  videoUrl: string;
  actress: string;  // We'll convert to array before submitting
  genre: string;    // We'll convert to array before submitting
  rating: number;
  site: string;
}

const Explore: React.FC = () => {
  // Existing state
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false)
  
  // Edit functionality state
  const [editId, setEditId] = useState<string | null>(null)
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [editError, setEditError] = useState<string | null>(null)
  const [editLoading, setEditLoading] = useState<boolean>(false)
  const [editFormData, setEditFormData] = useState<EditFormData>({
    title: '',
    videoUrl: '',
    actress: '',
    genre: '',
    rating: 1,
    site: ''
  })

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await axios.get('http://localhost:5000/api/videos')
      setData(res.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Failed to fetch videos')
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Handle delete functionality
  const handleDeleteClick = (videoId: string) => {
    setDeleteId(videoId)
    setShowConfirmation(true)
  }

  const confirmDelete = async () => {
    if (!deleteId) return

    try {
      setDeleteLoading(true)
      setDeleteError(null)
      
      const token = localStorage.getItem('token')
      
      if (!token) {
        setDeleteError('You must be logged in to delete videos')
        setDeleteLoading(false)
        return
      }

      const response = await axios.delete(`http://localhost:5000/api/videos/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Update the UI by removing the deleted video
      if (data) {
        const updatedVideos = data.videos.filter(video => video._id !== deleteId)
        setData({
          ...data,
          videos: updatedVideos,
          totalVideos: data.totalVideos - 1
        })
      }

      setShowConfirmation(false)
      setDeleteId(null)
      setDeleteLoading(false)
    } catch (error: any) {
      console.error('Error deleting video:', error);
      
      if (error.response) {
        setDeleteError(
          error.response.data?.message || 
          `Server error (${error.response.status}): ${error.response.statusText}`
        );
      } else if (error.request) {
        setDeleteError('Server did not respond to delete request');
      } else {
        setDeleteError(`Error: ${error.message}`);
      }
      
      setDeleteLoading(false)
    }
  }

  const cancelDelete = () => {
    setShowConfirmation(false)
    setDeleteId(null)
    setDeleteError(null)
  }

  // Edit functionality
  const handleEditClick = (video: Video) => {
    setEditId(video._id)
    setEditFormData({
      title: video.title,
      videoUrl: video.videoUrl,
      actress: video.actress.join(', '),
      genre: video.genre.join(', '),
      rating: video.rating,
      site: video.site
    })
    setShowEditModal(true)
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }))
  }

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editId) return

    try {
      setEditLoading(true)
      setEditError(null)
      
      const token = localStorage.getItem('token')
      
      if (!token) {
        setEditError('You must be logged in to update videos')
        setEditLoading(false)
        return
      }

      // Convert comma-separated strings to arrays
      const updatedData = {
        ...editFormData,
        actress: editFormData.actress.split(',').map(item => item.trim()),
        genre: editFormData.genre.split(',').map(item => item.trim())
      }

      const response = await axios.put(
        `http://localhost:5000/api/videos/${editId}`, 
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update the UI with updated video
      if (data) {
        const updatedVideos = data.videos.map(video => 
          video._id === editId ? response.data : video
        )
        setData({
          ...data,
          videos: updatedVideos
        })
      }

      setShowEditModal(false)
      setEditId(null)
      setEditLoading(false)
    } catch (error: any) {
      console.error('Error updating video:', error);
      
      if (error.response) {
        setEditError(
          error.response.data?.message || 
          `Server error (${error.response.status}): ${error.response.statusText}`
        );
      } else if (error.request) {
        setEditError('Server did not respond to update request');
      } else {
        setEditError(`Error: ${error.message}`);
      }
      
      setEditLoading(false)
    }
  }

  const cancelEdit = () => {
    setShowEditModal(false)
    setEditId(null)
    setEditError(null)
  }

  // Check if user is logged in
  const isUserLoggedIn = () => {
    return !!localStorage.getItem('token');
  }

  if (loading) return <div className="p-6 text-center text-gray-500">Loading videos...</div>
  if (error) return <div className="p-6 text-center text-red-500 font-medium">{error}</div>
  if (!data || !data.videos) return <div className="p-6 text-center text-gray-500">No data available</div>

  return (
    <div className='bg-[#342E37] text-white'>
          <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-2xl font-medium mb-8 text-center text-white">Videos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.videos.length > 0 ? (
          data.videos.map((video) => (
            <div key={video._id} className="border border-gray-600 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
              <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" className="block">
                <div className="h-48 w-full bg-gray-200">
                  <img
                    alt={video.title}
                    src="https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
                    className="h-full w-full object-cover"
                  />
                </div>
                
                <div className="p-5">
                  <h3 className="text-lg font-medium text-white line-clamp-1">{video.title}</h3>
                  
                  <div className="mt-2 flex items-center text-sm">
                    <span className="flex items-center text-yellow-500 font-medium">
                      {video.rating}/10
                    </span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-gray-300">{video.site}</span>
                  </div>
                  
                  <p className="mt-2 text-gray-400 text-sm">
                    {Array.isArray(video.genre) ? video.genre.join(', ') : video.genre}
                  </p>
                  
                  <p className="mt-1 text-xs text-gray-200">
                    Actress: {video.actress.join(', ')}
                  </p>
                  
                  <p className="mt-1 text-xs text-gray-200">
                    Added: {new Date(video.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </a>
              
              <div className="px-5 pb-5 flex space-x-2">
                <a 
                  href={video.videoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-500 text-white text-center py-2 rounded-full text-sm font-medium hover:bg-blue-600 transition-colors"
                >
                  Watch
                </a>
                {isUserLoggedIn() && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDeleteClick(video._id)}
                      className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                      aria-label="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500">No videos available</p>
        )}
      </div>
      
      <div className="mt-8 mb-4 text-center text-sm text-gray-500">
        <p>Page {data.currentPage} of {data.totalPages} • Total videos: {data.totalVideos}</p>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full animate-fade-in">
            <h2 className="text-xl font-medium mb-3 text-white">Confirm Deletion</h2>
            <p className="mb-6 text-gray-600">Are you sure you want to delete this video? This action cannot be undone.</p>
            
            {deleteError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                {deleteError}
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded-full border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors"
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-lg w-full animate-fade-in">
            <h2 className="text-xl font-medium mb-4 text-white">Edit Video</h2>
            
            {editError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                {editError}
              </div>
            )}
            
            <form onSubmit={submitEdit} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="title">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="videoUrl">
                  Video URL
                </label>
                <input
                  type="url"
                  id="videoUrl"
                  name="videoUrl"
                  value={editFormData.videoUrl}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="actress">
                  Actress (comma-separated)
                </label>
                <input
                  type="text"
                  id="actress"
                  name="actress"
                  value={editFormData.actress}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="genre">
                  Genre (comma-separated)
                </label>
                <input
                  type="text"
                  id="genre"
                  name="genre"
                  value={editFormData.genre}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="rating">
                  Rating (1-10)
                </label>
                <select
                  id="rating"
                  name="rating"
                  value={editFormData.rating}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="site">
                  Site
                </label>
                <input
                  type="text"
                  id="site"
                  name="site"
                  value={editFormData.site}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 rounded-full border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                  disabled={editLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors"
                  disabled={editLoading}
                >
                  {editLoading ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
  )
}

export default Explore