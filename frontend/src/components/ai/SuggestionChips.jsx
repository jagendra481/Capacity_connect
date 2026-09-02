import React, { useState } from 'react';
import { Sparkles, Users, Compass, BarChart3, Code } from 'lucide-react';

const CATEGORIES = [
  {
    id: 'talent',
    label: 'Talent & Capacity',
    icon: Users,
    prompts: [
      'Who has >20h available?',
      'Find React developers',
      'Show active projects',
      'Capacity breakdown'
    ]
  },
  {
    id: 'platform',
    label: 'Platform Guide',
    icon: Compass,
    prompts: [
      'Where are my courses?',
      'How to verify certificates?',
      'How to join training sessions?',
      'How to earn badges & XP?'
    ]
  },
  {
    id: 'analytics',
    label: 'Radar & Skills',
    icon: BarChart3,
    prompts: [
      'What is Capacity Radar?',
      'How is Skill Gap calculated?',
      'How does Training ROI work?',
      'Explain Competency Matrix'
    ]
  },
  {
    id: 'tech',
    label: 'Tech & Architecture',
    icon: Code,
    prompts: [
      'Explain Clean Architecture',
      'How does JWT Auth work?',
      'Docker vs Kubernetes',
      'REST vs GraphQL'
    ]
  }
];

export const SuggestionChips = ({ onSelectPrompt, disabled }) => {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div className="space-y-1.5">
      {/* Category Pills */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat, idx) => {
          const Icon = cat.icon;
          const isActive = activeCategory === idx;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(idx)}
              type="button"
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Suggestion Prompts for Active Category */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES[activeCategory].prompts.map((prompt, pIdx) => (
          <button
            key={pIdx}
            onClick={() => onSelectPrompt(prompt)}
            disabled={disabled}
            type="button"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/25 transition-all whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestionChips;
