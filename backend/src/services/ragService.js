const Course = require('../models/Course');
const CourseModule = require('../models/CourseModule');
const Lesson = require('../models/Lesson');

class RAGService {
  constructor() {
    // In-memory vector/knowledge index of course material chunks
    this.knowledgeBase = [
      {
        courseId: 101,
        courseTitle: 'Advanced React State & Micro-Frontend Architecture',
        lessonTitle: 'System Architecture & Design Paradigms',
        chunk: 'Clean Architecture decouples core domain business logic from UI frameworks and external API clients. In React applications, state should be encapsulated within custom hooks or centralized Context providers to ensure predictable unidirectional data flow.',
        source: 'Lesson 1.1: System Architecture',
      },
      {
        courseId: 101,
        courseTitle: 'Advanced React State & Micro-Frontend Architecture',
        lessonTitle: 'Custom Hooks & State Encapsulation',
        chunk: 'Custom React hooks allow extracting reusable stateful logic from components. Interceptors in Axios inject Bearer JWT tokens into request headers and handle 401 unauthenticated response redirects globally.',
        source: 'Lesson 2.1: Custom Hooks',
      },
      {
        courseId: 102,
        courseTitle: 'Node.js Enterprise Microservices & API Gateway',
        lessonTitle: 'Express Architecture & Async Handlers',
        chunk: 'Express middleware functions execute sequentially in the request-response cycle. Always use async/await with centralized error handling middleware to capture rejected promises and prevent unhandled process crashes.',
        source: 'Lesson 1.2: Express Architecture',
      },
      {
        courseId: 104,
        courseTitle: 'Enterprise AI RAG Architecture & Vector Database',
        lessonTitle: 'Vector Embeddings & RAG Retrieval',
        chunk: 'Retrieval-Augmented Generation (RAG) converts course documentation into text vector embeddings stored in a vector index. When a user asks a course question, semantic similarity retrieval fetches relevant material chunks before invoking the LLM.',
        source: 'Lesson 1.1: RAG Retrieval',
      },
    ];
  }

  async retrieveRelevantMaterial(query, courseId = null) {
    const qLower = query.toLowerCase();
    let matches = this.knowledgeBase;

    if (courseId) {
      matches = matches.filter(k => k.courseId === parseInt(courseId));
    }

    // Filter by keyword relevance
    const relevantChunks = matches.filter(k => 
      k.chunk.toLowerCase().includes(qLower) || 
      k.courseTitle.toLowerCase().includes(qLower) ||
      k.lessonTitle.toLowerCase().includes(qLower) ||
      qLower.split(' ').some(word => word.length > 3 && k.chunk.toLowerCase().includes(word))
    );

    return relevantChunks.length > 0 ? relevantChunks : matches.slice(0, 2);
  }
}

module.exports = new RAGService();
