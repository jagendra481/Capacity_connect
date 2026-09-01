const db = require('../config/database');

const demoPosts = [
  {
    id: 1,
    author_id: 1,
    author_name: 'Alex Johnson',
    author_role: 'Trainee Engineer',
    title: 'Best Practices for Managing React State & Custom Hooks in Enterprise Applications',
    content: 'When decoupling complex React components, custom hooks provide a clean encapsulation barrier. Ensure your Axios interceptors inject JWT tokens globally and handle 401 unauthenticated errors gracefully.',
    category: 'Engineering',
    tags: ['React', 'StateManagement', 'CustomHooks'],
    likes_count: 14,
    comments_count: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    author_id: 2,
    author_name: 'Sarah Jenkins',
    author_role: 'Senior Trainer',
    title: 'How to Debug PostgreSQL Execution Plans Using EXPLAIN ANALYZE',
    content: 'When joining large dataset tables, missing B-Tree or GIN indexes lead to costly sequential table scans. Always analyze execution node costs before modifying your database schema.',
    category: 'Database',
    tags: ['PostgreSQL', 'Performance', 'Indexing'],
    likes_count: 22,
    comments_count: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    author_id: 3,
    author_name: 'Michael Chang',
    author_role: 'System Administrator',
    title: 'RAG Architecture: Chunking Strategies for Enterprise Vector Search',
    content: 'Retrieval-Augmented Generation relies heavily on chunk size and overlap ratio. We recommend 500-token chunks with a 50-token overlap to preserve contextual continuity for vector embeddings.',
    category: 'AI',
    tags: ['RAG', 'VectorSearch', 'Embeddings'],
    likes_count: 19,
    comments_count: 2,
    created_at: new Date().toISOString(),
  },
];

class KnowledgePost {
  static async getAll(search = '', category = '') {
    if (db.getIsPgConnected()) {
      let queryStr = `SELECT kp.*, u.full_name as author_name, u.role as author_role 
                      FROM knowledge_posts kp 
                      JOIN users u ON kp.author_id = u.id WHERE 1=1`;
      const params = [];

      if (category) {
        params.push(category);
        queryStr += ` AND kp.category = $${params.length}`;
      }
      if (search) {
        params.push(`%${search}%`);
        queryStr += ` AND (kp.title ILIKE $${params.length} OR kp.content ILIKE $${params.length})`;
      }

      queryStr += ' ORDER BY kp.created_at DESC';
      const res = await db.query(queryStr, params);
      return res.rows;
    }

    let filtered = demoPosts;
    if (category) {
      filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(s) || p.content.toLowerCase().includes(s));
    }
    return filtered;
  }

  static async findById(id) {
    if (db.getIsPgConnected()) {
      const res = await db.query(
        `SELECT kp.*, u.full_name as author_name, u.role as author_role 
         FROM knowledge_posts kp 
         JOIN users u ON kp.author_id = u.id 
         WHERE kp.id = $1`,
        [id]
      );
      return res.rows[0];
    }
    return demoPosts.find(p => p.id === parseInt(id));
  }

  static async create({ author_id, title, content, category, tags }) {
    if (db.getIsPgConnected()) {
      const res = await db.query(
        `INSERT INTO knowledge_posts (author_id, title, content, category, tags)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [author_id, title, content, category || 'General', tags || []]
      );
      return res.rows[0];
    }

    const newPost = {
      id: demoPosts.length + 1,
      author_id: parseInt(author_id),
      author_name: 'Alex Johnson',
      author_role: 'Trainee Engineer',
      title,
      content,
      category: category || 'General',
      tags: tags || ['General'],
      likes_count: 0,
      comments_count: 0,
      created_at: new Date().toISOString(),
    };
    demoPosts.unshift(newPost);
    return newPost;
  }

  static async incrementLikes(id) {
    const post = demoPosts.find(p => p.id === parseInt(id));
    if (post) {
      post.likes_count += 1;
    }
    return post;
  }
}

module.exports = KnowledgePost;
