const { Pool } = require('pg');
const env = require('./env');
const logger = require('../utils/logger');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

let pool = null;
let isPgConnected = false;

const MEMORY_BACKUP_PATH = path.join(__dirname, 'memory_backup.json');

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

// Persistence helper for in-memory store
const saveMemoryStore = () => {
  try {
    const dataToSave = {
      users: memoryStore.users,
      userProfiles: memoryStore.userProfiles,
      courses: memoryStore.courses,
      certificates: memoryStore.certificates,
      adminActivityLogs: memoryStore.adminActivityLogs,
      announcements: memoryStore.announcements,
      learningResources: memoryStore.learningResources,
    };
    fs.writeFileSync(MEMORY_BACKUP_PATH, JSON.stringify(dataToSave, null, 2), 'utf8');
  } catch (err) {
    logger.warn(`Failed to persist memoryStore backup: ${err.message}`);
  }
};

const loadMemoryStoreFromFile = () => {
  try {
    if (fs.existsSync(MEMORY_BACKUP_PATH)) {
      const raw = fs.readFileSync(MEMORY_BACKUP_PATH, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.users) && parsed.users.length > 0) {
        memoryStore.users = parsed.users;
      }
      if (Array.isArray(parsed.userProfiles) && parsed.userProfiles.length > 0) {
        memoryStore.userProfiles = parsed.userProfiles;
      }
      if (Array.isArray(parsed.courses) && parsed.courses.length > 0) {
        memoryStore.courses = parsed.courses;
      }
      if (Array.isArray(parsed.certificates) && parsed.certificates.length > 0) {
        memoryStore.certificates = parsed.certificates;
      }
      if (Array.isArray(parsed.adminActivityLogs) && parsed.adminActivityLogs.length > 0) {
        memoryStore.adminActivityLogs = parsed.adminActivityLogs;
      }
      if (Array.isArray(parsed.announcements) && parsed.announcements.length > 0) {
        memoryStore.announcements = parsed.announcements;
      }
      if (Array.isArray(parsed.learningResources) && parsed.learningResources.length > 0) {
        memoryStore.learningResources = parsed.learningResources;
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
  loadMemoryStoreFromFile();

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Password123!', salt);
  const adminPasswordHash = await bcrypt.hash('admin123', salt);

  if (!memoryStore.users || memoryStore.users.length === 0) {
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
        email: 'capacityadmin@gmail.com',
        password_hash: adminPasswordHash,
        role: 'administrator',
        department_id: 5,
        full_name: 'Capacity Administrator',
        email_verified: true,
        status: 'active',
        created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
        last_login_at: new Date().toISOString()
      },
      {
        id: 5,
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
        id: 6,
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
        id: 7,
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
        id: 8,
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
        id: 9,
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
  }

  if (!memoryStore.userProfiles || memoryStore.userProfiles.length === 0) {
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
        designation: 'Central Systems Administrator',
        phone: '+91 98000 11223',
        organization: 'Ministry of Earth Sciences (MoES / IMD)',
        qualifications: 'B.Tech IT & Security Administration',
        experience: '8 Years Database & Platform Governance',
        skills: ['System Administration', 'Database Management', 'Access Control'],
        bio: 'Administrator account for platform management and capacity audits.',
        avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
        xp: 5000,
        streak_days: 30,
        competency_score: 100
      },
      {
        user_id: 5,
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
      }
    ];
  }

  if (!memoryStore.courses || memoryStore.courses.length === 0) {
    memoryStore.courses = [
      {
        id: 101,
        title: 'Modern React Architecture & Performance',
        description: 'Master component decoupling, micro-frontends, custom hooks, and rendering optimization.',
        category: 'Engineering & Ocean Tech',
        level: 'intermediate',
        duration_hours: 40,
        max_enrollment: 100,
        trainer_id: 2,
        is_published: true,
        created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
      },
      {
        id: 102,
        title: 'Node.js, Express & API Engineering',
        description: 'Backend architectural design, secure RESTful APIs, rate-limiting, and middleware.',
        category: 'Engineering & Ocean Tech',
        level: 'intermediate',
        duration_hours: 45,
        max_enrollment: 80,
        trainer_id: 2,
        is_published: true,
        created_at: new Date(Date.now() - 80 * 86400000).toISOString(),
      },
      {
        id: 103,
        title: 'Satellite Remote Sensing & GIS Analysis',
        description: 'Satellite altimetry, hyperspectral data decoding, and coastal vulnerability mapping.',
        category: 'Satellite Remote Sensing',
        level: 'advanced',
        duration_hours: 60,
        max_enrollment: 60,
        trainer_id: 7,
        is_published: true,
        created_at: new Date(Date.now() - 70 * 86400000).toISOString(),
      },
      {
        id: 104,
        title: 'Ocean Data Modeling & Machine Learning',
        description: 'Predictive neural networks for cyclone forecasting, sea surface temperatures, and wave height.',
        category: 'AI & Machine Learning',
        level: 'advanced',
        duration_hours: 50,
        max_enrollment: 50,
        trainer_id: 7,
        is_published: true,
        created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
      },
      {
        id: 105,
        title: 'Radar Meteorology & Precipitation Dynamics',
        description: 'Doppler radar calibration, signal processing, and severe weather warning systems.',
        category: 'Radar Meteorology',
        level: 'intermediate',
        duration_hours: 35,
        max_enrollment: 70,
        trainer_id: 2,
        is_published: true,
        created_at: new Date(Date.now() - 50 * 86400000).toISOString(),
      },
      {
        id: 106,
        title: 'Computational Fluid Dynamics for Ocean Currents',
        description: 'Hydrodynamic simulation pipelines, Navier-Stokes solvers, and bathymetric grids.',
        category: 'Computational Fluid Dynamics',
        level: 'advanced',
        duration_hours: 65,
        max_enrollment: 40,
        trainer_id: 7,
        is_published: true,
        created_at: new Date(Date.now() - 40 * 86400000).toISOString(),
      },
      {
        id: 107,
        title: 'Polar Ice Cap Cryosphere Modeling',
        description: 'Satellite radar interferometry analysis of Arctic and Antarctic glacial movement.',
        category: 'Satellite Remote Sensing',
        level: 'advanced',
        duration_hours: 55,
        max_enrollment: 45,
        trainer_id: 7,
        is_published: true,
        created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
      }
    ];
  }

  if (!memoryStore.courseProgress || memoryStore.courseProgress.length === 0) {
    memoryStore.courseProgress = [
      { id: 1, user_id: 1, course_id: 101, progress_percentage: 100, status: 'completed', completed: true, last_accessed: new Date(Date.now() - 7 * 86400000).toISOString() },
      { id: 2, user_id: 1, course_id: 102, progress_percentage: 100, status: 'completed', completed: true, last_accessed: new Date(Date.now() - 2 * 86400000).toISOString() },
      { id: 3, user_id: 5, course_id: 103, progress_percentage: 85, status: 'in_progress', completed: false, last_accessed: new Date(Date.now() - 1 * 86400000).toISOString() },
      { id: 4, user_id: 6, course_id: 101, progress_percentage: 40, status: 'in_progress', completed: false, last_accessed: new Date(Date.now() - 3 * 86400000).toISOString() },
    ];
  }

  if (!memoryStore.assessments || memoryStore.assessments.length === 0) {
    memoryStore.assessments = [
      { id: 1, course_id: 101, title: 'Modern React Architecture & Component Mastery Exam', passing_score: 70, time_limit_minutes: 45, max_attempts: 3, is_published: true, total_attempts: 32, avg_score: 86.5 },
      { id: 2, course_id: 102, title: 'Node.js, Express & Microservices Certification Exam', passing_score: 75, time_limit_minutes: 60, max_attempts: 3, is_published: true, total_attempts: 21, avg_score: 82.0 },
      { id: 3, course_id: 103, title: 'Satellite Remote Sensing & Altimetry Qualification Test', passing_score: 75, time_limit_minutes: 60, max_attempts: 3, is_published: true, total_attempts: 14, avg_score: 88.0 },
      { id: 4, course_id: 104, title: 'Ocean Data Modeling & Machine Learning Core Exam', passing_score: 80, time_limit_minutes: 50, max_attempts: 2, is_published: true, total_attempts: 18, avg_score: 79.5 },
    ];
  }

  if (!memoryStore.questions || memoryStore.questions.length === 0) {
    memoryStore.questions = [
      { id: 1, assessment_id: 1, question_text: 'What hook is utilized to optimize performance by memoizing computed values?', options: ['useMemo', 'useCallback', 'useRef', 'useEffect'], correct_option: 0, explanation: 'useMemo returns a memoized value recalculating only when dependencies change.', points: 1 },
      { id: 2, assessment_id: 1, question_text: 'Which React 18 feature allows non-urgent state updates to be deferred?', options: ['useTransition', 'useSyncExternalStore', 'useId', 'useImperativeHandle'], correct_option: 0, explanation: 'useTransition marks state updates as transitions allowing urgent inputs to interrupt.', points: 1 },
      { id: 3, assessment_id: 2, question_text: 'Which HTTP status code signifies that a resource was successfully created?', options: ['200 OK', '201 Created', '204 No Content', '304 Not Modified'], correct_option: 1, explanation: '201 Created indicates the request succeeded and led to resource creation.', points: 1 },
    ];
  }

  if (!memoryStore.learningResources || memoryStore.learningResources.length === 0) {
    memoryStore.learningResources = [
      { id: 1, title: 'Advanced React 18 Patterns & Component Lifecycle Architecture', description: 'Comprehensive design system guide for high performance web portals.', resource_type: 'presentation', course_id: 101, file_url: 'https://cloud-storage.moes.gov.in/resources/react_patterns_2026.pptx', duration_or_pages: '45 Slides', tags: ['React', 'Architecture'], created_by: 2 },
      { id: 2, title: 'Node.js Microservices Security & Cryptographic Handshake Guide', description: 'Technical whitepaper on HMAC and SHA-256 integrity checks in API pipelines.', resource_type: 'pdf', course_id: 102, file_url: 'https://cloud-storage.moes.gov.in/resources/nodejs_crypto_guide.pdf', duration_or_pages: '88 Pages', tags: ['Backend', 'Security'], created_by: 2 },
      { id: 3, title: 'Satellite Altimetry Data Decoding and Radar Calibration Video Lecture', description: 'Detailed classroom session with Dr. Sarah Connor explaining orbital passes.', resource_type: 'video', course_id: 103, file_url: 'https://cloud-storage.moes.gov.in/videos/altimetry_lecture.mp4', duration_or_pages: '54 Minutes', tags: ['Satellite', 'Radar'], created_by: 7 },
      { id: 4, title: 'Ocean Current Simulation Modeling Handbook', description: 'Standard operating manual for hydrodynamic grid parameters.', resource_type: 'guide', course_id: 106, file_url: 'https://cloud-storage.moes.gov.in/resources/hydro_handbook.pdf', duration_or_pages: '120 Pages', tags: ['Hydrodynamics', 'MoES'], created_by: 7 },
    ];
  }

  if (!memoryStore.announcements || memoryStore.announcements.length === 0) {
    memoryStore.announcements = [
      { id: 1, title: 'National Ocean Sciences Capacity Development Mission 2026 Launched', content: 'MoES launches the unified Capacity Connect portal for institutional competency development.', target_audience: 'all', priority: 'high', is_published: true, created_by: 3, created_at: new Date(Date.now() - 5 * 86400000).toISOString() },
      { id: 2, title: 'Mandatory Digital Certificate Verification Protocol in Effect', content: 'All course completion certificates are now cryptographically hashed using SHA-256 with admin approval sign-off.', target_audience: 'all', priority: 'critical', is_published: true, created_by: 3, created_at: new Date(Date.now() - 3 * 86400000).toISOString() },
      { id: 3, title: 'Trainer Assignment & Assessment Scheduling Window Open', content: 'Verified faculty may now configure question banks and review pending trainee submissions.', target_audience: 'trainer', priority: 'medium', is_published: true, created_by: 3, created_at: new Date(Date.now() - 1 * 86400000).toISOString() },
    ];
  }

  if (!memoryStore.adminActivityLogs || memoryStore.adminActivityLogs.length === 0) {
    memoryStore.adminActivityLogs = [
      { id: 1, action: 'SYSTEM_INITIALIZED', performed_by: 3, performed_by_name: 'Marcus Vance', target_entity: 'SYSTEM', target_id: '1', details: 'Initial deployment and seeding of Capacity Connect admin database.', ip_address: '127.0.0.1', created_at: new Date(Date.now() - 10 * 86400000).toISOString() },
      { id: 2, action: 'COURSE_CREATED', performed_by: 3, performed_by_name: 'Marcus Vance', target_entity: 'COURSE', target_id: '101', details: "Admin Marcus Vance created course 'Modern React Architecture & Performance'.", ip_address: '127.0.0.1', created_at: new Date(Date.now() - 8 * 86400000).toISOString() },
      { id: 3, action: 'CERTIFICATE_APPROVED', performed_by: 3, performed_by_name: 'Marcus Vance', target_entity: 'CERTIFICATE', target_id: '1', details: "Admin Marcus Vance approved certificate MOES-2026-7B9A2F1C for Alex Johnson.", ip_address: '127.0.0.1', created_at: new Date(Date.now() - 6 * 86400000).toISOString() },
      { id: 4, action: 'RESOURCE_UPLOADED', performed_by: 3, performed_by_name: 'Marcus Vance', target_entity: 'RESOURCE', target_id: '1', details: "Admin Marcus Vance added resource 'Advanced React 18 Patterns'.", ip_address: '127.0.0.1', created_at: new Date(Date.now() - 4 * 86400000).toISOString() },
      { id: 5, action: 'USER_SUSPENDED', performed_by: 3, performed_by_name: 'Marcus Vance', target_entity: 'USER', target_id: '8', details: "Admin Marcus Vance suspended user Neha Gupta for security reverification.", ip_address: '127.0.0.1', created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
    ];
  }

  if (!memoryStore.certificates || memoryStore.certificates.length === 0) {
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
  }

  saveMemoryStore();
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
