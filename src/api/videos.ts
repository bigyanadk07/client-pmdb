// api/videos.js
import api from 'axios';

// Get all videos with filters and pagination
export const getAllVideos = async (params = {}) => {
  try {
    const response = await api.get('/api/videos', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch videos' };
  }
};

// Get a single video by ID
export const getVideoById = async (id) => {
  try {
    const response = await api.get(`/api/videos/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch video' };
  }
};

// Create a new video (requires authentication)
export const createVideo = async (videoData) => {
  try {
    const response = await api.post('/api/videos', videoData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create video' };
  }
};

// Update a video by ID (requires authentication)
export const updateVideo = async (id, videoData) => {
  try {
    const response = await api.put(`/api/videos/${id}`, videoData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update video' };
  }
};

// Delete a video by ID (requires authentication)
export const deleteVideo = async (id) => {
  try {
    const response = await api.delete(`/api/videos/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete video' };
  }
};

// Search videos with multiple criteria
export const searchVideos = async (searchParams) => {
  try {
    const response = await api.get('/api/videos', { params: searchParams });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Search failed' };
  }
};