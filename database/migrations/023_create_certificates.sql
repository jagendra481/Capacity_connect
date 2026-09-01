-- Create Digital Certificates Table
CREATE TABLE IF NOT EXISTS certificates (
    id SERIAL PRIMARY KEY,
    certificate_hash VARCHAR(100) UNIQUE NOT NULL,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(id) ON DELETE CASCADE,
    assessment_id INT REFERENCES assessments(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    issued_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    verification_url VARCHAR(255) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_certificates_hash ON certificates(certificate_hash);
CREATE INDEX IF NOT EXISTS idx_certificates_user ON certificates(user_id);
