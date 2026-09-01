-- Create Course Progress Table
CREATE TABLE IF NOT EXISTS course_progress (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    lesson_id INT REFERENCES lessons(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false,
    progress_percentage INT DEFAULT 0,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_course_lesson UNIQUE(user_id, course_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_course_progress_user ON course_progress(user_id);
