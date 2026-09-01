-- Create Competencies Matrix Table
CREATE TABLE IF NOT EXISTS competencies (
    id SERIAL PRIMARY KEY,
    department_id INT REFERENCES departments(id) ON DELETE CASCADE,
    skill_id INT REFERENCES skills(id) ON DELETE CASCADE,
    required_level INT NOT NULL,
    current_level INT NOT NULL,
    gap INT NOT NULL,
    severity VARCHAR(50) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_competencies_department ON competencies(department_id);
