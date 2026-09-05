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
  ],
  departments: [
    { id: 1, name: 'Software Engineering', code: 'ENG' },
    { id: 2, name: 'Data Science & AI', code: 'DS' },
    { id: 3, name: 'Cyber Security', code: 'SEC' },
    { id: 4, name: 'Human Resources', code: 'HR' },
    { id: 5, name: 'Product Management', code: 'PM' },
  ],
  userProfiles: [],
  courses: [],
  courseModules: [],
  lessons: [],
  resources: [],
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
  notifications: [],
  aiConversations: [],
  aiMessages: []
};

const fs = require('fs');
const path = require('path');
const storeFilePath = path.join(__dirname, 'memory_backup.json');

const saveMemoryStore = () => {
  try {
    const dataToSave = {
      users: memoryStore.users,
      userProfiles: memoryStore.userProfiles,
    };
    fs.writeFileSync(storeFilePath, JSON.stringify(dataToSave, null, 2), 'utf-8');
  } catch (err) {
    logger.warn(`Failed to persist memoryStore: ${err.message}`);
  }
};

const loadMemoryStoreFromFile = () => {
  try {
    if (fs.existsSync(storeFilePath)) {
      const content = fs.readFileSync(storeFilePath, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed.users) && parsed.users.length > 0) {
        memoryStore.users = parsed.users;
      }
      if (Array.isArray(parsed.userProfiles) && parsed.userProfiles.length > 0) {
        memoryStore.userProfiles = parsed.userProfiles;
      }
      return true;
    }
  } catch (err) {
    logger.warn(`Failed to read memoryStore backup: ${err.message}`);
  }
  return false;
};

// Seed initial memory store demo data
const initializeMemoryStore = async () => {
  const loaded = loadMemoryStoreFromFile();
  if (loaded && memoryStore.users.length > 0) {
    logger.info(`[MEMORY STORE] Loaded ${memoryStore.users.length} persisted users from disk.`);
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Password123!', salt);
  const adminPasswordHash = await bcrypt.hash('admin123', salt);

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
      created_at: new Date().toISOString()
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
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      email: 'admin@capacityconnect.com',
      password_hash: passwordHash,
      role: 'administrator',
      department_id: 4,
      full_name: 'Marcus Vance',
      email_verified: true,
      status: 'active',
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      email: 'capacityadmin@gmail.com',
      password_hash: adminPasswordHash,
      role: 'administrator',
      department_id: 4,
      full_name: 'Capacity Administrator',
      email_verified: true,
      status: 'active',
      created_at: new Date().toISOString()
    }
  ];

  memoryStore.userProfiles = [
    {
      user_id: 1,
      designation: 'Junior Full-Stack Engineer',
      bio: 'Enthusiastic developer focusing on modern web apps and cloud architecture.',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      xp: 0,
      streak_days: 0,
      competency_score: 0
    },
    {
      user_id: 2,
      designation: 'Principal Technical Trainer',
      bio: 'Over 10 years of enterprise training experience in distributed systems.',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
      xp: 0,
      streak_days: 0,
      competency_score: 0
    },
    {
      user_id: 3,
      designation: 'Chief Capacity Officer',
      bio: 'Overseeing organizational skill development and strategic capacity growth.',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      xp: 0,
      streak_days: 0,
      competency_score: 0
    },
    {
      user_id: 4,
      designation: 'Chief Platform Administrator',
      bio: 'System Administrator for Capacity Connect.',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=capacityadmin',
      xp: 0,
      streak_days: 0,
      competency_score: 0
    }
  ];

  saveMemoryStore();
  memoryStore.courses = [
    {
      id: 1,
      title: 'Full-Stack Enterprise Architecture & Microservices',
      description: 'Master enterprise software engineering with React, Node.js, Microservices, Clean Architecture, and Kubernetes.',
      category: 'Software Engineering',
      level: 'Intermediate',
      duration: '12 Hours',
      prerequisites: 'Basic JavaScript & Web Fundamentals',
      trainer_name: 'Dr. Sarah Connor',
    },
    {
      id: 2,
      title: 'Data Science & Machine Learning Pipeline Engineering',
      description: 'Build end-to-end data processing pipelines using Python, SQL, Kafka, BigQuery, and Machine Learning models.',
      category: 'Data Science & AI',
      level: 'Advanced',
      duration: '16 Hours',
      prerequisites: 'Python & Linear Algebra',
      trainer_name: 'Dr. Sarah Connor',
    }
  ];

  memoryStore.courseModules = [
    { id: 101, course_id: 1, title: 'Module 1: Clean Architecture & API Design', module_order: 1 },
    { id: 102, course_id: 1, title: 'Module 2: State Management & Microservices', module_order: 2 },
    { id: 201, course_id: 2, title: 'Module 1: Data Pipelines & Feature Engineering', module_order: 1 },
  ];

  memoryStore.lessons = [
    {
      id: 1001,
      module_id: 101,
      module_title: 'Module 1: Clean Architecture & API Design',
      lesson_order: 1,
      title: 'Clean Architecture Principles & Domain Decoupling',
      content: 'Clean Architecture decouples core business domain logic from UIcomponents, database drivers, and third-party frameworks using entity layers and dependency inversion.',
      summary: 'Clean architecture isolates enterprise business rules from framework changes.',
    },
    {
      id: 1002,
      module_id: 101,
      module_title: 'Module 1: Clean Architecture & API Design',
      lesson_order: 2,
      title: 'RESTful API Standards & JWT Security Protocols',
      content: 'REST APIs utilize HTTP methods (GET, POST, PUT, DELETE) with Bearer token authentication to enforce stateless role-based authorization headers.',
      summary: 'Bearer JWT tokens secure backend APIs across distributed microservices.',
    },
    {
      id: 1003,
      module_id: 102,
      module_title: 'Module 2: State Management & Microservices',
      lesson_order: 1,
      title: 'Microservices Communication & Event-Driven Systems',
      content: 'Microservices communicate asynchronously via message queues such as Kafka or RabbitMQ, ensuring domain decoupling and fault-tolerant scalability.',
      summary: 'Event-driven systems use message brokers for high-throughput microservices.',
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
      course_id: 1,
      course_name_snapshot: 'Full-Stack Enterprise Architecture & Microservices',
      assessment_id: null,
      title: 'Full-Stack Enterprise Architecture & Microservices',
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
      metadata: { department: 'Software Engineering', grade: 'Distinction' }
    },
    {
      id: 2,
      certificate_id: 'MOES-2026-4A2D8F9E',
      certificate_hash: 'MOES-2026-4A2D8F9E',
      user_id: 1,
      user_name: 'Alex Johnson',
      trainee_name_snapshot: 'Alex Johnson',
      course_id: 2,
      course_name_snapshot: 'Data Science & Machine Learning Pipeline Engineering',
      assessment_id: null,
      title: 'Data Science & Machine Learning Pipeline Engineering',
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
      metadata: { department: 'Data Science & AI' }
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
  saveMemoryStore,
};
