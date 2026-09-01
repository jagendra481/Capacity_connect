-- Create Training Calendar Tables (Training Sessions, Session RSVPs)
CREATE TABLE IF NOT EXISTS training_sessions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) DEFAULT 'Engineering',
    trainer_id INT REFERENCES users(id) ON DELETE CASCADE,
    meeting_link VARCHAR(255),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    capacity INT DEFAULT 30,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS session_rsvps (
    id SERIAL PRIMARY KEY,
    session_id INT REFERENCES training_sessions(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'RSVPEd',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_session_rsvp UNIQUE(session_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_training_sessions_time ON training_sessions(start_time);
