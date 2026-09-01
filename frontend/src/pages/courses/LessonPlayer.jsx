import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import courseService from '../../services/courseService';
import ResourceViewer from '../../components/courses/ResourceViewer';
import Loader from '../../components/common/Loader';
import { ArrowLeft, CheckCircle2, ArrowRight, Play, BookOpen, Bot } from 'lucide-react';

export const LessonPlayer = () => {
  const { id: courseId, lessonId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setLoading(true);
    courseService.getLessonDetails(lessonId)
      .then(res => {
        if (res.data) {
          setLesson(res.data);
          setCompleted(res.data.completed || false);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [lessonId]);

  const handleMarkComplete = async () => {
    try {
      await courseService.updateLessonProgress(courseId, lessonId, !completed);
      setCompleted(!completed);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Loader size="large" message="Loading lesson player & content..." />;
  if (!lesson) return <div className="p-8 text-center text-slate-400">Lesson not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to={`/courses/${courseId}`} className="inline-flex items-center space-x-2 text-xs text-slate-400 hover:text-slate-200">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Course Syllabus</span>
        </Link>
        <button
          onClick={handleMarkComplete}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center space-x-2 ${
            completed
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/20'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{completed ? 'Completed' : 'Mark Lesson as Complete'}</span>
        </button>
      </div>

      {/* Embedded Video Player */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="aspect-video w-full bg-slate-950 flex items-center justify-center relative">
          <iframe
            src={lesson.video_url || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
            title={lesson.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">Lesson Video</span>
              <h1 className="text-xl md:text-2xl font-bold text-slate-100 mt-1">{lesson.title}</h1>
            </div>
            <Link
              to="/ai/assistant"
              className="inline-flex items-center space-x-2 px-3.5 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-semibold transition-colors"
            >
              <Bot className="w-4 h-4" />
              <span>Ask AI About This Lesson</span>
            </Link>
          </div>

          {/* Lesson Text Content */}
          <div className="prose prose-invert max-w-none text-sm text-slate-300 space-y-4">
            <div dangerouslySetInnerHTML={{ __html: lesson.content ? lesson.content.replace(/\n/g, '<br/>') : '' }} />
          </div>

          {/* Lesson Resources */}
          <ResourceViewer resources={lesson.resources} />
        </div>
      </div>
    </div>
  );
};

export default LessonPlayer;
