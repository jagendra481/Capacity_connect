import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import aiService from '../../services/aiService';
import courseService from '../../services/courseService';
import { Bot, Send, Sparkles, BookOpen, HelpCircle, Layers, FileText, CheckCircle2, RotateCw, Lightbulb, MessageSquare } from 'lucide-react';

export const AILearningAssistant = () => {
  const [searchParams] = useSearchParams();
  const urlCourseId = searchParams.get('courseId');

  const [course, setCourse] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('general'); // general, explain, summarize
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  // Flashcards & Questions State
  const [flashcards, setFlashcards] = useState([]);
  const [practiceQuestions, setPracticeQuestions] = useState([]);
  const [activeTab, setActiveTab] = useState('chat'); // chat, flashcards, practice

  // Load course details if courseId is passed in URL
  useEffect(() => {
    if (urlCourseId) {
      courseService.getCourseById(urlCourseId)
        .then(res => {
          if (res.data) setCourse(res.data);
        })
        .catch(err => console.error(err));
    }
  }, [urlCourseId]);

  // Initial welcome message
  useEffect(() => {
    const welcomeText = urlCourseId && course
      ? `👋 Welcome to **${course.title}** AI Assistant!\n\nI am grounded in your course materials. You can ask me to explain concepts from this course, generate flashcards, or create practice questions.`
      : '👋 Hello! I am your **Capacity Connect AI Assistant**.\n\nYou can ask me questions directly from your enrolled course materials, request simplified concept explanations, analyze skill gaps, or generate practice flashcards.';

    setMessages([
      {
        id: 1,
        sender: 'ai',
        text: welcomeText,
        sources: [],
      },
    ]);
  }, [urlCourseId, course]);

  const handleSend = async (e, customText = null) => {
    if (e) e.preventDefault();
    const queryText = customText || input;
    if (!queryText || !queryText.trim() || loading) return;

    const userMsg = { id: Date.now(), sender: 'user', text: queryText.trim() };
    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInput('');
    setLoading(true);

    try {
      const res = await aiService.chat(queryText.trim(), urlCourseId, mode, { conversationId });
      const botData = res.data || res;
      if (botData) {
        if (botData.conversationId) setConversationId(botData.conversationId);

        const aiMsg = {
          id: Date.now() + 1,
          sender: 'ai',
          text: botData.answer || botData.reply,
          sources: botData.sources || [],
        };
        setMessages(prev => [...prev, aiMsg]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: 'Sorry, I couldn\'t process that request right now. Please try again.',
          sources: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadFlashcards = async () => {
    setActiveTab('flashcards');
    if (flashcards.length === 0) {
      const topic = course ? course.title : 'Software Engineering & Competencies';
      const res = await aiService.getFlashcards(topic);
      if (res.data) setFlashcards(res.data);
    }
  };

  const handleLoadPracticeQuestions = async () => {
    setActiveTab('practice');
    if (practiceQuestions.length === 0) {
      const topic = course ? course.title : 'Enterprise Software Systems';
      const res = await aiService.getPracticeQuestions(topic);
      if (res.data) setPracticeQuestions(res.data);
    }
  };

  const quickActionChips = urlCourseId && course ? [
    'Explain key concepts from this course',
    'Summarize this course',
    'Give me practice questions',
    'What are my skill gaps?',
    'Create flashcards',
  ] : [
    'What is competency?',
    'What should I learn next?',
    'Give me practice questions',
    'Summarize my progress',
    'Create flashcards',
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 border border-purple-500/30 rounded-2xl p-6 md:p-8 shadow-2xl space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30">
            <Bot className="w-4 h-4 text-cyan-400" />
            <span>Capacity Connect Smart AI Assistant</span>
          </div>

          {course && (
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-bold border border-cyan-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Grounded Course: {course.title}</span>
            </div>
          )}
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-white">
          {course ? `Course AI Assistant: ${course.title}` : 'Smart Integrated AI Learning Assistant'}
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl">
          {course
            ? `Ask questions grounded directly in "${course.title}". Get source-cited answers, concept summaries, and practice quizzes.`
            : 'Ask questions about your courses, competencies, skill gaps, or practice questions with AI grounded responses.'}
        </p>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 pt-2">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'chat'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Course Chatbot</span>
          </button>
          <button
            onClick={handleLoadFlashcards}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'flashcards'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>AI Flashcards</span>
          </button>
          <button
            onClick={handleLoadPracticeQuestions}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'practice'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Practice Questions</span>
          </button>
        </div>
      </div>

      {activeTab === 'chat' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[540px]">
          {/* Mode Selector */}
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6">
            <span className="text-xs font-semibold text-slate-400">Response Mode:</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setMode('general')}
                className={`px-3 py-1 text-xs rounded-lg font-semibold transition-colors ${
                  mode === 'general' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                Ask from Course
              </button>
              <button
                onClick={() => setMode('explain')}
                className={`px-3 py-1 text-xs rounded-lg font-semibold transition-colors ${
                  mode === 'explain' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                Explain Simply
              </button>
              <button
                onClick={() => setMode('summarize')}
                className={`px-3 py-1 text-xs rounded-lg font-semibold transition-colors ${
                  mode === 'summarize' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                Summarize
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed shadow-md ${
                    m.sender === 'user'
                      ? 'bg-purple-600 text-white rounded-br-none'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-line">{m.text}</div>

                  {/* RAG Source Citations */}
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-purple-300 space-y-1">
                      <p className="font-bold flex items-center space-x-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Source References:</span>
                      </p>
                      {m.sources.map((s, idx) => (
                        <p key={idx} className="text-slate-400">
                          📚 {s.courseTitle} — <span className="text-slate-300 font-semibold">{s.source}</span>
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center space-x-2 text-xs text-purple-400 bg-purple-950/20 p-3 rounded-xl border border-purple-500/20 w-max">
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>Analyzing your question & retrieving relevant material...</span>
              </div>
            )}
          </div>

          {/* Quick Action Suggestion Chips */}
          <div className="px-6 py-2 bg-slate-950/80 border-t border-slate-800/60 flex items-center space-x-2 overflow-x-auto">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="text-[10px] uppercase font-bold text-slate-500 flex-shrink-0">Suggestions:</span>
            {quickActionChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(null, chip)}
                className="px-2.5 py-1 bg-slate-900 hover:bg-purple-900/40 text-slate-300 hover:text-white rounded-lg text-[11px] font-medium border border-slate-800 transition-colors flex-shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Form */}
          <form onSubmit={(e) => handleSend(e)} className="p-4 bg-slate-950 border-t border-slate-800 flex items-center space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={course ? `Ask a question about ${course.title}...` : 'Ask any question about your enrolled courses or competencies...'}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-xs text-slate-100 focus:outline-none focus:border-purple-500 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-purple-600/20 flex items-center space-x-1.5"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* AI Flashcards View */}
      {activeTab === 'flashcards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {flashcards.map((card) => (
            <div key={card.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-extrabold bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20">
                  Concept Flashcard
                </span>
                <h4 className="text-sm font-bold text-slate-100 pt-1">{card.front}</h4>
              </div>
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed">
                💡 <span className="font-medium">{card.back}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Practice Questions View */}
      {activeTab === 'practice' && (
        <div className="space-y-4">
          {practiceQuestions.map((q, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h4 className="text-base font-bold text-slate-100">{q.question}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {q.options.map((opt, oIdx) => (
                  <div
                    key={oIdx}
                    className={`p-3 rounded-xl border text-xs font-semibold ${
                      oIdx === q.correctIndex
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    {opt} {oIdx === q.correctIndex && '✓ (Correct)'}
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 italic">💡 {q.explanation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AILearningAssistant;
