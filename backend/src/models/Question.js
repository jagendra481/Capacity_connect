const db = require('../config/database');

const demoQuestions = {
  1: [
    {
      id: 101,
      assessment_id: 1,
      question_text: 'Which React hook should be used to perform side effects such as fetching data from an Express API?',
      type: 'MCQ',
      options: ['useState', 'useEffect', 'useMemo', 'useRef'],
      correct_answer: 'useEffect',
      explanation: 'useEffect handles side effects in functional components, executing after DOM render.',
      points: 25,
    },
    {
      id: 102,
      assessment_id: 1,
      question_text: 'JWT authentication tokens should be verified on the backend for every protected API request.',
      type: 'True/False',
      options: ['True', 'False'],
      correct_answer: 'True',
      explanation: 'The backend must remain the final authority for authorization and verify incoming Bearer tokens.',
      points: 25,
    },
    {
      id: 103,
      assessment_id: 1,
      question_text: 'Scenario: Your Express application crashes under high user traffic due to synchronous file operations. What is the best immediate architectural fix?',
      type: 'Scenario',
      options: [
        'Replace synchronous FS calls with asynchronous fs.promises or stream APIs',
        'Add a try/catch block around synchronous calls',
        'Increase server RAM without modifying code',
        'Disable CORS protection'
      ],
      correct_answer: 'Replace synchronous FS calls with asynchronous fs.promises or stream APIs',
      explanation: 'Blocking the main Event Loop with sync I/O stops Express from processing concurrent requests.',
      points: 25,
    },
    {
      id: 104,
      assessment_id: 1,
      question_text: 'What HTTP status code represents an unauthorized client attempt missing valid JWT credentials?',
      type: 'ShortAnswer',
      options: ['200', '401', '403', '500'],
      correct_answer: '401',
      explanation: '401 Unauthorized specifies missing or invalid authentication credentials.',
      points: 25,
    },
  ],
  2: [
    {
      id: 201,
      assessment_id: 2,
      question_text: 'Which type of index in PostgreSQL is optimal for full-text search and JSONB containment queries?',
      type: 'MCQ',
      options: ['B-Tree Index', 'GIN Index', 'Hash Index', 'BRIN Index'],
      correct_answer: 'GIN Index',
      explanation: 'Generalized Inverted Index (GIN) handles multi-component items like JSONB keys and text search vectors.',
      points: 34,
    },
    {
      id: 202,
      assessment_id: 2,
      question_text: 'ACID in database transactions stands for Atomicity, Consistency, Isolation, and Durability.',
      type: 'True/False',
      options: ['True', 'False'],
      correct_answer: 'True',
      explanation: 'ACID guarantees reliable execution of relational database transactions.',
      points: 33,
    },
    {
      id: 203,
      assessment_id: 2,
      question_text: 'Scenario: A SQL query joining 3 large tables is performing full table scans. What step should you take first to diagnose performance?',
      type: 'Scenario',
      options: [
        'Run EXPLAIN ANALYZE on the query to inspect execution node costs and missing indexes',
        'Restart the PostgreSQL service',
        'Delete old records manually',
        'Convert all foreign keys to plain text'
      ],
      correct_answer: 'Run EXPLAIN ANALYZE on the query to inspect execution node costs and missing indexes',
      explanation: 'EXPLAIN ANALYZE shows the actual execution time and planner strategy.',
      points: 33,
    },
  ]
};

class Question {
  static async getByAssessmentId(assessmentId) {
    if (db.getIsPgConnected()) {
      const res = await db.query('SELECT * FROM questions WHERE assessment_id = $1 ORDER BY id ASC', [assessmentId]);
      return res.rows;
    }
    return demoQuestions[parseInt(assessmentId)] || demoQuestions[1];
  }

  static async create(questionData) {
    const { assessment_id, question_text, type, options, correct_answer, explanation, points } = questionData;
    if (db.getIsPgConnected()) {
      const res = await db.query(
        `INSERT INTO questions (assessment_id, question_text, type, options, correct_answer, explanation, points)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [assessment_id, question_text, type, JSON.stringify(options), correct_answer, explanation, points]
      );
      return res.rows[0];
    }

    const list = demoQuestions[parseInt(assessment_id)] || [];
    const newQ = {
      id: list.length + 101,
      assessment_id: parseInt(assessment_id),
      question_text,
      type: type || 'MCQ',
      options: options || [],
      correct_answer,
      explanation: explanation || '',
      points: points || 10,
    };
    list.push(newQ);
    demoQuestions[parseInt(assessment_id)] = list;
    return newQ;
  }
}

module.exports = Question;
