const KnowledgePost = require('../models/KnowledgePost');
const Comment = require('../models/Comment');
const Like = require('../models/Like');

class KnowledgeService {
  async getPosts(search = '', category = '') {
    return KnowledgePost.getAll(search, category);
  }

  async getPostById(id) {
    const post = await KnowledgePost.findById(id);
    if (!post) {
      const err = new Error('Knowledge post not found.');
      err.statusCode = 404;
      throw err;
    }
    const comments = await Comment.getByPostId(id);
    return {
      ...post,
      comments,
    };
  }

  async createPost({ author_id, title, content, category, tags }) {
    if (!title || !content) {
      const err = new Error('Title and content are required.');
      err.statusCode = 400;
      throw err;
    }
    return KnowledgePost.create({ author_id, title, content, category, tags });
  }

  async addComment({ post_id, author_id, content }) {
    if (!content) {
      const err = new Error('Comment content cannot be empty.');
      err.statusCode = 400;
      throw err;
    }
    return Comment.create({ post_id, author_id, content });
  }

  async toggleLike(postId, userId) {
    return Like.toggleLike(postId, userId);
  }
}

module.exports = new KnowledgeService();
