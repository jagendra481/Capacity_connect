-- Create Knowledge Sharing Hub Tables (Knowledge Posts, Comments, Likes)
CREATE TABLE IF NOT EXISTS knowledge_posts (
    id SERIAL PRIMARY KEY,
    author_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'General',
    tags TEXT[], -- Array of tag strings
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    post_id INT NOT NULL REFERENCES knowledge_posts(id) ON DELETE CASCADE,
    author_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS likes (
    id SERIAL PRIMARY KEY,
    post_id INT NOT NULL REFERENCES knowledge_posts(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_post_user_like UNIQUE(post_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_knowledge_posts_category ON knowledge_posts(category);
