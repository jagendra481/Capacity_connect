const aiService = require('../services/aiService');

class AIConfigWrapper {
  async generateResponse(prompt, context = '') {
    const res = await aiService.chat({ prompt, courseId: context });
    return res.answer || res.reply;
  }
}

module.exports = new AIConfigWrapper();
