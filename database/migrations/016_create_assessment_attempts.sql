-- Create Assessment Attempts Table
CREATE TABLE IF NOT EXISTS assessment_attempts (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assessment_id INT NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    score INT NOT NULL,
    passed BOOLEAN NOT NULL,
    total_questions INT NOT NULL,
    correct_count INT NOT NULL,
    answers JSONB,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_assessment_attempts_user ON assessment_attempts(user_id);
