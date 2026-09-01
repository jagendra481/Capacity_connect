-- Create Questions Table
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    assessment_id INT REFERENCES assessments(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- MCQ, True/False, ShortAnswer, Scenario
    options JSONB, -- Array of string options for MCQ/Scenario
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    points INT DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_questions_assessment ON questions(assessment_id);
