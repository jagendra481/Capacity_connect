-- Create Capacity Radar Metrics Table
CREATE TABLE IF NOT EXISTS capacity_radar_metrics (
    id SERIAL PRIMARY KEY,
    department_id INT REFERENCES departments(id) ON DELETE CASCADE,
    technical_competency INT DEFAULT 75,
    process_maturity INT DEFAULT 70,
    tool_proficiency INT DEFAULT 80,
    domain_knowledge INT DEFAULT 85,
    innovation_ai_readiness INT DEFAULT 65,
    leadership_mentorship INT DEFAULT 60,
    overall_score INT DEFAULT 73,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_capacity_radar_dept ON capacity_radar_metrics(department_id);
