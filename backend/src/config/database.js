const { Pool } = require('pg');
const env = require('./env');
const logger = require('../utils/logger');
const bcrypt = require('bcryptjs');

let pool = null;
let isPgConnected = false;

// In-memory data store as resilient fallback if PostgreSQL is offline
const memoryStore = {
  users: [],
  roles: [
    { id: 1, name: 'trainee', description: 'Trainee learner' },
    { id: 2, name: 'trainer', description: 'Instructor / Content Creator' },
    { id: 3, name: 'administrator', description: 'System Administrator' },
    { id: 4, name: 'super_admin', description: 'Super Administrator' },
  ],
  departments: [
    { id: 1, name: 'Ocean Sciences & Climate Modeling', code: 'OSCM' },
    { id: 2, name: 'Geospatial Intelligence & Remote Sensing', code: 'GIRS' },
    { id: 3, name: 'Meteorological Computational Analysis', code: 'MCA' },
    { id: 4, name: 'Polar & Marine Research Division', code: 'PMRD' },
    { id: 5, name: 'Executive Capacity Building & Governance', code: 'ECBG' },
  ],
  userProfiles: [],
  courses: [],
  courseModules: [],
  lessons: [],
  resources: [],
  learningResources: [],
  courseProgress: [],
  skills: [],
  roleSkills: [],
  userSkills: [],
  skillGaps: [],
  assessments: [],
  questions: [],
  assessmentAttempts: [],
  competencies: [],
  recommendations: [],
  learningPaths: [],
  knowledgePosts: [],
  comments: [],
  likes: [],
  badges: [],
  userBadges: [],
  xpTransactions: [],
  trainingSessions: [],
  registrations: [],
  certificates: [],
  certificateAuditLogs: [],
  adminActivityLogs: [],
  announcements: [],
  notifications: [],
  aiConversations: [],
  aiMessages: []
};

// Seed initial memory store demo data
const initializeMemoryStore = async () => {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Password123!', salt);

  memoryStore.users = [
    {
      id: 1,
      email: 'trainee@capacityconnect.com',
      password_hash: passwordHash,
      role: 'trainee',
      department_id: 1,
      full_name: 'Alex Johnson',
      email_verified: true,
      status: 'active',
      created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
      last_login_at: new Date(Date.now() - 1 * 86400000).toISOString()
    },
    {
      id: 2,
      email: 'trainer@capacityconnect.com',
      password_hash: passwordHash,
      role: 'trainer',
      department_id: 1,
      full_name: 'Dr. Sarah Connor',
      email_verified: true,
      status: 'active',
      created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
      last_login_at: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: 3,
      email: 'admin@capacityconnect.com',
      password_hash: passwordHash,
      role: 'administrator',
      department_id: 5,
      full_name: 'Marcus Vance',
      email_verified: true,
      status: 'active',
      created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
      last_login_at: new Date().toISOString()
    },
    {
      id: 4,
      email: 'priya.sharma@moes.gov.in',
      password_hash: passwordHash,
      role: 'trainee',
      department_id: 2,
      full_name: 'Priya Sharma',
      email_verified: true,
      status: 'active',
      created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
      last_login_at: new Date(Date.now() - 1 * 86400000).toISOString()
    },
    {
      id: 5,
      email: 'rahul.verma@incois.gov.in',
      password_hash: passwordHash,
      role: 'trainee',
      department_id: 1,
      full_name: 'Rahul Verma',
      email_verified: true,
      status: 'pending_approval',
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      last_login_at: null
    },
    {
      id: 6,
      email: 'anand.roy@iitd.ac.in',
      password_hash: passwordHash,
      role: 'trainer',
      department_id: 3,
      full_name: 'Prof. Anand Roy',
      email_verified: true,
      status: 'active',
      created_at: new Date(Date.now() - 45 * 86400000).toISOString(),
      last_login_at: new Date(Date.now() - 4 * 86400000).toISOString()
    },
    {
      id: 7,
      email: 'neha.gupta@moes.gov.in',
      password_hash: passwordHash,
      role: 'trainee',
      department_id: 4,
      full_name: 'Neha Gupta',
      email_verified: true,
      status: 'suspended',
      suspension_reason: 'Account undergoing annual security policy reverification.',
      created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
      last_login_at: new Date(Date.now() - 10 * 86400000).toISOString()
    },
    {
      id: 8,
      email: 'superadmin@capacityconnect.com',
      password_hash: passwordHash,
      role: 'super_admin',
      department_id: 5,
      full_name: 'Chief Admin Rajan',
      email_verified: true,
      status: 'active',
      created_at: new Date(Date.now() - 120 * 86400000).toISOString(),
      last_login_at: new Date().toISOString()
    }
  ];

  memoryStore.userProfiles = [
    {
      user_id: 1,
      designation: 'Computational Oceanographer',
      phone: '+91 98111 22334',
      organization: 'Ministry of Earth Sciences - INCOIS',
      qualifications: 'M.Sc Marine Geophysics',
      experience: '4 Years in Satellite Data Analytics',
      skills: ['Ocean Data Processing', 'Satellite Remote Sensing', 'Python Machine Learning'],
      bio: 'Dedicated researcher contributing to national marine data modeling.',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      xp: 1450,
      streak_days: 12,
      competency_score: 92
    },
    {
      user_id: 2,
      designation: 'Principal Capacity Building Trainer',
      phone: '+91 98222 33445',
      organization: 'National Centre for Coastal Research',
      qualifications: 'Ph.D in Atmospheric Sciences & Distributed Systems',
      experience: '12 Years Senior Faculty & Training Lead',
      skills: ['Distributed Architecture', 'Full-Stack Engineering', 'API Design', 'Cloud Deployments'],
      bio: 'Leading technical training programs across MoES premier autonomous institutes.',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
      xp: 4500,
      streak_days: 45,
      competency_score: 98
    },
    {
      user_id: 3,
      designation: 'Chief Capacity Development Officer',
      phone: '+91 98333 44556',
      organization: 'Ministry of Earth Sciences, Govt. of India',
      qualifications: 'M.Tech Computer Science & Public Administration',
      experience: '15 Years Enterprise Governance',
      skills: ['Organizational Governance', 'Competency Frameworks', 'Audit Compliance'],
      bio: 'Overseeing organizational skill development and strategic capacity growth.',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      xp: 5000,
      streak_days: 60,
      competency_score: 100
    },
    {
      user_id: 4,
      designation: 'Senior Remote Sensing Scientist',
      phone: '+91 98444 55667',
      organization: 'National Remote Sensing Centre (NRSC)',
      qualifications: 'M.Tech Remote Sensing & GIS',
      experience: '6 Years Geospatial Mapping',
      skills: ['GIS', 'Geospatial Analysis', 'Hyperspectral Imaging'],
      bio: 'Specialist in satellite observation and geospatial capacity development.',
      avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
      xp: 1800,
      streak_days: 14,
      competency_score: 89
    },
    {
      user_id: 5,
      designation: 'Junior Ocean Modeler (Trainee)',
      phone: '+91 98555 66778',
      organization: 'Indian National Centre for Ocean Information Services',
      qualifications: 'B.Tech Environmental Engineering',
      experience: '1 Year Research Fellow',
      skills: ['Python', 'Basic Oceanography'],
      bio: 'Newly registered candidate awaiting administrative onboarding review.',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
      xp: 200,
      streak_days: 2,
      competency_score: 65
    },
    {
      user_id: 6,
      designation: 'Professor & AI in Climate Lead',
      phone: '+91 98666 77889',
      organization: 'Indian Institute of Technology Delhi',
      qualifications: 'Ph.D AI & High Performance Computing',
      experience: '18 Years Academic & Applied AI Research',
      skills: ['Machine Learning', 'RAG Architectures', 'Vector Search', 'HPC'],
      bio: 'Visiting expert conducting advanced AI modules for earth science professionals.',
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
      xp: 4200,
      streak_days: 30,
      competency_score: 97
    },
    {
      user_id: 7,
      designation: 'Polar Researcher',
      phone: '+91 98777 88990',
      organization: 'National Centre for Polar and Ocean Research',
      qualifications: 'M.Sc Glaciology',
      experience: '5 Years Antarctic Expeditions',
      skills: ['Cryosphere Studies', 'Climate Trends'],
      bio: 'Member of Antarctica research mission currently undergoing credential update.',
      avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
      xp: 1100,
      streak_days: 0,
      competency_score: 80
    },
    {
      user_id: 8,
      designation: 'Super Administrator & Director of Systems',
      phone: '+91 98888 99001',
      organization: 'Ministry of Earth Sciences Executive Council',
      qualifications: 'Executive Director of Technology',
      experience: '20+ Years Strategic Management',
      skills: ['System Security', 'RBAC Governance', 'Root Authority'],
      bio: 'Root system administrator holding top-level security clearances.',
      avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
      xp: 10000,
      streak_days: 100,
      competency_score: 100
    }
  ];

  memoryStore.courses = [
    {
      id: 101,
      title: 'Modern React Architecture & Performance',
      description: 'Build production-ready React applications with component design, hooks, routing, state patterns, performance tuning, and deployment practices.',
      category: 'Engineering',
      level: 'Advanced',
      duration: '12h 00m',
      trainer_id: 2,
      trainer_name: 'Dr. Sarah Connor',
      status: 'published',
      enrolledCount: 18,
      completionRate: 85,
      avgScore: 92,
    },
    {
      id: 102,
      title: 'Node.js, Express & API Engineering',
      description: 'Develop secure backend services with Node.js, Express, REST APIs, routing, middleware, data persistence, and an MVC structure.',
      category: 'Engineering',
      level: 'Intermediate',
      duration: '10h 30m',
      trainer_id: 2,
      trainer_name: 'Dr. Sarah Connor',
      status: 'published',
      enrolledCount: 14,
      completionRate: 78,
      avgScore: 88,
    },
    {
      id: 103,
      title: 'PostgreSQL Querying & Database Performance',
      description: 'Design reliable relational databases, write expressive SQL, understand joins and transactions, and apply indexing and query-performance techniques.',
      category: 'Database',
      level: 'Intermediate',
      duration: '8h 00m',
      trainer_id: 2,
      trainer_name: 'Dr. Sarah Connor',
      status: 'published',
      enrolledCount: 12,
      completionRate: 90,
      avgScore: 94,
    },
    {
      id: 104,
      title: 'Production RAG Systems & Vector Search',
      description: 'Create grounded AI applications with document indexing, embeddings, vector retrieval, prompt construction, evaluation, and advanced RAG patterns.',
      category: 'AI',
      level: 'Advanced',
      duration: '9h 00m',
      trainer_id: 6,
      trainer_name: 'Prof. Anand Roy',
      status: 'published',
      enrolledCount: 9,
      completionRate: 70,
      avgScore: 86,
    },
    {
      id: 105,
      title: 'Python Foundations for Automation & Data',
      description: 'Gain a practical Python foundation covering core syntax, data structures, functions, modules, virtual environments, and automation workflows.',
      category: 'Programming',
      level: 'Beginner',
      duration: '15h 00m',
      trainer_id: 2,
      trainer_name: 'Dr. Sarah Connor',
      status: 'published',
      enrolledCount: 22,
      completionRate: 95,
      avgScore: 91,
    }
  ];

  memoryStore.courseProgress = [
    { id: 1, user_id: 1, course_id: 101, lesson_id: 10101, completed: true, progress_percentage: 100, last_accessed: new Date(Date.now() - 7 * 86400000).toISOString() },
    { id: 2, user_id: 1, course_id: 101, lesson_id: 10102, completed: true, progress_percentage: 100, last_accessed: new Date(Date.now() - 7 * 86400000).toISOString() },
    { id: 3, user_id: 1, course_id: 101, lesson_id: 10111, completed: true, progress_percentage: 100, last_accessed: new Date(Date.now() - 7 * 86400000).toISOString() },
    { id: 4, user_id: 1, course_id: 101, lesson_id: 10112, completed: true, progress_percentage: 100, last_accessed: new Date(Date.now() - 7 * 86400000).toISOString() },
    { id: 5, user_id: 1, course_id: 101, lesson_id: 10121, completed: true, progress_percentage: 100, last_accessed: new Date(Date.now() - 7 * 86400000).toISOString() },
    { id: 6, user_id: 1, course_id: 101, lesson_id: 10122, completed: true, progress_percentage: 100, last_accessed: new Date(Date.now() - 7 * 86400000).toISOString() },
    { id: 7, user_id: 1, course_id: 101, lesson_id: 10131, completed: true, progress_percentage: 100, last_accessed: new Date(Date.now() - 7 * 86400000).toISOString() },
    { id: 8, user_id: 1, course_id: 101, lesson_id: 10132, completed: true, progress_percentage: 100, last_accessed: new Date(Date.now() - 7 * 86400000).toISOString() },
    { id: 9, user_id: 4, course_id: 101, lesson_id: 10101, completed: true, progress_percentage: 75, last_accessed: new Date(Date.now() - 3 * 86400000).toISOString() },
    { id: 10, user_id: 4, course_id: 101, lesson_id: 10102, completed: true, progress_percentage: 75, last_accessed: new Date(Date.now() - 3 * 86400000).toISOString() },
  ];

  memoryStore.learningResources = [
    {
      id: 1,
      title: 'Advanced React 18 Patterns & Component Lifecycle Architecture',
      description: 'Comprehensive video lecture on decoupling business state, memory leak prevention, and server-side hydration.',
      resource_type: 'lecture_video',
      file_url: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
      course_id: 101,
      trainer_id: 2,
      duration_minutes: 48,
      status: 'active',
      created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    },
    {
      id: 2,
      title: 'Full-Stack Architecture & Microservices Implementation Blueprint (PPTX)',
      description: 'Official Ministry slides explaining domain-driven design, event brokers (Kafka/RabbitMQ), and API security.',
      resource_type: 'presentation',
      file_url: '/materials/microservices-architecture-blueprint.pptx',
      course_id: 101,
      trainer_id: 2,
      file_size_bytes: 4820000,
      status: 'active',
      created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
    },
    {
      id: 3,
      title: 'Enterprise PostgreSQL Indexing & EXPLAIN ANALYZE Handbook',
      description: 'Technical reference manual covering B-Tree, GIN indexes, transaction isolation levels, and vacuuming strategies.',
      resource_type: 'pdf_document',
      file_url: '/materials/postgresql-performance-tuning-guide.pdf',
      course_id: 103,
      trainer_id: 2,
      file_size_bytes: 2450000,
      status: 'active',
      created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    },
    {
      id: 4,
      title: 'Production RAG Vector Search & Chunking Strategy Manual',
      description: 'Practical guide to high-density vector retrieval, hybrid BM25 search, and hallucination reduction benchmarks.',
      resource_type: 'study_guide',
      file_url: '/materials/production-rag-handbook.pdf',
      course_id: 104,
      trainer_id: 6,
      file_size_bytes: 3100000,
      status: 'active',
      created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    }
  ];

  memoryStore.announcements = [
    {
      id: 1,
      title: 'National Ocean Sciences Capacity Development Mission 2026 Launched',
      content: 'The Ministry of Earth Sciences has inaugurated the 2026 digital competency initiative across all autonomous units (INCOIS, IMD, NCMRWF, NIOT). Complete your enrolled courses to receive official verified credentials.',
      category: 'Mission Update',
      target_audience: 'all',
      priority: 'high',
      status: 'published',
      published_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      created_by: 3,
      created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
    {
      id: 2,
      title: 'Mandatory Quarterly Assessment Window Open for Technical Staff',
      content: 'All enrolled trainees must attempt and clear the required MCQ competency benchmarks before the end of the current evaluation cycle to remain eligible for digital certificates.',
      category: 'Assessment',
      target_audience: 'trainee',
      priority: 'normal',
      status: 'published',
      published_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      created_by: 3,
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: 3,
      title: 'Instructor Briefing: New Curriculum Mapping System Available',
      content: 'Trainers can now map subject competencies, upload lecture recordings, and attach question banks directly from the Trainer Portal.',
      category: 'Trainer Advisory',
      target_audience: 'trainer',
      priority: 'normal',
      status: 'published',
      published_at: new Date(Date.now() - 1 * 86400000).toISOString(),
      created_by: 3,
      created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    }
  ];

  memoryStore.adminActivityLogs = [
    {
      id: 1,
      action: 'ADMIN_LOGIN',
      performed_by: 3,
      performed_by_name: 'Marcus Vance',
      target_entity: 'SESSION',
      target_id: 'SES-001',
      details: 'Administrator Marcus Vance authenticated to Executive Governance Console.',
      ip_address: '10.0.4.12',
      created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    {
      id: 2,
      action: 'CERTIFICATE_APPROVED',
      performed_by: 3,
      performed_by_name: 'Marcus Vance',
      target_entity: 'CERTIFICATE',
      target_id: 'MOES-2026-7B9A2F1C',
      details: 'Approved completion certificate for Alex Johnson on Full-Stack Enterprise Architecture course.',
      ip_address: '10.0.4.12',
      created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    },
    {
      id: 3,
      action: 'COURSE_PUBLISHED',
      performed_by: 3,
      performed_by_name: 'Marcus Vance',
      target_entity: 'COURSE',
      target_id: '101',
      details: 'Published course Modern React Architecture & Performance with Dr. Sarah Connor assigned.',
      ip_address: '10.0.4.12',
      created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    },
    {
      id: 4,
      action: 'USER_REGISTERED',
      performed_by: 5,
      performed_by_name: 'Rahul Verma',
      target_entity: 'USER',
      target_id: '5',
      details: 'New trainee Rahul Verma registered from INCOIS, queued for administrative review.',
      ip_address: '10.0.2.88',
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    }
  ];

  memoryStore.certificateAuditLogs = [
    {
      id: 1,
      certificate_id: 1,
      action: 'GENERATED',
      performed_by: 1,
      reason: 'Course completed. Certificate generated in pending approval status.',
      metadata: { certificate_id: 'MOES-2026-7B9A2F1C', sha256_hash: '3af57f09574aa4973507955f0296a44a0f6a6dac325dbcead8dbca74ac831974' },
      timestamp: new Date(Date.now() - 7 * 86400000).toISOString(),
    },
    {
      id: 2,
      certificate_id: 1,
      action: 'APPROVED',
      performed_by: 3,
      reason: 'Course completion verified and approved by administrator Marcus Vance.',
      metadata: { approved_at: new Date(Date.now() - 6 * 86400000).toISOString() },
      timestamp: new Date(Date.now() - 6 * 86400000).toISOString(),
    },
    {
      id: 3,
      certificate_id: 2,
      action: 'GENERATED',
      performed_by: 1,
      reason: 'Course completed. Certificate generated in pending approval status.',
      metadata: { certificate_id: 'MOES-2026-4A2D8F9E', sha256_hash: '488963426e4940c06cdaee3da389ad3ef7b1de276facdde47dd987db819262b1' },
      timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
    }
  ];

  memoryStore.certificates = [
    {
      id: 1,
      certificate_id: 'MOES-2026-7B9A2F1C',
      certificate_hash: 'MOES-2026-7B9A2F1C',
      user_id: 1,
      user_name: 'Alex Johnson',
      trainee_name_snapshot: 'Alex Johnson',
      course_id: 101,
      course_name_snapshot: 'Modern React Architecture & Performance',
      assessment_id: 1,
      title: 'Modern React Architecture & Performance',
      issuing_organization: 'Ministry of Earth Sciences - Capacity Connect',
      sha256_hash: '3af57f09574aa4973507955f0296a44a0f6a6dac325dbcead8dbca74ac831974',
      status: 'approved',
      issued_date: '2026-02-28T10:00:00.000Z',
      completion_date: '2026-02-28',
      approved_by: 3,
      approved_at: new Date(Date.now() - 6 * 86400000).toISOString(),
      rejected_by: null,
      rejected_at: null,
      rejection_reason: null,
      revoked_by: null,
      revoked_at: null,
      revocation_reason: null,
      verification_count: 14,
      last_verified_at: new Date(Date.now() - 1 * 86400000).toISOString(),
      verification_url: 'http://localhost:5173/certificates/verify/MOES-2026-7B9A2F1C',
      metadata: { department: 'Ocean Sciences & Climate Modeling', grade: 'Distinction' }
    },
    {
      id: 2,
      certificate_id: 'MOES-2026-4A2D8F9E',
      certificate_hash: 'MOES-2026-4A2D8F9E',
      user_id: 1,
      user_name: 'Alex Johnson',
      trainee_name_snapshot: 'Alex Johnson',
      course_id: 102,
      course_name_snapshot: 'Node.js, Express & API Engineering',
      assessment_id: 2,
      title: 'Node.js, Express & API Engineering',
      issuing_organization: 'Ministry of Earth Sciences - Capacity Connect',
      sha256_hash: '488963426e4940c06cdaee3da389ad3ef7b1de276facdde47dd987db819262b1',
      status: 'pending_approval',
      issued_date: '2026-03-03T14:30:00.000Z',
      completion_date: '2026-03-03',
      approved_by: null,
      approved_at: null,
      rejected_by: null,
      rejected_at: null,
      rejection_reason: null,
      revoked_by: null,
      revoked_at: null,
      revocation_reason: null,
      verification_count: 0,
      last_verified_at: null,
      verification_url: 'http://localhost:5173/certificates/verify/MOES-2026-4A2D8F9E',
      metadata: { department: 'Ocean Sciences & Climate Modeling' }
    }
  ];
};

const connectDb = async () => {
  try {
    pool = new Pool({
      connectionString: env.databaseUrl,
      connectionTimeoutMillis: 2000,
    });
    const client = await pool.connect();
    isPgConnected = true;
    client.release();
    logger.info('Connected to PostgreSQL Database successfully');
  } catch (error) {
    logger.warn(`PostgreSQL connection failed: ${error.message}. Running with resilient memory datastore mode.`);
    isPgConnected = false;
    await initializeMemoryStore();
  }
};

const query = async (text, params) => {
  if (isPgConnected && pool) {
    return pool.query(text, params);
  }
  return { rows: [], rowCount: 0 };
};

module.exports = {
  connectDb,
  query,
  getIsPgConnected: () => isPgConnected,
  memoryStore,
};
