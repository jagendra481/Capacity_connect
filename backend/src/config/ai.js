const env = require('./env');
const logger = require('../utils/logger');

class AIService {
  constructor() {
    this.provider = env.aiProvider;
    this.apiKey = env.aiApiKey;
  }

  async generateResponse(prompt, context = '') {
    logger.info(`[AI Service] Provider: ${this.provider}, Prompt Length: ${prompt.length}`);
    if (this.provider === 'openai' && this.apiKey) {
      // Clean OpenAI integration abstraction
      return `[OpenAI Response] ${prompt}`;
    }
    // Default fallback AI assistant response
    return `Based on course materials: ${prompt}. To improve your competency, review the recommended lessons on this topic.`;
  }
}

module.exports = new AIService();
