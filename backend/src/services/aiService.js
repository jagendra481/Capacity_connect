const ragService = require('./ragService');
const env = require('../config/env');

class AIService {
  async chat({ prompt, courseId = null, mode = 'general' }) {
    // 1. Retrieve course material chunks via RAG
    const relevantChunks = await ragService.retrieveRelevantMaterial(prompt, courseId);
    
    const contextText = relevantChunks.map(c => c.chunk).join('\n---\n');
    const sources = relevantChunks.map(c => ({
      courseTitle: c.courseTitle,
      source: c.source,
    }));

    let answer = '';

    if (mode === 'explain') {
      answer = `### Simplified Explanation\n\n${prompt} can be understood simply as:\n\n1. **Core Concept**: It organizes your system into decoupled, modular parts.\n2. **Practical Analogy**: Think of it like a building blueprint — each room has a dedicated purpose, preventing clutter.\n\n*Reference Material Context*:\n${contextText}`;
    } else if (mode === 'summarize') {
      answer = `### Key Summary\n\nHere are the top takeaways regarding "${prompt}":\n\n- Encapsulate reusable state and API logic in custom services/hooks.\n- Maintain clean architecture and strict JWT authorization headers.\n- Use async/await and central error middleware for process stability.\n\n*Course Context*:\n${contextText}`;
    } else {
      answer = `Based on your course materials:\n\n${relevantChunks[0]?.chunk || 'In enterprise development, clean architecture and structured module design ensure scalability and reliability.'}\n\nTo apply this in your project, ensure your frontend services consume backend APIs securely with Bearer tokens.`;
    }

    return {
      answer,
      sources,
      ragUsed: relevantChunks.length > 0,
      mode,
    };
  }

  async generatePracticeQuestions(topic = 'React & Node.js') {
    return [
      {
        question: `What is the primary benefit of using custom hooks for ${topic}?`,
        options: [
          'Encapsulate and reuse stateful logic across multiple components',
          'Directly mutate global DOM nodes',
          'Bypass backend authorization',
          'Disable browser caching'
        ],
        correctIndex: 0,
        explanation: 'Custom hooks allow extracting component logic into reusable functions.',
      },
      {
        question: `Why should JWT validation happen on the backend server?`,
        options: [
          'Because the backend is the final authority for authorization',
          'To reduce bundle size on the frontend',
          'To bypass database connection limits',
          'It is not necessary'
        ],
        correctIndex: 0,
        explanation: 'Frontend state can be tampered with by clients; backend verification ensures security.',
      },
    ];
  }

  async generateFlashcards(topic = 'Software Engineering') {
    return [
      {
        id: 1,
        front: `What is Clean Architecture in ${topic}?`,
        back: 'A software design philosophy that separates core business logic from UI frameworks and database drivers.',
      },
      {
        id: 2,
        front: 'What is Retrieval-Augmented Generation (RAG)?',
        back: 'A pattern that combines text retrieval from a knowledge base with LLM generation to answer questions accurately with source citations.',
      },
      {
        id: 3,
        front: 'How is Skill Gap calculated in Capacity Connect?',
        back: 'Using the formula: gap = required_level - current_level, classified into No Gap, Low, Medium, or Critical.',
      },
    ];
  }
}

module.exports = new AIService();
