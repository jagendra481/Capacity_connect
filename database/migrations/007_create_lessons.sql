-- Create Lessons Table
CREATE TABLE IF NOT EXISTS lessons (
    id SERIAL PRIMARY KEY,
    module_id INT NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    video_url TEXT,
    duration VARCHAR(50),
    order_index INT DEFAULT 1,
    is_preview BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_lessons_module ON lessons(module_id);
