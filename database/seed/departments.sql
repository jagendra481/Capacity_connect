INSERT INTO departments (id, name, code, description) VALUES
(1, 'Software Engineering', 'ENG', 'Full-stack, backend, frontend development & DevOps'),
(2, 'Data Science & AI', 'DS', 'Machine learning, analytics & AI model development'),
(3, 'Cyber Security', 'SEC', 'App security, SOC operations & compliance'),
(4, 'Human Resources', 'HR', 'Organizational development & talent learning'),
(5, 'Product Management', 'PM', 'Product strategy & UX research')
ON CONFLICT (id) DO NOTHING;
