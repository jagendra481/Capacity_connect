-- Migration 029: Add status column to certificates table for Admin Approval workflow
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'approved';
CREATE INDEX IF NOT EXISTS idx_certificates_status ON certificates(status);
