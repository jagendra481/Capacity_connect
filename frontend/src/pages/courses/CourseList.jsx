import React, { useState, useEffect } from 'react';
import courseService from '../../services/courseService';
import CourseCard from '../../components/courses/CourseCard';
import CourseFilter from '../../components/courses/CourseFilter';
import Loader from '../../components/common/Loader';
import { BookOpen } from 'lucide-react';

export const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');

  useEffect(() => {
    setLoading(true);
    courseService.getCourses({ search, category, level })
      .then(res => {
        if (res.data) setCourses(res.data);
      })
      .catch(err => console.error('Failed to load courses:', err))
      .finally(() => setLoading(false));
  }, [search, category, level]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-brand-400" />
            <span>Course Catalog</span>
          </h1>
          <p className="text-sm text-slate-400">
            Explore structured learning paths, interactive modules, and technical training
          </p>
        </div>
      </div>

      <CourseFilter
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        level={level}
        setLevel={setLevel}
      />

      {loading ? (
        <Loader message="Loading courses catalog..." />
      ) : courses.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-200">No courses match your filter</h3>
          <p className="text-xs text-slate-400 mt-1">Try resetting your search term or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;
