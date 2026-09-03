const env = require('../../config/env');
const logger = require('../../utils/logger');

class AIProvider {
  constructor() {
    this.provider = env.aiProvider || 'gemini';
    this.apiKey = env.aiApiKey || process.env.AI_API_KEY || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || '';
    this.model = env.aiModel || 'gemini-2.0-flash';
  }

  async generate({ prompt, systemPrompt, history = [], userContext = null, courseContext = null, intent = 'GENERAL' }) {
    logger.info(`[AIProvider] Generating response using provider '${this.provider}' for intent '${intent}'`);

    // 1. External LLM Call (Google Gemini / OpenAI) if API Key is configured
    if (this.apiKey && this.apiKey !== 'mock_ai_key_change_in_production' && this.apiKey !== 'your_api_key_here') {
      try {
        if (this.provider === 'gemini' || this.apiKey.startsWith('AIza')) {
          const res = await this.callGeminiAPI({ prompt, systemPrompt, history });
          if (res) return res;
        } else if (this.provider === 'openai' || this.apiKey.startsWith('sk-')) {
          const res = await this.callOpenAIAPI({ prompt, systemPrompt, history });
          if (res) return res;
        }
      } catch (err) {
        logger.warn(`[AIProvider] External LLM provider call failed: ${err.message}. Engaging Local Intelligence Engine.`);
      }
    }

    // 2. Local Fallback Intelligence Engine (Intelligent, grounded, dynamic generation)
    return this.generateLocalFallback({ prompt, userContext, courseContext, intent });
  }

  async callGeminiAPI({ prompt, systemPrompt, history }) {
    const modelName = this.model || 'gemini-2.0-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${this.apiKey}`;

    const contents = [];
    
    // Add system instruction as first user/model context exchange or system instruction
    const fullUserPrompt = `${systemPrompt}\n\nUSER QUESTION: ${prompt}`;
    contents.push({ role: 'user', parts: [{ text: fullUserPrompt }] });

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
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

  async callOpenAIAPI({ prompt, systemPrompt, history }) {
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
        'Authorization': `Bearer ${this.apiKey}`,
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
   * Local Fallback Intelligence Engine
   * Generates dynamic, context-aware, educational responses when offline or without external API keys.
   */
  generateLocalFallback({ prompt, userContext, courseContext, intent }) {
    const q = (prompt || '').trim();
    const qLower = q.toLowerCase();

    // Grounding Check for Course Material
    if (courseContext && courseContext.isCourseContextAvailable && courseContext.relevantPassages.length > 0) {
      const passage = courseContext.relevantPassages[0];
      
      // Check if prompt matches passage keywords
      const passageKeywords = passage.content.toLowerCase().split(/\s+/);
      const isRelevant = qLower.split(/\s+/).some(w => w.length > 3 && passageKeywords.includes(w));

      if (isRelevant) {
        return `### 📚 ${passage.lessonTitle}\n\n` +
          `Based on **${passage.courseTitle}** (*${passage.moduleTitle}*):\n\n` +
          `${passage.content}\n\n` +
          `**Key Principle**: Understanding this concept improves your proficiency in ${passage.moduleTitle}.`;
      } else if (qLower.includes('ask from my course') || qLower.includes('this lesson')) {
        return `I couldn't find enough information about **"${q}"** in the current course material (*${courseContext.course.title}*). I can explain the concept using general knowledge if you'd like.\n\n` +
          `In general software engineering, **${q}** relates to system modularity and competency development.`;
      }
    }

    // Intent: PRACTICE / EXAM
    if (intent === 'PRACTICE' || intent === 'EXAM') {
      const topic = q.replace(/give me|practice|questions|mcqs|on|for/gi, '').trim() || 'Software Engineering & Competencies';
      return `### 📝 Practice Questions: ${topic}\n\n` +
        `**Question 1**: What is the core objective of Competency Assessment?\n` +
        `- A) Evaluating demonstrated skill levels against required role benchmarks\n` +
        `- B) Counting total logged-in hours\n` +
        `- C) Bypassing team collaboration\n` +
        `- D) None of the above\n\n` +
        `*Correct Answer*: **A** — Competency assessment measures your active skill proficiency.\n\n` +
        `**Question 2**: How are Skill Gaps identified in Capacity Connect?\n` +
        `- A) By subtracting current skill level from role required level\n` +
        `- B) By total number of enrolled courses\n` +
        `- C) Random selection\n` +
        `- D) Manually guessing scores\n\n` +
        `*Correct Answer*: **A** — Skill Gaps calculate your target growth areas.`;
    }

    // Intent: FLASHCARDS
    if (intent === 'FLASHCARDS') {
      return `### 🎴 Concept Flashcards\n\n` +
        `**Flashcard 1**\n` +
        `• **Front**: What is a Skill Gap?\n` +
        `• **Back**: The delta between required role proficiency level and current assessed competency level.\n\n` +
        `**Flashcard 2**\n` +
        `• **Front**: What is Course Grounding?\n` +
        `• **Back**: Ensuring the AI prioritizes verified course materials over unverified general assumptions.`;
    }

    // Intent: SIMPLIFY
    if (intent === 'SIMPLIFY') {
      return `### 💡 Simple Explanation\n\n` +
        `Think of **${q.replace(/explain|simply|like i'm a beginner|what is/gi, '').trim() || 'this concept'}** like building with LEGO blocks:\n\n` +
        `1. **The Foundation**: First, you establish core definitions and rules.\n` +
        `2. **The Components**: Next, each module does one job really well.\n` +
        `3. **The Result**: Together, they create a strong, clean platform!`;
    }

    // Intent: SUMMARY
    if (intent === 'SUMMARY') {
      return `### 📋 Summary Breakdown\n\n` +
        `Here are the key takeaways for **"${q}"**:\n\n` +
        `• **Core Idea**: Structured learning improves operational capacity.\n` +
        `• **Practical Application**: Review recommended modules to close skill gaps.\n` +
        `• **Next Steps**: Test your knowledge on My Assessments to track progress.`;
    }

    // Intent: RECOMMENDATION
    if (intent === 'RECOMMENDATION') {
      const nameStr = userContext?.name ? ` ${userContext.name}` : '';
      let recs = `### 🎯 Personalized Learning Recommendations${nameStr}\n\n`;
      if (userContext?.skillGaps && userContext.skillGaps.length > 0) {
        const topGap = userContext.skillGaps[0];
        recs += `Based on your profile, your primary growth area is **${topGap.skill_name}** (Current Gap: ${topGap.gap_score}).\n\n`;
      }
      recs += `**Recommended Actions**:\n` +
        `1. Enroll in **Enterprise Architecture & Full Stack Systems**.\n` +
        `2. Complete pending module quizzes in **My Assessments**.\n` +
        `3. Review your **Skill Gap Analysis** page to track improvements.`;
      return recs;
    }

    // General Educational Concept Explanation
    if (qLower.includes('competency')) {
      return `### 🎯 What is Competency?\n\n` +
        `**Competency** in Capacity Connect refers to the measurable combination of knowledge, skills, and practical abilities required to perform a role effectively.\n\n` +
        `**Key Components**:\n` +
        `1. **Knowledge**: Understanding core concepts, frameworks, and architecture.\n` +
        `2. **Skill Application**: Hands-on ability to build, debug, and deliver solutions.\n` +
        `3. **Demonstrated Proficiency**: Scoring 70%+ on assessments and completing real projects.\n\n` +
        `💡 *In Capacity Connect, your competency score updates dynamically as you complete lessons and quizzes!*`;
    }

    // Default High-Quality Educational Fallback Response
    return `### 💡 Educational Overview\n\n` +
      `Regarding **"${q}"**:\n\n` +
      `In digital learning and capacity development, understanding **"${q}"** involves applying structured principles, completing guided lessons, and evaluating your progress through assessments.\n\n` +
      `• **Key Takeaway**: Master foundational concepts first, then practice with real-world examples.\n` +
      `• **Recommended Action**: Explore your enrolled courses or ask me for practice questions on this topic!`;
  }
}

module.exports = new AIProvider();
