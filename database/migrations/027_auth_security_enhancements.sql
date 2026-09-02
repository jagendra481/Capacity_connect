-- Migration 027: Auth Security & Email Verification OTP
ALTER TABLE users ADD COLUMN IF NOT EXISTS designation VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS employee_student_id VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image VARCHAR(500);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;

-- Create Email Verification OTPs table
CREATE TABLE IF NOT EXISTS email_verification_otps (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    otp_hash VARCHAR(255) NOT NULL,
    purpose VARCHAR(50) NOT NULL DEFAULT 'email_verification',
    attempts INT DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_otps_email_purpose ON email_verification_otps(email, purpose);
