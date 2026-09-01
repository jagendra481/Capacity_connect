import React, { useState, useEffect } from 'react';
import trainerService from '../../services/trainerService';
import TraineeList from '../../components/trainer/TraineeList';
import CourseCreateModal from '../../components/trainer/CourseCreateModal';
import AssessmentCreateModal from '../../components/trainer/AssessmentCreateModal';
import Loader from '../../components/common/Loader';
import { Users, BookOpen, FileCheck2, Plus, BarChart2, Award } from 'lucide-react';

export const TrainerDashboard = () => {
  const [trainees, setTrainees] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);

  const loadTrainerData = () => {
    Promise.all([
      trainerService.getTrainees(),
      trainerService.getCourses(),
    ])
      .then(([tRes, cRes]) => {
        if (tRes.data) setTrainees(tRes.data);
        if (cRes.data) setCourses(cRes.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTrainerData();
  }, []);

  const handleCreateCourse = async (courseData) => {
    await trainerService.createCourse(courseData);
    loadTrainerData();
  };

  const handleCreateAssessment = async (asmData) => {
    await trainerService.createAssessment(asmData);
    loadTrainerData();
  };

  if (loading) return <Loader size="large" message="Loading Trainer Management Hub..." />;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 border border-blue-500/30 rounded-2xl p-6 md:p-8 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
              Trainer Executive Portal
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-2">
              Instructor & Capacity Management Dashboard
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Manage assigned trainees, author training courses, publish evaluations, and monitor organizational competency progression.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsCourseModalOpen(true)}
              className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Course</span>
            </button>
            <button
              onClick={() => setIsAssessmentModalOpen(true)}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Assessment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-1">
          <span className="text-xs font-medium text-slate-400 uppercase">Assigned Trainees</span>
          <p className="text-2xl font-extrabold text-slate-100">{trainees.length}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-1">
          <span className="text-xs font-medium text-slate-400 uppercase">Managed Courses</span>
          <p className="text-2xl font-extrabold text-brand-400">{courses.length}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-1">
          <span className="text-xs font-medium text-slate-400 uppercase">Avg Trainee Pass Rate</span>
          <p className="text-2xl font-extrabold text-emerald-400">92%</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-1">
          <span className="text-xs font-medium text-slate-400 uppercase">Competency Improvement</span>
          <p className="text-2xl font-extrabold text-purple-400">+18.5pt</p>
        </div>
      </div>

      {/* Trainees Table */}
      <TraineeList trainees={trainees} />

      {/* Modals */}
      <CourseCreateModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        onCreate={handleCreateCourse}
      />
      <AssessmentCreateModal
        isOpen={isAssessmentModalOpen}
        onClose={() => setIsAssessmentModalOpen(false)}
        onCreate={handleCreateAssessment}
      />
    </div>
  );
};

export default TrainerDashboard;
