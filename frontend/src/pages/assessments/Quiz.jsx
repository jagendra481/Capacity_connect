import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import assessmentService from '../../services/assessmentService';
import Loader from '../../components/common/Loader';
import { Clock, ArrowLeft, ArrowRight, CheckCircle2, FileCheck2, AlertCircle } from 'lucide-react';

export const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(1800);

  useEffect(() => {
    assessmentService.getAssessmentById(id)
      .then(res => {
        if (res.data) {
          setAssessment(res.data);
          setTimeLeftSeconds((res.data.time_limit_minutes || 30) * 60);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (timeLeftSeconds <= 0) {
      handleSubmitQuiz();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeftSeconds(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeftSeconds]);

  const handleSelectOption = (questionId, option) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    try {
      const res = await assessmentService.submitAssessment(id, answers);
      if (res.data) {
        navigate(`/assessments/${id}/results`, { state: { resultData: res.data } });
      }
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader size="large" message="Preparing assessment question bank..." />;
  if (!assessment) return <div className="p-8 text-center text-slate-400">Assessment not found</div>;

  const questions = assessment.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Link to="/trainee/assessments" className="inline-flex items-center space-x-2 text-xs text-slate-400 hover:text-slate-200">
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Assessment</span>
        </Link>
        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-brand-400 font-mono text-sm font-bold shadow-md">
          <Clock className="w-4 h-4" />
          <span>Time Remaining: {formatTime(timeLeftSeconds)}</span>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">
        {/* Assessment Progress Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">{assessment.category} Evaluation</span>
            <h1 className="text-xl font-bold text-slate-100 mt-0.5">{assessment.title}</h1>
          </div>
          <span className="text-xs font-bold text-slate-400 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>

        {/* Current Question */}
        {currentQuestion && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold bg-brand-500/10 text-brand-400 rounded border border-brand-500/20">
                Type: {currentQuestion.type} ({currentQuestion.points || 25} Points)
              </span>
              <h2 className="text-lg font-semibold text-slate-100 leading-relaxed pt-1">
                {currentQuestion.question_text}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {(currentQuestion.options || ['True', 'False']).map((opt, idx) => {
                const isSelected = answers[currentQuestion.id] === opt;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(currentQuestion.id, opt)}
                    className={`w-full p-4 rounded-xl border text-left text-sm font-medium transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-brand-600/20 border-brand-500 text-white shadow-lg shadow-brand-500/10'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <span>{opt}</span>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-brand-400 bg-brand-500 text-white' : 'border-slate-700'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800">
          <button
            onClick={() => setCurrentQuestionIndex(prev => Math.max(prev - 1, 0))}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-sm font-semibold rounded-xl transition-colors"
          >
            Previous
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleSubmitQuiz}
              disabled={submitting}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center space-x-2"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>{submitting ? 'Evaluating...' : 'Submit Assessment'}</span>
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.min(prev + 1, questions.length - 1))}
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-brand-600/20 flex items-center space-x-1.5"
            >
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
