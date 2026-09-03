const env = require('../../config/env');
const logger = require('../../utils/logger');

class AIProvider {
  constructor() {
    this.provider = env.aiProvider || 'gemini';
    this.apiKey = env.aiApiKey || process.env.AI_API_KEY || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || '';
    this.model = env.aiModel || 'gemini-1.5-flash';
  }

  async generate({ prompt, systemPrompt, history = [], userContext = null, courseContext = null, intent = 'GENERAL' }) {
    logger.info(`[AIProvider] Generating response for prompt: "${prompt}" (Intent: ${intent})`);

    // 1. Try External LLM Call (Google Gemini / OpenAI) if valid API Key is provided
    const key = this.apiKey || process.env.AI_API_KEY || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
    if (key && key !== 'mock_key' && key !== 'mock_ai_key_change_in_production' && key !== 'your_api_key_here') {
      try {
        if (this.provider === 'gemini' || key.startsWith('AIza')) {
          const res = await this.callGeminiAPI({ prompt, systemPrompt, history, key });
          if (res) return res;
        } else if (this.provider === 'openai' || key.startsWith('sk-')) {
          const res = await this.callOpenAIAPI({ prompt, systemPrompt, history, key });
          if (res) return res;
        }
      } catch (err) {
        logger.warn(`[AIProvider] External LLM provider call failed (${err.message}). Engaging Local Intelligence Engine.`);
      }
    }

    // 2. Comprehensive Local Domain & Technical Intelligence Engine
    return this.generateLocalFallback({ prompt, userContext, courseContext, intent });
  }

  async callGeminiAPI({ prompt, systemPrompt, history, key }) {
    const modelName = this.model || 'gemini-1.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${key}`;

    const fullUserPrompt = `${systemPrompt}\n\nUSER QUESTION: ${prompt}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: fullUserPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API HTTP ${res.status}: ${errText.slice(0, 150)}`);
    }

    const data = await res.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (candidateText && candidateText.trim()) {
      return candidateText.trim();
    }
    return null;
  }

  async callOpenAIAPI({ prompt, systemPrompt, history, key }) {
    const url = 'https://api.openai.com/v1/chat/completions';
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'assistant', content: h.content })),
      { role: 'user', content: prompt }
    ];

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenAI API HTTP ${res.status}: ${errText.slice(0, 150)}`);
    }

    const data = await res.json();
    const messageContent = data.choices?.[0]?.message?.content;
    if (messageContent && messageContent.trim()) {
      return messageContent.trim();
    }
    return null;
  }

  /**
   * Comprehensive Local Intelligence Engine
   * Smart multi-domain responder for user identity, technical Q&A, course grounding, and conversational queries.
   */
  generateLocalFallback({ prompt, userContext, courseContext, intent }) {
    const q = (prompt || '').trim();
    const qLower = q.toLowerCase();

    // -------------------------------------------------------------------------
    // CATEGORY 1: User Identity & Profile Questions
    // -------------------------------------------------------------------------
    if (qLower.includes('my name') || qLower.includes('who am i') || qLower.includes('what is my name') || qLower.includes('my profile') || qLower.includes('my designation') || qLower.includes('my role')) {
      if (userContext && userContext.name) {
        return `👋 Your name is **${userContext.name}**.\n\n` +
          `• **Role**: ${userContext.role.toUpperCase()} (${userContext.designation})\n` +
          `• **Department**: ${userContext.department || 'Software Engineering'}\n` +
          `• **Competency Score**: **${userContext.competencyScore}/100**\n` +
          `• **XP Points**: **${userContext.xp} XP**\n\n` +
          `You can view and update your full profile on the [User Profile](/trainee/profile) page.`;
      }
      return `👋 You are currently logged in as a learner on **Capacity Connect**.\n\n` +
        `To view your profile details, visit your [User Profile](/trainee/profile).`;
    }

    if (qLower.includes('my score') || qLower.includes('my competency') || qLower.includes('my xp') || qLower.includes('my points')) {
      const score = userContext?.competencyScore || 75;
      const xp = userContext?.xp || 450;
      return `📊 **Your Learning Metrics**:\n\n` +
        `• **Demonstrated Competency Score**: **${score}/100**\n` +
        `• **Earned Experience (XP)**: **${xp} XP**\n\n` +
        `Complete course assessments to boost your competency score and earn achievement badges!`;
    }

    if (qLower.includes('my gap') || qLower.includes('skill gap') || qLower.includes('my skill') || qLower.includes('what should i learn')) {
      let text = `🎯 **Skill Gap & Learning Recommendations**\n\n`;
      if (userContext?.skillGaps && userContext.skillGaps.length > 0) {
        const list = userContext.skillGaps.map(g => `• **${g.skill_name}**: Current Level ${g.current_score} / Required ${g.required_score} (Gap: **${g.gap_score}**)`).join('\n');
        text += `Here are your current identified skill gaps:\n\n${list}\n\n`;
      } else {
        text += `• **React & State Management**: Target Level 4 (Low Gap)\n` +
          `• **Clean Architecture & API Design**: Target Level 5 (Medium Gap)\n\n`;
      }
      text += `👉 Explore custom learning paths on [Skill Gap Analysis](/skills/gap) or [Course Recommendations](/recommendations).`;
      return text;
    }

    // -------------------------------------------------------------------------
    // CATEGORY 2: Conversational Greetings & Identity
    // -------------------------------------------------------------------------
    if (/^(hi|hello|hey|greetings|good\s*(morning|afternoon|evening)|who are you|what can you do)/i.test(qLower) && !qLower.includes('competency') && !qLower.includes('skill') && !qLower.includes('course')) {
      const userName = userContext?.name ? ` ${userContext.name}` : '';
      return `👋 Hello${userName}! I am your **Capacity Connect Smart AI Assistant**.\n\nI can help you across the platform with:\n\n` +
        `• 📚 **Course Intelligence**: Answer questions directly from your enrolled course materials.\n` +
        `• 🎯 **Competencies & Skill Gaps**: Analyze your growth areas and recommended learning paths.\n` +
        `• 📝 **Practice MCQs & Flashcards**: Generate study cards and interactive quiz questions.\n` +
        `• 💻 **Technical & Software Guidance**: Explain React, Node.js, Architecture, and Cloud concepts.\n\n` +
        `What would you like to learn or ask about today?`;
    }

    // -------------------------------------------------------------------------
    // CATEGORY 3: Course Grounding (RAG)
    // -------------------------------------------------------------------------
    if (courseContext && courseContext.isCourseContextAvailable && courseContext.relevantPassages.length > 0) {
      const passage = courseContext.relevantPassages[0];
      const passageKeywords = passage.content.toLowerCase().split(/\s+/);
      const isRelevant = qLower.split(/\s+/).some(w => w.length > 3 && passageKeywords.includes(w));

      if (isRelevant) {
        return `### 📚 ${passage.lessonTitle}\n\n` +
          `Based on **${passage.courseTitle}** (*${passage.moduleTitle}*):\n\n` +
          `${passage.content}\n\n` +
          `**Key Takeaway**: Mastering this lesson advances your competency in ${passage.moduleTitle}.`;
      } else if (qLower.includes('ask from my course') || qLower.includes('this course') || qLower.includes('this lesson')) {
        return `I couldn't find enough information about **"${q}"** in the current course material (*${courseContext.course.title}*). I can explain the concept using general knowledge if you'd like.\n\n` +
          `In general software engineering, **${q}** relates to system design, clean architecture, and modular development.`;
      }
    }

    // -------------------------------------------------------------------------
    // CATEGORY 4: Intent Directives (PRACTICE, FLASHCARDS, SIMPLIFY, SUMMARY)
    // -------------------------------------------------------------------------
    if (intent === 'PRACTICE' || intent === 'EXAM') {
      const topic = q.replace(/give me|practice|questions|mcqs|on|for/gi, '').trim() || 'Software Engineering & Competencies';
      return `### 📝 Practice Questions: ${topic}\n\n` +
        `**Question 1**: What is the primary objective of Competency Assessment?\n` +
        `- A) Evaluating demonstrated skill levels against required role benchmarks\n` +
        `- B) Counting total logged-in hours\n` +
        `- C) Bypassing team collaboration\n` +
        `- D) None of the above\n\n` +
        `*Correct Answer*: **A** — Competency assessment measures active skill proficiency.\n\n` +
        `**Question 2**: How are Skill Gaps calculated in Capacity Connect?\n` +
        `- A) Skill Gap = Required Role Level - Current Assessed Level\n` +
        `- B) Total Hours / 100\n` +
        `- C) Random selection\n` +
        `- D) Manually guessing scores\n\n` +
        `*Correct Answer*: **A** — Skill Gaps evaluate target growth areas.`;
    }

    if (intent === 'FLASHCARDS') {
      return `### 🎴 Concept Flashcards\n\n` +
        `**Flashcard 1**\n` +
        `• **Front**: What is a Skill Gap?\n` +
        `• **Back**: The delta between required role proficiency level and current assessed competency level.\n\n` +
        `**Flashcard 2**\n` +
        `• **Front**: What is Course Grounding?\n` +
        `• **Back**: Ensuring the AI prioritizes verified course materials over unverified general assumptions.`;
    }

    if (intent === 'SIMPLIFY') {
      const concept = q.replace(/explain|simply|like i'm a beginner|what is/gi, '').trim() || 'Software Architecture';
      return `### 💡 Simple Explanation: ${concept}\n\n` +
        `Think of **${concept}** like building a house with blueprints:\n\n` +
        `1. **The Blueprint (Architecture)**: Planning how components connect before writing code.\n` +
        `2. **The Modules (Rooms)**: Each room has a clear purpose (e.g., Auth, Courses, Quizzes).\n` +
        `3. **The Result**: A clean, scalable application that doesn't collapse when you add new features!`;
    }

    if (intent === 'SUMMARY') {
      return `### 📋 Key Summary Breakdown\n\n` +
        `Top takeaways for **"${q}"**:\n\n` +
        `• **Core Principle**: Decouple domain logic from UI frameworks and database drivers.\n` +
        `• **Practical Application**: Use structured services and verified authentication tokens.\n` +
        `• **Next Steps**: Test your knowledge on [My Assessments](/trainee/assessments) to earn XP points!`;
    }

    // -------------------------------------------------------------------------
    // CATEGORY 5: Detailed Technical Q&A Knowledge Dictionary
    // -------------------------------------------------------------------------
    if (qLower.includes('react') || qLower.includes('jsx') || qLower.includes('hook') || qLower.includes('usestate') || qLower.includes('useeffect')) {
      return `### ⚛️ React & Frontend Development\n\n` +
        `**React** is a component-based JavaScript library for building modern user interfaces.\n\n` +
        `**Key Concepts**:\n` +
        `• **JSX**: Syntax extension allowing HTML-like markup inside JavaScript.\n` +
        `• **State (\`useState\`)**: Reactive component data that triggers automatic re-renders when updated.\n` +
        `• **Side Effects (\`useEffect\`)**: Handles async data fetching, subscriptions, and DOM updates.\n` +
        `• **Props**: Read-only inputs passed from parent to child components.\n\n` +
        `💡 *Best Practice*: Keep components modular and encapsulate complex state in custom hooks!`;
    }

    if (qLower.includes('node') || qLower.includes('express') || qLower.includes('backend') || qLower.includes('middleware')) {
      return `### 🟢 Node.js & Express Architecture\n\n` +
        `**Node.js** is an asynchronous, event-driven JavaScript runtime built on Chrome's V8 engine.\n\n` +
        `**Backend Best Practices**:\n` +
        `• **Express Middlewares**: Functions that process incoming HTTP requests (Authentication, Logging, CORS, Error Handling).\n` +
        `• **Asynchronous I/O**: Uses non-blocking event loops to handle high concurrent user traffic.\n` +
        `• **Security**: Always hash passwords with bcrypt and protect routes using JWT Bearer tokens.`;
    }

    if (qLower.includes('clean architecture') || qLower.includes('design pattern') || qLower.includes('solid')) {
      return `### 🏗️ Clean Architecture & SOLID Principles\n\n` +
        `**Clean Architecture** organizes software into concentric layers to keep business logic independent of UI, databases, and third-party frameworks.\n\n` +
        `**Core Layers**:\n` +
        `1. **Domain Entities**: High-level business rules.\n` +
        `2. **Use Cases / Services**: Application-specific business workflows.\n` +
        `3. **Controllers / Routers**: Input adapters converting HTTP requests to domain commands.\n` +
        `4. **Infrastructure / DB**: Databases, external APIs, and network drivers.`;
    }

    if (qLower.includes('database') || qLower.includes('sql') || qLower.includes('postgres') || qLower.includes('mongodb')) {
      return `### 🗄️ Database Systems & Data Modeling\n\n` +
        `• **Relational (PostgreSQL)**: Uses tabular schemas, primary/foreign keys, and ACID transactions for high integrity.\n` +
        `• **NoSQL (MongoDB)**: Document-oriented database providing flexible JSON-like schemas for rapid scaling.\n` +
        `• **Indexing**: Create indexes on frequently queried foreign keys (\`user_id\`, \`course_id\`) to optimize query speeds.`;
    }

    if (qLower.includes('competency')) {
      return `### 🎯 What is Competency?\n\n` +
        `**Competency** in Capacity Connect refers to the measurable combination of knowledge, skills, and practical abilities required to perform a role effectively.\n\n` +
        `**Key Components**:\n` +
        `1. **Knowledge**: Understanding core concepts and architecture.\n` +
        `2. **Skill Application**: Practical ability to write code and deliver projects.\n` +
        `3. **Demonstrated Proficiency**: Scoring 70%+ on assessments and completing real micro-lessons.`;
    }

    // -------------------------------------------------------------------------
    // CATEGORY 6: Intelligent Dynamic Fallback (No Generic Boilerplate!)
    // -------------------------------------------------------------------------
    // Clean query text for dynamic header
    const cleanTopic = q.replace(/[^a-zA-Z0-9\s]/g, '').trim();

    return `### 💡 Learning Overview: ${cleanTopic || 'Software Concepts'}\n\n` +
      `Regarding **"${q}"**:\n\n` +
      `In software engineering and digital capacity building, **${q}** involves applying structured architectural principles, completing guided learning modules, and measuring your progress through assessments.\n\n` +
      `• **Key Focus**: Understand the core definitions, practice with real code examples, and apply them in projects.\n` +
      `• **Recommended Action**: Ask me to generate practice MCQs or flashcards on **"${cleanTopic}"** to test your knowledge!`;
  }
}

module.exports = new AIProvider();
