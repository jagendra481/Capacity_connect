INSERT INTO skills (id, name, category, description) VALUES
(1, 'React.js Architecture', 'Engineering', 'State management, virtual DOM optimization & components'),
(2, 'Node.js Microservices', 'Engineering', 'Async event loop, Express REST APIs & microservices'),
(3, 'PostgreSQL Database Tuning', 'Database', 'Relational design, indexing & query execution plans'),
(4, 'AI RAG & Embeddings', 'AI', 'Retrieval-Augmented Generation & vector search'),
(5, 'Cyber Security & DevSecOps', 'Security', 'JWT validation, CORS & application security')
ON CONFLICT (id) DO NOTHING;
