const knowledgeService = require('../services/knowledgeService');
const response = require('../utils/response');

const getPosts = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const data = await knowledgeService.getPosts(search, category);
    return response.success(res, data, 'Knowledge posts retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await knowledgeService.getPostById(id);
    return response.success(res, data, 'Knowledge post details retrieved', 200);
  } catch (error) {
    next(error);
  }
};

const createPost = async (req, res, next) => {
  try {
    const { title, content, category, tags } = req.body;
    const data = await knowledgeService.createPost({
      author_id: req.user.id,
      title,
      content,
      category,
      tags,
    });
    return response.success(res, data, 'Knowledge post published successfully', 201);
  } catch (error) {
    next(error);
  }
};

const addComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const data = await knowledgeService.addComment({
      post_id: id,
      author_id: req.user.id,
      content,
    });
    return response.success(res, data, 'Comment posted', 201);
  } catch (error) {
    next(error);
  }
};

const toggleLike = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await knowledgeService.toggleLike(id, req.user.id);
    return response.success(res, data, 'Post like status updated', 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  addComment,
  toggleLike,
};
