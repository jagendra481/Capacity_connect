class Answer {
  static evaluate(submittedAnswers = {}, questions = []) {
    let totalScore = 0;
    let totalPointsPossible = 0;
    let correctCount = 0;
    const itemResults = [];

    questions.forEach((q) => {
      const submitted = submittedAnswers[q.id];
      const isCorrect = submitted && String(submitted).trim().toLowerCase() === String(q.correct_answer).trim().toLowerCase();
      
      const qPoints = q.points || 10;
      totalPointsPossible += qPoints;

      if (isCorrect) {
        correctCount += 1;
        totalScore += qPoints;
      }

      itemResults.push({
        question_id: q.id,
        question_text: q.question_text,
        submitted_answer: submitted || 'No Answer',
        correct_answer: q.correct_answer,
        is_correct: isCorrect,
        explanation: q.explanation,
      });
    });

    const scorePercentage = Math.round((totalScore / Math.max(totalPointsPossible, 1)) * 100);

    return {
      score: scorePercentage,
      correctCount,
      totalQuestions: questions.length,
      itemResults,
    };
  }
}

module.exports = Answer;
