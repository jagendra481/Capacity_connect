class PromptService {
  detectIntent(message = '', mode = 'general') {
    const q = message.toLowerCase().trim();

    if (mode === 'explain' || /explain|what is|how does|define|concept/i.test(q)) return 'EXPLANATION';
    if (mode === 'summarize' || /summarize|summary|takeaways|key points/i.test(q)) return 'SUMMARY';
    if (/simplify|like i'm 5|beginner|easy|simple/i.test(q)) return 'SIMPLIFY';
    if (/flashcard|cards|study cards/i.test(q)) return 'FLASHCARDS';
    if (/mcq|quiz|practice|test questions|questions|exam/i.test(q)) return 'PRACTICE';
    if (/why did i get|wrong|mistake|incorrect/i.test(q)) return 'MISTAKE_EXPLANATION';
    if (/what should i learn|study next|recommend|path/i.test(q)) return 'RECOMMENDATION';

    return 'GENERAL';
  }

  buildSystemPrompt({ userContext, courseContext, intent, history = [] }) {
    let systemPrompt = `You are the Smart Learning Assistant for Capacity Connect, a digital capacity-building and learning platform.

YOUR PRIMARY PURPOSE:
Help users understand, practice, and apply knowledge from their learning materials, courses, and skill development competencies.

ANSWER RULES:
1. Explain concepts clearly using structured Markdown (headers, bold key terms, bullet points).
2. Use clear, simple language and real-world examples.
3. Keep answers educational, concise, and focused.
4. Adapt to the detected intent (${intent}).
5. Never invent or fabricate false course material or fake user data.`;

    // GROUNDING RULE (Section 11)
    if (courseContext && courseContext.isCourseContextAvailable) {
      systemPrompt += `\n\nGROUNDING RULE (STRICT):
You have been provided with APPROVED COURSE MATERIAL below.
- Prioritize information from the retrieved course material.
- If the course material contains the answer, answer confidently based on it.
- If the course material does NOT contain enough information to answer the question, explicitly state:
  "I couldn't find enough information about this in the current course material. I can explain the concept using general knowledge if you'd like."
Then provide a brief general explanation.`;

      systemPrompt += `\n\nRETRIEVED COURSE MATERIAL (${courseContext.course?.title}):\n`;
      courseContext.relevantPassages.forEach((p, idx) => {
        systemPrompt += `\n[Passage ${idx + 1}] Course: ${p.courseTitle} | Module: ${p.moduleTitle} | Lesson: ${p.lessonTitle}\n${p.content}\n`;
      });
    } else if (courseContext && courseContext.course) {
      systemPrompt += `\n\nNOTE: The user is currently in course "${courseContext.course.title}", but no specific matching text was found for this query in the course. If answering using general knowledge, mention that this concept extends beyond the current lesson.`;
    }

    // USER CONTEXT (Section 6)
    if (userContext) {
      systemPrompt += `\n\nLEARNER PROFILE CONTEXT:
Name: ${userContext.name}
Role: ${userContext.role} (${userContext.designation})
Department: ${userContext.department || 'Engineering'}
Competency Score: ${userContext.competencyScore}/100`;

      if (userContext.skillGaps && userContext.skillGaps.length > 0) {
        const gapsStr = userContext.skillGaps.map(g => `${g.skill_name} (Gap: ${g.gap_score})`).join(', ');
        systemPrompt += `\nIdentified Skill Gaps: ${gapsStr}`;
      }
    }

    // INTENT SPECIFIC DIRECTIVES (Section 12)
    switch (intent) {
      case 'SIMPLIFY':
        systemPrompt += `\n\nDIRECTIVE: Provide a beginner-friendly breakdown using simple analogies and 3 easy-to-understand bullet points.`;
        break;
      case 'SUMMARY':
        systemPrompt += `\n\nDIRECTIVE: Provide a structured summary with 3-5 key takeaways and key terminology defined.`;
        break;
      case 'PRACTICE':
      case 'EXAM':
        systemPrompt += `\n\nDIRECTIVE: Provide 3 to 5 clear practice multiple-choice questions with options (A, B, C, D) and explanations for the correct answers.`;
        break;
      case 'FLASHCARDS':
        systemPrompt += `\n\nDIRECTIVE: Provide 4 concept flashcards formatted clearly with "Q: [Front]" and "A: [Back]".`;
        break;
      case 'RECOMMENDATION':
        systemPrompt += `\n\nDIRECTIVE: Provide personalized next-step learning recommendations tailored to the learner's skill gaps and current progress.`;
        break;
    }

    return systemPrompt;
  }

  formatHistory(history = []) {
    if (!Array.isArray(history) || history.length === 0) return [];
    // Take last 8 messages for memory window
    return history.slice(-8).map(m => ({
      role: m.sender === 'user' || m.role === 'user' ? 'user' : 'assistant',
      content: m.text || m.content || '',
    }));
  }
}

module.exports = new PromptService();
