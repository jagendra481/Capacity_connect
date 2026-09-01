const db = require('../config/database');
const KnowledgePost = require('./KnowledgePost');

class Like {
  static async toggleLike(postId, userId) {
    if (db.getIsPgConnected()) {
      const check = await db.query('SELECT * FROM likes WHERE post_id = $1 AND user_id = $2', [postId, userId]);
      if (check.rows.length > 0) {
        await db.query('DELETE FROM likes WHERE post_id = $1 AND user_id = $2', [postId, userId]);
        await db.query('UPDATE knowledge_posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = $1', [postId]);
        return { liked: false };
      } else {
        await db.query('INSERT INTO likes (post_id, user_id) VALUES ($1, $2)', [postId, userId]);
        await db.query('UPDATE knowledge_posts SET likes_count = likes_count + 1 WHERE id = $1', [postId]);
        return { liked: true };
      }
    }

    await KnowledgePost.incrementLikes(postId);
    return { liked: true };
  }
}

module.exports = Like;
