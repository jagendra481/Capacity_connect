const db = require('../config/database');
const Course = require('./Course');

const courseOutlines = {
  101: [
    ['React Foundations & Component Design', 'Establish a maintainable component model and understand React rendering.', ['JSX, components & props', 'State, events & controlled inputs']],
    ['Hooks & Application State', 'Use hooks and composition patterns to make state explicit and reusable.', ['Effects, data fetching & cleanup', 'Custom hooks & context boundaries']],
    ['Routing, Forms & Async UX', 'Build robust client-side flows that handle navigation and server state.', ['React Router & route parameters', 'Forms, validation & loading states']],
    ['Performance & Production Readiness', 'Measure and improve an application before releasing it.', ['Memoization & render profiling', 'Code splitting, testing & deployment']],
  ],
  102: [
    ['Node Runtime & HTTP Fundamentals', 'Learn how Node handles modules, files, requests, and responses.', ['Node modules, npm & the event loop', 'HTTP servers & request lifecycles']],
    ['Express APIs & Middleware', 'Create structured REST endpoints with reusable middleware.', ['Express routes & controllers', 'Middleware, error handling & validation']],
    ['Persistence & Authentication', 'Connect a backend to data while protecting users and endpoints.', ['Data models & database integration', 'Authentication, authorization & secrets']],
    ['Maintainable Service Design', 'Organize and ship a backend service with confidence.', ['MVC architecture & API testing', 'Deployment, logs & operational checks']],
  ],
  103: [
    ['PostgreSQL Setup & Relational Modelling', 'Start with tools, data types, keys, and normalized schema design.', ['PostgreSQL, pgAdmin & database setup', 'Tables, keys, constraints & relationships']],
    ['SQL for Everyday Analysis', 'Query and reshape data accurately using core SQL patterns.', ['SELECT, filters, sorting & aggregation', 'Joins, subqueries & common table expressions']],
    ['Data Integrity & Transactions', 'Protect data when concurrent application work changes it.', ['INSERT, UPDATE, DELETE & migrations', 'ACID, transactions & isolation']],
    ['Indexes & Query Performance', 'Use the query planner to diagnose and improve slow queries.', ['Indexes and EXPLAIN plans', 'Performance tuning & connection pooling']],
  ],
  104: [
    ['RAG Architecture & Evaluation', 'Define a grounded-generation system and the metrics that matter.', ['RAG overview, risks & evaluation', 'Document loading and chunking strategies']],
    ['Indexing & Embeddings', 'Turn source content into searchable representations.', ['Embeddings and vector stores', 'Metadata, indexing and retrieval setup']],
    ['Retrieval & Grounded Generation', 'Retrieve useful context and compose dependable model prompts.', ['Retriever design & relevance', 'Prompt construction and citation-aware answers']],
    ['Advanced Retrieval Patterns', 'Handle harder queries and production trade-offs.', ['Multi-query, fusion & decomposition', 'Reranking, monitoring & production safeguards']],
  ],
  105: [
    ['Python Fundamentals', 'Build confidence with syntax, values, collections, and control flow.', ['Installing Python & first programs', 'Strings, lists, dictionaries & sets']],
    ['Functions, Modules & Environments', 'Write reusable code and manage project dependencies.', ['Functions, scope & error handling', 'Imports, packages and virtual environments']],
    ['Files, Data & Automation', 'Apply Python to practical input, output, and data tasks.', ['Files, JSON & CSV handling', 'Requests, APIs & automation scripts']],
    ['Quality & Next Steps', 'Make code easier to test, debug, and extend.', ['Classes, testing & debugging', 'Data analysis and web-development pathways']],
  ],
  106: [
    ['Security Mindset & Networking', 'Build the technical foundation needed to reason about threats.', ['Threat landscape and security principles', 'Networking, ports, protocols & packet flow']],
    ['Linux & Security Tooling', 'Use a safe lab environment and essential command-line tools.', ['Linux navigation and permissions', 'Nmap, Wireshark and reconnaissance basics']],
    ['Vulnerability Assessment', 'Identify common weaknesses and document risk responsibly.', ['Web and network vulnerability concepts', 'Scanning, validation and remediation notes']],
    ['Defensive Operations', 'Turn findings into safer systems and habits.', ['Hardening, patching and access control', 'Incident response, monitoring & reporting']],
  ],
  107: [
    ['Cloud Concepts & Azure Core', 'Understand cloud service models, regions, accounts, and core services.', ['Cloud models and Azure architecture', 'Identity, subscriptions and resource groups']],
    ['Compute, Storage & Networking', 'Select and connect foundational cloud building blocks.', ['Virtual machines, containers & app services', 'Storage, virtual networks and load balancing']],
    ['Security, Governance & Reliability', 'Design for safe access, policy, observability, and recovery.', ['Identity, secrets and security posture', 'Monitoring, backup and disaster recovery']],
    ['DevOps Delivery Practices', 'Automate repeatable application delivery and infrastructure change.', ['CI/CD concepts and release strategies', 'Infrastructure as code and operational review']],
  ],
};

const buildDemoModules = async (courseId) => {
  const course = await Course.findById(courseId);
  const numericCourseId = parseInt(courseId);
  const playlistUrl = course?.playlist_url;
  const videoUrl = course?.playlist_id
    ? `https://www.youtube-nocookie.com/embed/videoseries?list=${course.playlist_id}`
    : 'https://www.youtube.com/embed/videoseries?list=PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU';
  const outline = courseOutlines[numericCourseId] || [
    ['Course Foundations', 'Establish the concepts and environment for this subject.', ['Core concepts and setup', 'Essential workflow']],
    ['Applied Practice', 'Apply the material through guided exercises.', ['Implementation patterns', 'Review and next steps']],
  ];

  return outline.map(([title, description, lessons], moduleIndex) => ({
    id: numericCourseId * 10 + moduleIndex + 1,
    course_id: numericCourseId,
    title: `Module ${moduleIndex + 1}: ${title}`,
    description,
    order_index: moduleIndex + 1,
    lessons: lessons.map((lessonTitle, lessonIndex) => ({
      id: numericCourseId * 100 + moduleIndex * 10 + lessonIndex + 1,
      title: `${moduleIndex + 1}.${lessonIndex + 1} ${lessonTitle}`,
      duration: 'Playlist lesson', video_url: videoUrl, playlist_url: playlistUrl,
      is_preview: moduleIndex === 0 && lessonIndex === 0,
    })),
  }));
};

class CourseModule {
  static async getByCourseId(courseId) {
    if (db.getIsPgConnected()) {
      const res = await db.query(
        `SELECT cm.*, l.id AS lesson_id, l.title AS lesson_title, l.duration AS lesson_duration,
                l.video_url AS lesson_video_url, l.is_preview AS lesson_is_preview, l.order_index AS lesson_order_index
         FROM course_modules cm LEFT JOIN lessons l ON l.module_id = cm.id
         WHERE cm.course_id = $1 ORDER BY cm.order_index ASC, l.order_index ASC`, [courseId]
      );
      const modules = new Map();
      for (const row of res.rows) {
        if (!modules.has(row.id)) modules.set(row.id, { id: row.id, course_id: row.course_id, title: row.title, description: row.description, order_index: row.order_index, lessons: [] });
        if (row.lesson_id) modules.get(row.id).lessons.push({ id: row.lesson_id, title: row.lesson_title, duration: row.lesson_duration, video_url: row.lesson_video_url, is_preview: row.lesson_is_preview });
      }
      return [...modules.values()];
    }
    return buildDemoModules(courseId);
  }
}

module.exports = CourseModule;
