import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import certificateService from '../../services/certificateService';
import { Award, CheckCircle2, XCircle, ArrowRight, RotateCcw, Target, Sparkles, ShieldCheck } from 'lucide-react';

export const QuizResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const result = location.state?.resultData || {
    score: 85,
    passingScore: 70,
    passed: true,
    correctCount: 3,
    totalQuestions: 4,
    assessmentTitle: 'Full-Stack React & Node Evaluation',
    results: [
      {
        question_id: 101,
        question_text: 'Which React hook should be used to perform side effects?',
        submitted_answer: 'useEffect',
        correct_answer: 'useEffect',
        is_correct: true,
        explanation: 'useEffect handles side effects in functional components.',
      },
    ],
  };

  const handleClaimCertificate = async () => {
    setClaiming(true);
    try {
      await certificateService.generateCertificate({
        title: result.assessmentTitle || 'Course Completion & Skill Evaluation',
        status: 'pending', // Trainee requests certificate, Admin approves it
      });
      setClaimed(true);
      setTimeout(() => {
        navigate('/certificates');
      }, 1500);
    } catch (err) {
      console.error(err);
      alert('Failed to request certificate. Please try again.');
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Result Hero Banner */}
      <div className={`border rounded-2xl p-8 text-center space-y-4 shadow-2xl relative overflow-hidden ${
        result.passed
          ? 'bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-500/40'
          : 'bg-gradient-to-b from-red-950/40 via-slate-900 to-slate-900 border-red-500/40'
      }`}>
        <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg border">
          {result.passed ? (
            <div className="p-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-xl">
              <Award className="w-10 h-10" />
            </div>
          ) : (
            <div className="p-3 bg-red-500/20 text-red-400 border border-red-500/40 rounded-xl">
              <XCircle className="w-10 h-10" />
            </div>
          )}
        </div>

        <div>
          <span className={`px-3 py-1 text-xs font-extrabold uppercase tracking-wider rounded-full border ${
            result.passed
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              : 'bg-red-500/20 text-red-400 border-red-500/30'
          }`}>
            {result.passed ? 'ASSESSMENT PASSED' : 'RETEST REQUIRED'}
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-3">
            {result.assessmentTitle || 'Assessment Evaluation'}
          </h1>
        </div>

        <div className="flex items-center justify-center space-x-6 pt-2">
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase font-semibold">Your Score</p>
            <p className={`text-4xl font-extrabold mt-1 ${result.passed ? 'text-emerald-400' : 'text-red-400'}`}>
              {result.score}%
            </p>
          </div>
          <div className="h-10 w-px bg-slate-800" />
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase font-semibold">Passing Target</p>
            <p className="text-4xl font-extrabold text-slate-300 mt-1">{result.passingScore || 70}%</p>
          </div>
          <div className="h-10 w-px bg-slate-800" />
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase font-semibold">Correct Answers</p>
            <p className="text-4xl font-extrabold text-brand-400 mt-1">
              {result.correctCount}/{result.totalQuestions}
            </p>
          </div>
        </div>

        {/* Claim Certificate Button */}
        {result.passed && (
          <div className="pt-2">
            {claimed ? (
              <div className="p-3 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold inline-flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Certificate Request Submitted to Admin! Redirecting to Certificates Gallery...</span>
              </div>
            ) : (
              <button
                onClick={handleClaimCertificate}
                disabled={claiming}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-amber-500/20 inline-flex items-center space-x-2"
              >
                <Award className="w-4 h-4" />
                <span>{claiming ? 'Submitting Certificate Request...' : 'Claim Digital Completion Certificate'}</span>
                <Sparkles className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 inline-flex items-center space-x-2 text-xs text-brand-300">
          <Sparkles className="w-4 h-4 text-brand-400" />
          <span>Assessment score has been calculated and updated in your Skill Gap Engine profile.</span>
        </div>
      </div>

      {/* Detailed Question Review */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-slate-100">Question Performance Analysis</h3>
        <div className="space-y-3">
          {(result.results || []).map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border space-y-2 ${
                item.is_correct
                  ? 'bg-emerald-950/20 border-emerald-500/20'
                  : 'bg-red-950/20 border-red-500/20'
              }`}
            >
              <div className="flex items-start justify-between">
                <p className="text-sm font-semibold text-slate-100 flex-1">{item.question_text}</p>
                {item.is_correct ? (
                  <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Correct</span>
                  </span>
                ) : (
                  <span className="text-xs font-bold text-red-400 flex items-center space-x-1">
                    <XCircle className="w-4 h-4" />
                    <span>Incorrect</span>
                  </span>
                )}
              </div>
              <div className="text-xs space-y-1 text-slate-300 pt-1 border-t border-slate-800/60">
                <p><span className="text-slate-400 font-medium">Your Answer:</span> <span className="font-semibold">{item.submitted_answer}</span></p>
                {!item.is_correct && (
                  <p><span className="text-emerald-400 font-medium">Correct Answer:</span> <span className="font-semibold text-emerald-400">{item.correct_answer}</span></p>
                )}
                {item.explanation && (
                  <p className="text-slate-400 italic pt-1">💡 {item.explanation}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Navigation */}
      <div className="flex items-center justify-between pt-2">
        <Link
          to="/trainee/assessments"
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-xl transition-colors flex items-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Back to Assessments</span>
        </Link>
        <Link
          to="/trainee/skills"
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-brand-600/20 flex items-center space-x-2"
        >
          <Target className="w-4 h-4" />
          <span>View Updated Skill Gap</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default QuizResult;
