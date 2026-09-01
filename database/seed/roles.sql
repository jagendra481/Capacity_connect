INSERT INTO roles (id, name, description) VALUES
(1, 'trainee', 'Trainee learner'),
(2, 'trainer', 'Instructor / Content Creator'),
(3, 'administrator', 'System Administrator')
ON CONFLICT (id) DO NOTHING;
