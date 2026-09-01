import api from './api';

export const knowledgeService = {
  getPosts: async (search = '', category = '') => {
    return api.get('/knowledge/posts', { params: { search, category } });
  },

  getPostById: async (id) => {
    return api.get(`/knowledge/posts/${id}`);
  },

  createPost: async (data) => {
    return api.post('/knowledge/posts', data);
  },

  addComment: async (id, content) => {
    return api.post(`/knowledge/posts/${id}/comments`, { content });
  },

  toggleLike: async (id) => {
    return api.post(`/knowledge/posts/${id}/like`);
  },
};

export default knowledgeService;
