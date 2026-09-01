-- Create Learning Paths Table
CREATE TABLE IF NOT EXISTS learning_paths (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_role VARCHAR(100) NOT NULL,
    courses_sequence JSONB NOT NULL, -- Array of course IDs in sequential learning order
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_learning_paths_role ON learning_paths(target_role);
