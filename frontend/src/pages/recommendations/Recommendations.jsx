import React, { useState, useEffect } from 'react';
import recommendationService from '../../services/recommendationService';
import CourseRecommendation from '../../components/recommendations/CourseRecommendation';
import LearningPathCard from '../../components/recommendations/LearningPathCard';
import Loader from '../../components/common/Loader';
import { Sparkles, Route } from 'lucide-react';

export const Recommendations = () => {
  const [data, setData] = useState(null);
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      recommendationService.getRecommendations(),
      recommendationService.getLearningPaths(),
    ])
      .then(([recRes, pathRes]) => {
        if (recRes.data) setData(recRes.data);
        if (pathRes.data) setPaths(pathRes.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader size="large" message="Generating Training Recommendation Engine..." />;

  const recList = data?.recommendations || [];

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-brand-950 via-slate-900 to-slate-900 border border-brand-500/30 rounded-2xl p-6 md:p-8 shadow-2xl space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30">
          <Sparkles className="w-3.5 h-3.5 text-brand-300" />
          <span>Training Recommendation Engine</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">
          Personalized Training & Learning Paths
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl">
          Recommendations are dynamically updated after every assessment attempt by matching your current skill gaps, role targets, and course prerequisites.
        </p>
      </div>

      {/* Recommended Courses Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-brand-400" />
          <span>Priority Course Recommendations</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recList.map((item) => (
            <CourseRecommendation key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Structured Learning Paths Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
          <Route className="w-5 h-5 text-purple-400" />
          <span>Structured Learning Paths</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paths.map((p) => (
            <LearningPathCard key={p.id} path={p} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
