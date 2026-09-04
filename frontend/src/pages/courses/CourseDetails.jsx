import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import courseService from '../../services/courseService';
import ModuleList from '../../components/courses/ModuleList';
import CourseProgress from '../../components/courses/CourseProgress';
import Loader from '../../components/common/Loader';
import { Clock, BookOpen, User, ArrowLeft, PlayCircle, Award, Bot, Sparkles, ExternalLink, Youtube } from 'lucide-react';

export const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    courseService.getCourseById(id)
      .then(res => {
        if (res.data) setCourse(res.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader size="large" message="Loading course curriculum & modules..." />;
  if (!course) return <div className="p-8 text-center text-slate-400">Course not found</div>;

  const firstLessonId = course.modules?.[0]?.lessons?.[0]?.id;

  return (
    <div className="space-y-6">
      <Link to="/trainee/courses" className="inline-flex items-center space-x-2 text-xs text-slate-400 hover:text-slate-200">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Courses</span>
      </Link>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 text-[10px] uppercase font-extrabold rounded-md bg-brand-500/10 text-brand-400 border border-brand-500/20">
                {course.category}
              </span>
              <span className="px-2.5 py-1 text-[10px] uppercase font-extrabold rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                {course.level}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100">{course.title}</h1>
            <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">{course.description}</p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center space-x-1">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>Duration: {course.duration}</span>
              </span>
              <span className="flex items-center space-x-1">
                <User className="w-4 h-4 text-slate-500" />
                <span>Instructor: {course.trainer_name || 'Technical Trainer'}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Award className="w-4 h-4 text-slate-500" />
                <span>Prerequisites: {course.prerequisites}</span>
              </span>
            </div>
          </div>

          <div className="w-full lg:w-80 flex-shrink-0 space-y-3">
            <CourseProgress completedLessons={course.completedLessons} totalLessons={course.totalLessons} />
            {firstLessonId && (
              <Link
                to={`/courses/${id}/lessons/${firstLessonId}`}
                className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-brand-600/20 flex items-center justify-center space-x-2"
              >
                <PlayCircle className="w-5 h-5" />
                <span>Continue Learning</span>
              </Link>
            )}

            {course.playlist_url && (
              <a
                href={course.playlist_url}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2"
              >
                <Youtube className="w-4 h-4" />
                <span>Open YouTube Playlist</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {course.playlist_title && (
              <p className="text-[11px] text-slate-500 text-center -mt-1">Curated source: {course.playlist_title}</p>
            )}

            {/* Core Feature: Ask from my course button */}
            <Link
              to={`/ai/assistant?courseId=${id}`}
              className="w-full py-2.5 bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-500/30 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>Ask from my course</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </Link>
          </div>
        </div>

        {/* Modules & Lessons Hierarchy */}
        <div className="pt-6 border-t border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-brand-400" />
            <span>Course Syllabus & Lessons</span>
          </h3>
          <ModuleList modules={course.modules || []} courseId={id} />
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
