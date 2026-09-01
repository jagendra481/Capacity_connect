-- Password for demo users: Password123!
INSERT INTO users (id, email, password_hash, role, department_id, full_name, status) VALUES
(1, 'trainee@capacityconnect.com', '$2a$10$e7QJ1V019Wd/vWw6E/sMceCjY7gPq.Xh9B02v9d1502rY2J940sP2', 'trainee', 1, 'Alex Johnson', 'active'),
(2, 'trainer@capacityconnect.com', '$2a$10$e7QJ1V019Wd/vWw6E/sMceCjY7gPq.Xh9B02v9d1502rY2J940sP2', 'trainer', 1, 'Dr. Sarah Connor', 'active'),
(3, 'admin@capacityconnect.com', '$2a$10$e7QJ1V019Wd/vWw6E/sMceCjY7gPq.Xh9B02v9d1502rY2J940sP2', 'administrator', 4, 'Marcus Vance', 'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_profiles (user_id, designation, bio, xp, streak_days, competency_score) VALUES
(1, 'Junior Full-Stack Engineer', 'Enthusiastic developer focusing on modern web apps', 450, 5, 72),
(2, 'Principal Technical Trainer', 'Over 10 years of enterprise training experience', 1200, 14, 95),
(3, 'Chief Capacity Officer', 'Overseeing organizational capacity and strategic learning', 2500, 30, 98)
ON CONFLICT (user_id) DO NOTHING;
