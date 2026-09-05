import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import Loader from '../../components/common/Loader';
import {
  FileCheck2,
  Plus,
  Edit3,
  Trash2,
  HelpCircle,
  Users,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Award,
  BookOpen,
  X,
  ListOrdered,
  Sparkles,
} from 'lucide-react';

export const AssessmentManagement = () => {
  const [assessments, setAssessments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState(null);
  const [activeQuestionsAssessment, setActiveQuestionsAssessment] = useState(null);
  const [questionsList, setQuestionsList] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  const [activeAttemptsAssessment, setActiveAttemptsAssessment] = useState(null);
  const [attemptsList, setAttemptsList] = useState([]);
  const [attemptsLoading, setAttemptsLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    course_id: '',
    title: '',
    description: '',
    passing_score: 70,
    time_limit_minutes: 45,
    max_attempts: 3,
    is_published: true,
  });

  const [questionForm, setQuestionForm] = useState({
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_option: 0,
    explanation: '',
    points: 1,
  });

  const fetchAssessmentsAndCourses = async () => {
    setLoading(true);
    try {
      const [assessRes, coursesRes] = await Promise.all([
        adminService.getAssessments().catch(() => ({ data: [] })),
        adminService.getCourses().catch(() => ({ data: [] })),
      ]);

      if (assessRes?.data) setAssessments(Array.isArray(assessRes.data) ? assessRes.data : []);
      if (coursesRes?.data) setCourses(Array.isArray(coursesRes.data) ? coursesRes.data : []);
    } catch (err) {
      console.error('Failed to load assessments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessmentsAndCourses();
  }, []);

  const showFeedbackMsg = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
  };

  // Save Assessment
  const handleSaveAssessment = async (e) => {
    e.preventDefault();
    try {
      if (editingAssessment) {
        await adminService.updateAssessment(editingAssessment.id, formData);
        showFeedbackMsg('success', `Assessment "${formData.title}" updated.`);
      } else {
        await adminService.createAssessment(formData);
        showFeedbackMsg('success', `New assessment "${formData.title}" created.`);
      }
      setShowCreateModal(false);
      setEditingAssessment(null);
      fetchAssessmentsAndCourses();
    } catch (err) {
      showFeedbackMsg('error', err.response?.data?.error || err.message);
    }
  };

  // Delete Assessment
  const handleDeleteAssessment = async (id, title) => {
    if (!window.confirm(`Delete assessment "${title}"? This will remove all associated questions and attempt histories.`)) return;
    try {
      await adminService.deleteAssessment(id);
      showFeedbackMsg('success', `Assessment "${title}" deleted.`);
      fetchAssessmentsAndCourses();
    } catch (err) {
      showFeedbackMsg('error', err.response?.data?.error || err.message);
    }
  };

  // Open Questions Manager
  const handleOpenQuestions = async (assessment) => {
    setActiveQuestionsAssessment(assessment);
    setQuestionsLoading(true);
    try {
      const res = await adminService.getAssessmentQuestions(assessment.id);
      if (res?.data) {
        setQuestionsList(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      console.error('Failed to load questions:', err);
    } finally {
      setQuestionsLoading(false);
    }
  };

  // Add MCQ Question
  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!activeQuestionsAssessment) return;
    try {
      const options = [questionForm.option_a, questionForm.option_b, questionForm.option_c, questionForm.option_d];
      await adminService.addQuestion(activeQuestionsAssessment.id, {
        question_text: questionForm.question_text,
        options,
        correct_option: parseInt(questionForm.correct_option) || 0,
        explanation: questionForm.explanation,
        points: parseInt(questionForm.points) || 1,
      });

      showFeedbackMsg('success', 'New MCQ question added to bank.');
      setQuestionForm({
        question_text: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_option: 0,
        explanation: '',
        points: 1,
      });

      // Refresh question list
      handleOpenQuestions(activeQuestionsAssessment);
      fetchAssessmentsAndCourses();
    } catch (err) {
      showFeedbackMsg('error', err.response?.data?.error || err.message);
    }
  };

  // View Trainee Attempts
  const handleViewAttempts = async (assessment) => {
    setActiveAttemptsAssessment(assessment);
    setAttemptsLoading(true);
    try {
      const res = await adminService.getAssessmentAttempts(assessment.id);
      if (res?.data) {
        setAttemptsList(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      console.error('Failed to load attempts:', err);
    } finally {
      setAttemptsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20 mb-2">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Central Assessment & MCQ Engine</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Assessment & Question Bank Command
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-0.5">
            Configure passing benchmarks, author multi-choice questions with answer keys, and audit trainee attempt records.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingAssessment(null);
            setFormData({
              course_id: courses[0]?.id || 101,
              title: '',
              description: '',
              passing_score: 70,
              time_limit_minutes: 45,
              max_attempts: 3,
              is_published: true,
            });
            setShowCreateModal(true);
          }}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg flex items-center space-x-2 border border-amber-400/30"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Assessment</span>
        </button>
      </div>

      {/* Feedback Toast */}
      {feedback.message && (
        <div
          className={`p-4 rounded-xl border text-xs font-semibold flex items-center space-x-2 transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Assessments Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader size="medium" message="Loading assessments and question banks..." />
          </div>
        ) : assessments.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileCheck2 className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-sm text-slate-400 font-medium">No assessments configured yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Assessment</th>
                  <th className="py-3.5 px-4">Linked Course</th>
                  <th className="py-3.5 px-4">Passing Score</th>
                  <th className="py-3.5 px-4">Time Limit</th>
                  <th className="py-3.5 px-4">Questions</th>
                  <th className="py-3.5 px-4">Attempts</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {assessments.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-100">{a.title}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">{a.description}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-xs font-semibold text-slate-200">
                        {a.course_title || `Course #${a.course_id}`}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {a.passing_score || 70}% Required
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1 text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{a.time_limit_minutes || 45} mins</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleOpenQuestions(a)}
                        className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-bold flex items-center space-x-1"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>{a.total_questions ?? 15} Questions</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleViewAttempts(a)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-brand-400 border border-slate-700 rounded-lg text-xs font-bold flex items-center space-x-1"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>{a.attempts_count ?? 24} Attempts</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => {
                            setEditingAssessment(a);
                            setFormData({
                              course_id: a.course_id || '',
                              title: a.title || '',
                              description: a.description || '',
                              passing_score: a.passing_score || 70,
                              time_limit_minutes: a.time_limit_minutes || 45,
                              max_attempts: a.max_attempts || 3,
                              is_published: a.is_published !== false,
                            });
                            setShowCreateModal(true);
                          }}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg transition-all"
                          title="Edit Assessment"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteAssessment(a.id, a.title)}
                          className="p-1.5 bg-slate-800 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                          title="Delete Assessment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 1. Modal: Create / Edit Assessment */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <FileCheck2 className="w-5 h-5 text-amber-400" />
                <span>{editingAssessment ? 'Edit Assessment' : 'Create New Assessment'}</span>
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAssessment} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Linked Course *</label>
                <select
                  required
                  value={formData.course_id}
                  onChange={(e) => setFormData({ ...formData, course_id: parseInt(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-amber-500"
                >
                  <option value="">-- Choose Course --</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Assessment Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-amber-500"
                  placeholder="e.g. Satellite Remote Sensing & Altimetry Certification Exam"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Passing Score (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.passing_score}
                    onChange={(e) => setFormData({ ...formData, passing_score: parseInt(e.target.value) || 70 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Time Limit (Minutes)</label>
                  <input
                    type="number"
                    min="5"
                    value={formData.time_limit_minutes}
                    onChange={(e) => setFormData({ ...formData, time_limit_minutes: parseInt(e.target.value) || 45 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-lg"
                >
                  Save Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal: Question Bank & MCQ Authoring */}
      {activeQuestionsAssessment && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <HelpCircle className="w-5 h-5 text-amber-400" />
                  <span>Question Bank & MCQ Authoring</span>
                </h3>
                <p className="text-xs text-slate-400">{activeQuestionsAssessment.title}</p>
              </div>
              <button onClick={() => setActiveQuestionsAssessment(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Add New Question Form */}
            <form onSubmit={handleAddQuestion} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                Add New MCQ Question
              </h4>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Question Statement *</label>
                <input
                  type="text"
                  required
                  value={questionForm.question_text}
                  onChange={(e) => setQuestionForm({ ...questionForm, question_text: e.target.value })}
                  placeholder="e.g. Which satellite sensor is primarily utilized for sea surface salinity measurement?"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Option A (Index 0)</label>
                  <input
                    type="text"
                    required
                    value={questionForm.option_a}
                    onChange={(e) => setQuestionForm({ ...questionForm, option_a: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Option B (Index 1)</label>
                  <input
                    type="text"
                    required
                    value={questionForm.option_b}
                    onChange={(e) => setQuestionForm({ ...questionForm, option_b: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Option C (Index 2)</label>
                  <input
                    type="text"
                    required
                    value={questionForm.option_c}
                    onChange={(e) => setQuestionForm({ ...questionForm, option_c: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Option D (Index 3)</label>
                  <input
                    type="text"
                    required
                    value={questionForm.option_d}
                    onChange={(e) => setQuestionForm({ ...questionForm, option_d: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Correct Answer Key *</label>
                  <select
                    value={questionForm.correct_option}
                    onChange={(e) => setQuestionForm({ ...questionForm, correct_option: parseInt(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-emerald-400 font-bold outline-none focus:border-emerald-500"
                  >
                    <option value={0}>Option A</option>
                    <option value={1}>Option B</option>
                    <option value={2}>Option C</option>
                    <option value={3}>Option D</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Explanation / Scientific Justification</label>
                  <input
                    type="text"
                    value={questionForm.explanation}
                    onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                    placeholder="Brief explanation shown after submission..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="text-right pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow"
                >
                  Add Question to Bank
                </button>
              </div>
            </form>

            {/* List of existing questions */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider">
                Existing Questions ({questionsList.length})
              </h4>

              {questionsLoading ? (
                <Loader size="medium" message="Fetching question bank..." />
              ) : questionsList.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No questions authored yet for this assessment.</p>
              ) : (
                <div className="space-y-2.5">
                  {questionsList.map((q, idx) => {
                    const opts = typeof q.options === 'string' ? JSON.parse(q.options) : q.options || [];
                    return (
                      <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-slate-200">
                            {idx + 1}. {q.question_text}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                            Correct: {['A', 'B', 'C', 'D'][q.correct_option || 0]}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                          {opts.map((opt, oIdx) => (
                            <div
                              key={oIdx}
                              className={`p-1.5 rounded-lg border ${
                                oIdx === (q.correct_option || 0)
                                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-semibold'
                                  : 'border-slate-800 bg-slate-900/50'
                              }`}
                            >
                              <span className="font-bold mr-1">{['A', 'B', 'C', 'D'][oIdx]}:</span>
                              <span>{opt}</span>
                            </div>
                          ))}
                        </div>

                        {q.explanation && (
                          <div className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800/60">
                            💡 <span className="font-semibold text-slate-300">Explanation:</span> {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal: View Trainee Attempts */}
      {activeAttemptsAssessment && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Trainee Assessment Attempts</h3>
                <p className="text-xs text-slate-400">{activeAttemptsAssessment.title}</p>
              </div>
              <button onClick={() => setActiveAttemptsAssessment(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {attemptsLoading ? (
              <Loader size="medium" message="Fetching trainee attempt histories..." />
            ) : attemptsList.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No trainee attempts recorded for this assessment.
              </div>
            ) : (
              <div className="space-y-2.5">
                {attemptsList.map((att, idx) => (
                  <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-200">{att.trainee_name || `Trainee #${att.user_id}`}</p>
                      <p className="text-[11px] text-slate-400">{att.trainee_email}</p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-extrabold text-slate-100">{att.score}%</span>
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          att.passed
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {att.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentManagement;
