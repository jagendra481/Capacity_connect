const db = require('../config/database');

const demoComments = {
  1: [
    {
      id: 101,
      post_id: 1,
      author_id: 2,
      author_name: 'Sarah Jenkins',
      content: 'Great overview on custom hooks! Adding error boundaries around components also prevents global unhandled crashes.',
      created_at: new Date().toISOString(),
    },
  ],
};

class Comment {
  static async getByPostId(postId) {
    if (db.getIsPgConnected()) {
      const res = await db.query(
        `SELECT c.*, u.full_name as author_name 
         FROM comments c 
         JOIN users u ON c.author_id = u.id 
         WHERE c.post_id = $1 ORDER BY c.created_at ASC`,
        [postId]
      );
      return res.rows;
    }
    return demoComments[parseInt(postId)] || [];
  }

  static async create({ post_id, author_id, content }) {
    if (db.getIsPgConnected()) {
      const res = await db.query(
        `INSERT INTO comments (post_id, author_id, content)
         VALUES ($1, $2, $3) RETURNING *`,
        [post_id, author_id, content]
      );
      return res.rows[0];
    }

    const list = demoComments[parseInt(post_id)] || [];
    const newComment = {
      id: list.length + 101,
      post_id: parseInt(post_id),
      author_id: parseInt(author_id),
      author_name: 'Authenticated Peer',
      content,
      created_at: new Date().toISOString(),
    };
    list.push(newComment);
    demoComments[parseInt(post_id)] = list;
    return newComment;
  }
}

module.exports = Comment;
