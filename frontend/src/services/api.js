import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

export const translationAPI = {
  // Translate text
  async translate({ text, source_language, target_language, save_history = true }) {
    const response = await apiClient.post('/api/translate', {
      text,
      source_language,
      target_language,
      save_history,
    });
    return response.data;
  },

  // Detect language
  async detectLanguage(text) {
    const response = await apiClient.post('/api/detect-language', { text });
    return response.data;
  },

  // Fetch supported languages
  async getLanguages() {
    const response = await apiClient.get('/api/languages');
    return response.data;
  },

  // History operations
  async getHistory(limit = 20) {
    const response = await apiClient.get(`/api/history?limit=${limit}`);
    return response.data;
  },

  async deleteHistoryItem(id) {
    const response = await apiClient.delete(`/api/history/${id}`);
    return response.data;
  },

  async clearHistory() {
    const response = await apiClient.delete('/api/history');
    return response.data;
  },

  // Health check
  async checkHealth() {
    const response = await apiClient.get('/api/health');
    return response.data;
  }
};
