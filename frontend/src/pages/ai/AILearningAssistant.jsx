import React, { useState } from 'react';
import aiService from '../../services/aiService';
import { Bot, Send, Sparkles, BookOpen, HelpCircle, Layers, FileText, CheckCircle2, RotateCw } from 'lucide-react';

export const AILearningAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Hello! I am your AI Learning Assistant. You can ask me questions directly from your enrolled course materials, request simplified explanations, or generate practice flashcards.',
      sources: [],
    },
  ]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('general'); // general, explain, summarize
  const [loading, setLoading] = useState(false);

  // Flashcards & Questions State
  const [flashcards, setFlashcards] = useState([]);
  const [practiceQuestions, setPracticeQuestions] = useState([]);
  const [activeTab, setActiveTab] = useState('chat'); // chat, flashcards, practice

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const res = await aiService.chat(currentInput, null, mode);
      if (res.data) {
        const aiMsg = {
          id: Date.now() + 1,
          sender: 'ai',
          text: res.data.answer,
          sources: res.data.sources || [],
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
          text: 'I encountered an issue processing your request. Please try asking again.',
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
      const res = await aiService.getFlashcards('React & Node Architecture');
      if (res.data) setFlashcards(res.data);
    }
  };

  const handleLoadPracticeQuestions = async () => {
    setActiveTab('practice');
    if (practiceQuestions.length === 0) {
      const res = await aiService.getPracticeQuestions('Enterprise Software Engineering');
      if (res.data) setPracticeQuestions(res.data);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 border border-purple-500/30 rounded-2xl p-6 md:p-8 shadow-2xl space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30">
          <Bot className="w-4 h-4" />
          <span>RAG-Powered AI Learning Assistant</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">
          Course Intelligence & Knowledge Assistant
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl">
          Ask questions prioritized against approved course materials, generate flashcards, and request simplified concept breakdowns with source references.
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
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[520px]">
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
                <span>Retrieving course materials and generating answer...</span>
              </div>
            )}
          </div>

          {/* Chat Form */}
          <form onSubmit={handleSend} className="p-4 bg-slate-950 border-t border-slate-800 flex items-center space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask any question about your enrolled courses..."
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
