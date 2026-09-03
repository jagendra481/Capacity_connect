const contextService = require('./ai/contextService');
const promptService = require('./ai/promptService');
const aiProvider = require('./ai/aiProvider');
const responseService = require('./ai/responseService');
const db = require('../config/database');
const logger = require('../utils/logger');

class AIService {
  /**
   * Persistent Conversation Management
   */
  async getOrCreateConversation({ userId, conversationId = null, courseId = null, title = 'Learning Assistant Session' }) {
    if (!userId) return null;

    try {
      const numericUserId = parseInt(userId);
      const numericConversationId = conversationId ? parseInt(conversationId) : null;

      if (db.getIsPgConnected()) {
        if (numericConversationId) {
          const res = await db.query(
            'SELECT * FROM ai_conversations WHERE id = $1 AND user_id = $2',
            [numericConversationId, numericUserId]
          );
          if (res.rows[0]) return res.rows[0];
        }

        const createRes = await db.query(
          `INSERT INTO ai_conversations (user_id, course_id, title)
           VALUES ($1, $2, $3) RETURNING *`,
          [numericUserId, courseId ? parseInt(courseId) : null, title]
        );
        return createRes.rows[0];
      }

      // Memory Store fallback
      if (!db.memoryStore.aiConversations) db.memoryStore.aiConversations = [];
      if (!db.memoryStore.aiMessages) db.memoryStore.aiMessages = [];

      if (numericConversationId) {
        const existing = db.memoryStore.aiConversations.find(
          c => c.id === numericConversationId && c.user_id === numericUserId
        );
        if (existing) return existing;
      }

      const newConv = {
        id: db.memoryStore.aiConversations.length + 1,
        user_id: numericUserId,
        course_id: courseId ? parseInt(courseId) : null,
        title,
        created_at: new Date().toISOString(),
      };
      db.memoryStore.aiConversations.push(newConv);
      return newConv;
    } catch (err) {
      logger.warn('[AIService] Conversation storage warning:', err.message);
      return null;
    }
  }

  async saveMessage({ conversationId, sender, content, sources = [], intent = 'GENERAL' }) {
    if (!conversationId) return null;

    try {
      if (db.getIsPgConnected()) {
        const res = await db.query(
          `INSERT INTO ai_messages (conversation_id, sender, content, sources, intent)
           VALUES ($1, $2, $3, $4, $5) RETURNING *`,
          [parseInt(conversationId), sender, content, JSON.stringify(sources), intent]
        );
        return res.rows[0];
      }

      const newMsg = {
        id: (db.memoryStore.aiMessages || []).length + 1,
        conversation_id: parseInt(conversationId),
        sender,
        content,
        sources,
        intent,
        created_at: new Date().toISOString(),
      };
      if (!db.memoryStore.aiMessages) db.memoryStore.aiMessages = [];
      db.memoryStore.aiMessages.push(newMsg);
      return newMsg;
    } catch (err) {
      logger.warn('[AIService] Message save warning:', err.message);
      return null;
    }
  }

  async getConversationHistory(conversationId, userId) {
    if (!conversationId || !userId) return [];

    try {
      if (db.getIsPgConnected()) {
        // Enforce user ownership security check
        const convRes = await db.query(
          'SELECT id FROM ai_conversations WHERE id = $1 AND user_id = $2',
          [parseInt(conversationId), parseInt(userId)]
        );
        if (convRes.rows.length === 0) return [];

        const msgRes = await db.query(
          'SELECT sender, content, created_at FROM ai_messages WHERE conversation_id = $1 ORDER BY id ASC LIMIT 20',
          [parseInt(conversationId)]
        );
        return msgRes.rows.map(m => ({ role: m.sender, text: m.content }));
      }

      const conv = (db.memoryStore.aiConversations || []).find(
        c => c.id === parseInt(conversationId) && c.user_id === parseInt(userId)
      );
      if (!conv) return [];

      return (db.memoryStore.aiMessages || [])
        .filter(m => m.conversation_id === parseInt(conversationId))
        .slice(-20)
        .map(m => ({ role: m.sender, text: m.content }));
    } catch (err) {
      return [];
    }
  }

  /**
   * Main Orchestrator Chat Function
   */
  async chat({ prompt, message, courseId = null, moduleId = null, lessonId = null, mode = 'general', conversationId = null, history = [], user = null }) {
    const query = (prompt || message || '').trim();
    if (!query) {
      throw new Error('Query string is required');
    }

    const userId = user?.id || null;

    logger.info(`[AIService] Processing AI chat query (User: ${userId || 'Guest'}, Course: ${courseId || 'None'})`);

    // 1. Context Retrieval (User Profile & Grounded Course Passages)
    const userContext = userId ? await contextService.getUserContext(userId) : null;
    const courseContext = await contextService.getCourseContext({ courseId, moduleId, lessonId, query });

    // 2. Intent Detection
    const intent = promptService.detectIntent(query, mode);

    // 3. Conversation History Retrieval & Persistence
    let convRecord = null;
    if (userId) {
      convRecord = await this.getOrCreateConversation({
        userId,
        conversationId,
        courseId,
        title: query.slice(0, 30) + '...',
      });
    }

    let conversationHistory = history;
    if (convRecord && conversationHistory.length === 0) {
      conversationHistory = await this.getConversationHistory(convRecord.id, userId);
    }

    // 4. Prompt Builder
    const systemPrompt = promptService.buildSystemPrompt({
      userContext,
      courseContext,
      intent,
      history: conversationHistory,
    });

    const formattedHistory = promptService.formatHistory(conversationHistory);

    // 5. LLM Provider Execution
    const responseText = await aiProvider.generate({
      prompt: query,
      systemPrompt,
      history: formattedHistory,
      userContext,
      courseContext,
      intent,
    });

    // 6. Response Validation & Formatting
    const formattedResponse = responseService.formatChatResponse({
      responseText,
      conversationId: convRecord ? convRecord.id : null,
      sources: courseContext.relevantPassages.map(p => ({
        courseTitle: p.courseTitle,
        source: `${p.moduleTitle} — ${p.lessonTitle}`,
      })),
      intent,
      ragUsed: courseContext.isCourseContextAvailable,
    });

    // 7. Save to Conversation Database
    if (convRecord) {
      await this.saveMessage({ conversationId: convRecord.id, sender: 'user', content: query, intent });
      await this.saveMessage({
        conversationId: convRecord.id,
        sender: 'assistant',
        content: formattedResponse.answer,
        sources: formattedResponse.sources,
        intent,
      });
    }

    return formattedResponse;
  }

  async generatePracticeQuestions(topic = 'Software Engineering Competencies') {
    const rawQuestions = [
      {
        question: `What is the primary benefit of Competency Assessment in ${topic}?`,
        options: [
          'Aligns demonstrated technical skills with role requirements and highlights skill gaps',
          'Eliminates the need for training materials',
          'Calculates total logged-in hours only',
          'Bypasses course progress tracking',
        ],
        correctIndex: 0,
        explanation: 'Competency assessments measure demonstrated proficiency to identify targeted learning needs.',
      },
      {
        question: `Why is Course Grounding important in an AI Learning Assistant?`,
        options: [
          'Prevents AI hallucinations by prioritizing verified course content over general assumptions',
          'Increases API request latency',
          'Restricts users from asking software questions',
          'Hides syllabus resources',
        ],
        correctIndex: 0,
        explanation: 'Course grounding ensures AI answers are directly cited and backed by actual lesson materials.',
      },
      {
        question: `How does the Skill Gap formula calculate skill deficits?`,
        options: [
          'Skill Gap = Required Role Level - Current Assessed Level',
          'Skill Gap = Total XP / 10',
          'Skill Gap = Completed Quizzes × 2',
          'Skill Gap is selected at random',
        ],
        correctIndex: 0,
        explanation: 'Skill Gaps calculate the numeric gap between required role standards and current proficiency.',
      },
    ];

    return responseService.formatPracticeQuestions(rawQuestions, topic);
  }

  async generateFlashcards(topic = 'Capacity Connect Concepts') {
    const rawFlashcards = [
      {
        id: 1,
        front: `What is Competency in Capacity Connect?`,
        back: 'The measurable combination of knowledge, practical skill, and demonstrated proficiency required for a specific enterprise role.',
      },
      {
        id: 2,
        front: 'What is Retrieval-Augmented Generation (RAG)?',
        back: 'An AI pattern that retrieves relevant verified course passages before generating answers with source citations.',
      },
      {
        id: 3,
        front: 'What is the passing threshold for Course Assessments?',
        back: 'Scoring 70% or higher unlocks the official cryptographic course completion certificate.',
      },
      {
        id: 4,
        front: 'How is Training ROI calculated?',
        back: 'ROI (%) = ((Estimated Cost Savings + Productivity Gain - Training Cost) / Training Cost) × 100.',
      },
    ];

    return responseService.formatFlashcards(rawFlashcards, topic);
  }
}

module.exports = new AIService();
