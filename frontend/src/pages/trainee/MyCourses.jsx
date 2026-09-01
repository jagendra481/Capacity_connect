import React, { useState, useEffect } from 'react';
import courseService from '../../services/courseService';
import CourseCard from '../../components/courses/CourseCard';
import Loader from '../../components/common/Loader';
import { BookOpen } from 'lucide-react';

export const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    courseService.getCourses()
      .then(res => {
        if (res.data) setCourses(res.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center space-x-2">
          <BookOpen className="w-6 h-6 text-brand-400" />
          <span>My Enrolled Courses</span>
        </h1>
        <p className="text-sm text-slate-400">Track learning progress, resume modules, and access resources</p>
      </div>

      {loading ? (
        <Loader message="Loading your enrolled courses..." />
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

export default MyCourses;
