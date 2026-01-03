import axios from "axios";
import supabase from "@/utils/supabase";

const BASE_URL = "http://localhost:3001/api";

const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ? {
    'Authorization': `Bearer ${session.access_token}`
  } : {};
};

const collectionService = {
  // Add comic to user's collection
  addToCollection: async (comic, status = 'planned') => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(`${BASE_URL}/comics/add-to-collection`, {
        comic,
        status
      }, { headers });
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Add to collection error:', error);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  },

  // Get user's comic collection
  getUserComics: async (status = null) => {
    try {
      const headers = await getAuthHeaders();
      const params = status ? { status } : {};
      
      const response = await axios.get(`${BASE_URL}/user/comics`, {
        headers,
        params
      });
      
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Get user comics error:', error);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  },

  // Update comic status
  updateComicStatus: async (comicId, status, rating = null) => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.put(`${BASE_URL}/comics/${comicId}/status`, {
        status,
        rating
      }, { headers });
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Update comic status error:', error);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  },

  // Toggle issue read status
  toggleIssueRead: async (comicId, issueNumber) => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(`${BASE_URL}/issues/${comicId}/${issueNumber}/toggle`, {}, { headers });
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Toggle issue error:', error);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  },

  // Get reading progress for a comic
  getReadingProgress: async (comicId) => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${BASE_URL}/issues/${comicId}/progress`, { headers });
      
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Get reading progress error:', error);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  },

  // Check if comic is in user's collection
  checkCollectionStatus: async (comicvineId) => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${BASE_URL}/comics/${comicvineId}/collection-status`, { headers });
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Check collection status error:', error);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  },

  // Remove comic from collection
  removeFromCollection: async (comicId) => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.delete(`${BASE_URL}/comics/${comicId}`, { headers });
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Remove from collection error:', error);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  },

  // Get currently reading comics with progress
  getCurrentlyReading: async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${BASE_URL}/user/currently-reading`, { headers });
      
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Get currently reading error:', error);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }
};

export default collectionService;