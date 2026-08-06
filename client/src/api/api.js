import axios from 'axios';

const API = axios.create({
  baseURL: '/api'
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const articleAPI = {
  getArticles: (page = 1, category = '', region = '', search = '') =>
    API.get('/articles', { params: { page, category, region, search, limit: 10 } }),
  getArticle: (slug) => API.get(`/articles/${slug}`),
  createArticle: (data) => API.post('/articles', data),
  updateArticle: (id, data) => API.put(`/articles/${id}`, data),
  deleteArticle: (id) => API.delete(`/articles/${id}`),
  likeArticle: (id) => API.post(`/articles/${id}/like`),
  saveArticle: (id) => API.post(`/articles/${id}/save`)
};

export const commentAPI = {
  addComment: (data) => API.post('/comments', data),
  deleteComment: (id) => API.delete(`/comments/${id}`)
};

export default API;
