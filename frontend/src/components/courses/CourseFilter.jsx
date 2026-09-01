import React from 'react';
import { Search, Filter } from 'lucide-react';

export const CourseFilter = ({ search, setSearch, category, setCategory, level, setLevel }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-5 shadow-lg space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:space-x-4">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search course title, skills, keywords..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-100 text-xs focus:outline-none focus:border-brand-500 transition-colors"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1.5 text-xs text-slate-400">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="hidden sm:inline">Filters:</span>
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-slate-100 text-xs focus:outline-none focus:border-brand-500 transition-colors"
        >
          <option value="">All Categories</option>
          <option value="Engineering">Engineering</option>
          <option value="Database">Database</option>
          <option value="AI">AI & Machine Learning</option>
          <option value="Security">Cyber Security</option>
        </select>

        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-slate-100 text-xs focus:outline-none focus:border-brand-500 transition-colors"
        >
          <option value="">All Difficulty Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>
    </div>
  );
};

export default CourseFilter;
