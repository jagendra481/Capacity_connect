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
    }
  ];

  memoryStore.userProfiles = [
    {
      user_id: 1,
      designation: 'Junior Full-Stack Engineer',
      bio: 'Enthusiastic developer focusing on modern web apps and cloud architecture.',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      xp: 450,
      streak_days: 5,
      competency_score: 72
    },
    {
      user_id: 2,
      designation: 'Principal Technical Trainer',
      bio: 'Over 10 years of enterprise training experience in distributed systems.',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
      xp: 1200,
      streak_days: 14,
      competency_score: 95
    },
    {
      user_id: 3,
      designation: 'Chief Capacity Officer',
      bio: 'Overseeing organizational skill development and strategic capacity growth.',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      xp: 2500,
      streak_days: 30,
      competency_score: 98
    }
  ];

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
      content: 'Clean Architecture decouples core business domain logic from UI components, database drivers, and third-party frameworks using entity layers and dependency inversion.',
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
  // Memory store fallback handler (simulated responses)
  return { rows: [], rowCount: 0 };
};

module.exports = {
  connectDb,
  query,
  getIsPgConnected: () => isPgConnected,
  memoryStore,
};
