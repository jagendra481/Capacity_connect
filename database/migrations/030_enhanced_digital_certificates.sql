-- Migration 030: Enhanced Digital Certificate System with Canonical SHA-256 & Admin Approval Workflow
-- Ministry of Earth Sciences / Capacity Connect

-- 1. Alter Certificates table to support snapshotting, canonical SHA-256, and approval states
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS certificate_id VARCHAR(50) UNIQUE;
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS trainee_name_snapshot VARCHAR(255);
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS course_name_snapshot VARCHAR(255);
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS issuing_organization VARCHAR(255) DEFAULT 'Ministry of Earth Sciences - Capacity Connect';
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS sha256_hash VARCHAR(64);
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS approved_by INT REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS rejected_by INT REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS revoked_by INT REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS revoked_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS revocation_reason TEXT;
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS verification_count INT DEFAULT 0;
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Create Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_certificates_cert_id ON certificates(certificate_id);
CREATE INDEX IF NOT EXISTS idx_certificates_sha256 ON certificates(sha256_hash);
CREATE INDEX IF NOT EXISTS idx_certificates_status ON certificates(status);

-- 2. Create Certificate Audit Logs table for tamper-evident activity tracking
CREATE TABLE IF NOT EXISTS certificate_audit_logs (
    id SERIAL PRIMARY KEY,
    certificate_id INT NOT NULL REFERENCES certificates(id) ON DELETES_CASCADE,
    action VARCHAR(50) NOT NULL,
    performed_by INT REFERENCES users(id) ON DELETE SET NULL,
    reason TEXT,
    metadata JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cert_audit_cert_id ON certificate_audit_logs(certificate_id);
CREATE INDEX IF NOT EXISTS idx_cert_audit_action ON certificate_audit_logs(action);
