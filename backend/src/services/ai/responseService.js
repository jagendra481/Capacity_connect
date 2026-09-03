class ResponseService {
  formatChatResponse({ responseText, conversationId = null, sources = [], intent = 'GENERAL', ragUsed = false }) {
    // Validate AI Response String
    let answerText = responseText;

    if (!answerText || typeof answerText !== 'string' || !answerText.trim()) {
      answerText = 'Sorry, I couldn\'t process that request right now. Please try asking again.';
    } else {
      answerText = answerText.trim();
    }

    return {
      success: true,
      answer: answerText,
      reply: answerText,
      conversationId: conversationId || null,
      sources: Array.isArray(sources) ? sources : [],
      ragUsed: Boolean(ragUsed),
      intent,
    };
  }

  formatPracticeQuestions(questions = [], topic = 'General') {
    if (!Array.isArray(questions) || questions.length === 0) {
      return [
        {
          question: `What is the primary goal of studying ${topic}?`,
          options: [
            'Developing measurable competencies and practical skills',
            'Memorizing static definitions without understanding',
            'Bypassing assessment evaluations',
            'None of the above',
          ],
          correctIndex: 0,
          explanation: 'Targeted learning builds practical capabilities and closes identified skill gaps.',
        },
      ];
    }
    return questions;
  }

  formatFlashcards(flashcards = [], topic = 'General') {
    if (!Array.isArray(flashcards) || flashcards.length === 0) {
      return [
        {
          id: 1,
          front: `What is ${topic}?`,
          back: 'A key learning competency module designed to build enterprise capabilities.',
        },
      ];
    }
    return flashcards;
  }
}

module.exports = new ResponseService();
