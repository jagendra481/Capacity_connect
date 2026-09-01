-- Create Courses Table
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    level VARCHAR(50) NOT NULL DEFAULT 'Beginner', -- Beginner, Intermediate, Advanced
    duration VARCHAR(50),
    thumbnail_url TEXT,
    trainer_id INT REFERENCES users(id) ON DELETE SET NULL,
    prerequisites TEXT,
    status VARCHAR(50) DEFAULT 'published', -- draft, published
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level);
