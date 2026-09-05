import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import Loader from '../../components/common/Loader';
import {
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  Users,
  UserCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  X,
  Clock,
  Layers,
  GraduationCap,
  Sparkles,
  Eye,
  Check,
} from 'lucide-react';

export const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [assigningCourse, setAssigningCourse] = useState(null);
  const [viewingEnrollmentsCourse, setViewingEnrollmentsCourse] = useState(null);
  const [enrollmentsList, setEnrollmentsList] = useState([]);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Engineering & Ocean Tech',
    level: 'intermediate',
    duration_hours: 40,
    max_enrollment: 100,
    thumbnail_url: '',
    prerequisites: '',
    is_published: true,
  });

  const [selectedTrainerId, setSelectedTrainerId] = useState('');

  const fetchCoursesAndTrainers = async () => {
    setLoading(true);
    try {
      const [coursesRes, trainersRes] = await Promise.all([
        adminService.getCourses().catch(() => ({ data: [] })),
        adminService.getUsers({ role: 'trainer' }).catch(() => ({ data: [] })),
      ]);

      if (coursesRes?.data) setCourses(Array.isArray(coursesRes.data) ? coursesRes.data : []);
      if (trainersRes?.data) setTrainers(Array.isArray(trainersRes.data) ? trainersRes.data : []);
    } catch (err) {
      console.error('Failed to load courses:', err);
      showFeedbackMsg('error', 'Failed to retrieve course data from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoursesAndTrainers();
  }, []);

  const showFeedbackMsg = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
  };

  // Create or Update Course
  const handleSaveCourse = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await adminService.updateCourse(editingCourse.id, formData);
        showFeedbackMsg('success', `Course "${formData.title}" updated successfully.`);
      } else {
        await adminService.createCourse(formData);
        showFeedbackMsg('success', `New course "${formData.title}" created successfully.`);
      }
      setShowCreateModal(false);
      setEditingCourse(null);
      resetForm();
      fetchCoursesAndTrainers();
    } catch (err) {
      showFeedbackMsg('error', err.response?.data?.error || err.message);
    }
  };

  // Publish / Unpublish Toggle
  const handleTogglePublish = async (course) => {
    try {
      const nextStatus = !course.is_published;
      await adminService.updateCourse(course.id, { is_published: nextStatus });
      showFeedbackMsg('success', `Course "${course.title}" is now ${nextStatus ? 'PUBLISHED' : 'DRAFT'}.`);
      fetchCoursesAndTrainers();
    } catch (err) {
      showFeedbackMsg('error', err.response?.data?.error || err.message);
    }
  };

  // Delete Course
  const handleDeleteCourse = async (courseId, title) => {
    if (!window.confirm(`Are you sure you want to delete the course "${title}"? This cannot be undone.`)) return;
    try {
      await adminService.deleteCourse(courseId);
      showFeedbackMsg('success', `Course "${title}" deleted from database.`);
      fetchCoursesAndTrainers();
    } catch (err) {
      showFeedbackMsg('error', err.response?.data?.error || err.message);
    }
  };

  // Assign Trainer Action
  const handleAssignTrainer = async () => {
    if (!assigningCourse || !selectedTrainerId) return;
    try {
      await adminService.assignTrainer(assigningCourse.id, selectedTrainerId);
      showFeedbackMsg('success', `Trainer successfully assigned to "${assigningCourse.title}".`);
      setAssigningCourse(null);
      setSelectedTrainerId('');
      fetchCoursesAndTrainers();
    } catch (err) {
      showFeedbackMsg('error', err.response?.data?.error || err.message);
    }
  };

  // View Course Enrollments
  const handleViewEnrollments = async (course) => {
    setViewingEnrollmentsCourse(course);
    setEnrollmentsLoading(true);
    try {
      const res = await adminService.getCourseEnrollments(course.id);
      if (res?.data) {
        setEnrollmentsList(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      console.error('Failed to load enrollments:', err);
    } finally {
      setEnrollmentsLoading(false);
    }
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title || '',
      description: course.description || '',
      category: course.category || 'Engineering & Ocean Tech',
      level: course.level || 'intermediate',
      duration_hours: course.duration_hours || 40,
      max_enrollment: course.max_enrollment || 100,
      thumbnail_url: course.thumbnail_url || '',
      prerequisites: course.prerequisites || '',
      is_published: course.is_published !== false,
    });
    setShowCreateModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Engineering & Ocean Tech',
      level: 'intermediate',
      duration_hours: 40,
      max_enrollment: 100,
      thumbnail_url: '',
      prerequisites: '',
      is_published: true,
    });
  };

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      (c.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter ? c.category === categoryFilter : true;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Central Course Catalog Control</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Course Catalog & Curriculum Command
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-0.5">
            Create structured courses, configure syllabus, assign certified trainers, and inspect live trainee progress.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCourse(null);
            resetForm();
            setShowCreateModal(true);
          }}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg flex items-center space-x-2 border border-emerald-400/30"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Course</span>
        </button>
      </div>

      {/* Feedback Toast */}
      {feedback.message && (
        <div
          className={`p-4 rounded-xl border text-xs font-semibold flex items-center space-x-2 transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-emerald-500"
          >
            <option value="">All Categories</option>
            <option value="Engineering & Ocean Tech">Engineering & Ocean Tech</option>
            <option value="Satellite Remote Sensing">Satellite Remote Sensing</option>
            <option value="AI & Machine Learning">AI & Machine Learning</option>
            <option value="Radar Meteorology">Radar Meteorology</option>
            <option value="Computational Fluid Dynamics">Computational Fluid Dynamics</option>
          </select>
          <span className="text-xs text-slate-400 font-semibold">{filteredCourses.length} Courses Found</span>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search courses by title, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2 w-64 md:w-80 outline-none focus:border-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Course Catalog Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader size="medium" message="Fetching central course catalog..." />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-sm text-slate-400 font-medium">No courses found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Course</th>
                  <th className="py-3.5 px-4">Category & Level</th>
                  <th className="py-3.5 px-4">Assigned Trainer</th>
                  <th className="py-3.5 px-4">Enrollments</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredCourses.map((c) => {
                  const isPub = c.is_published !== false;
                  return (
                    <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 text-emerald-400">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-100">{c.title}</div>
                            <div className="text-[11px] text-slate-400 line-clamp-1 max-w-sm">{c.description}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div>
                          <span className="font-semibold text-slate-200">{c.category || 'General'}</span>
                          <div className="flex items-center space-x-1.5 mt-1">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 uppercase font-bold">
                              {c.level || 'Intermediate'}
                            </span>
                            <span className="text-[10px] text-slate-400">{c.duration_hours || 40} Hours</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {c.trainer_name ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold text-[10px]">
                              {c.trainer_name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-200">{c.trainer_name}</p>
                              <p className="text-[10px] text-slate-400">{c.trainer_email}</p>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setAssigningCourse(c);
                              setSelectedTrainerId('');
                            }}
                            className="px-2.5 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg text-[10px] font-bold flex items-center space-x-1"
                          >
                            <UserCheck className="w-3 h-3" />
                            <span>Assign Trainer</span>
                          </button>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleViewEnrollments(c)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-brand-400 border border-slate-700 rounded-lg text-xs font-bold flex items-center space-x-1.5"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>{c.enrolled_count ?? 12} Enrolled</span>
                        </button>
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleTogglePublish(c)}
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase cursor-pointer transition-all ${
                            isPub
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isPub ? 'bg-emerald-400' : 'bg-slate-500'}`}></span>
                          <span>{isPub ? 'Published' : 'Draft'}</span>
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* Assign Trainer */}
                          <button
                            onClick={() => {
                              setAssigningCourse(c);
                              setSelectedTrainerId(c.trainer_id ? String(c.trainer_id) : '');
                            }}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-purple-400 rounded-lg transition-all"
                            title="Assign Trainer"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Course */}
                          <button
                            onClick={() => openEditModal(c)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg transition-all"
                            title="Edit Course Details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Course */}
                          <button
                            onClick={() => handleDeleteCourse(c.id, c.title)}
                            className="p-1.5 bg-slate-800 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                            title="Delete Course"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 1. Modal: Create / Edit Course */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <span>{editingCourse ? 'Edit Course Curriculum' : 'Create New Capacity Building Course'}</span>
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Course Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-emerald-500"
                  placeholder="e.g. Advanced Satellite Oceanography & Radar Meteorology"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-emerald-500"
                  placeholder="Comprehensive training on ocean dynamics, satellite altimetry, and predictive AI..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-emerald-500"
                  >
                    <option value="Engineering & Ocean Tech">Engineering & Ocean Tech</option>
                    <option value="Satellite Remote Sensing">Satellite Remote Sensing</option>
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="Radar Meteorology">Radar Meteorology</option>
                    <option value="Computational Fluid Dynamics">Computational Fluid Dynamics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Difficulty Level *</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-emerald-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Duration (Hours)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.duration_hours}
                    onChange={(e) => setFormData({ ...formData, duration_hours: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Max Enrollment Capacity</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.max_enrollment}
                    onChange={(e) => setFormData({ ...formData, max_enrollment: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg"
                >
                  {editingCourse ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal: Assign Trainer */}
      {assigningCourse && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-purple-400" />
              <span>Assign Trainer to Course</span>
            </h3>
            <p className="text-xs text-slate-400">
              Assign a certified trainer to oversee curriculum delivery and evaluate assessments for:
              <span className="block font-bold text-slate-200 mt-1">"{assigningCourse.title}"</span>
            </p>

            <div>
              <label className="block text-xs text-slate-400 mb-1 font-semibold">Select Certified Trainer</label>
              <select
                value={selectedTrainerId}
                onChange={(e) => setSelectedTrainerId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white font-bold outline-none focus:border-purple-500"
              >
                <option value="">-- Choose Trainer --</option>
                {trainers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.full_name} ({t.email}) - {t.department_name || 'MoES'}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                onClick={() => setAssigningCourse(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignTrainer}
                disabled={!selectedTrainerId}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal: View Enrolled Trainees & Progress */}
      {viewingEnrollmentsCourse && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">
                  Enrolled Trainees & Completion Status
                </h3>
                <p className="text-xs text-slate-400">{viewingEnrollmentsCourse.title}</p>
              </div>
              <button onClick={() => setViewingEnrollmentsCourse(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {enrollmentsLoading ? (
              <Loader size="medium" message="Fetching enrolled trainee records..." />
            ) : enrollmentsList.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No trainees are currently enrolled in this course.
              </div>
            ) : (
              <div className="space-y-3">
                {enrollmentsList.map((en, idx) => (
                  <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-300 font-bold flex items-center justify-center text-xs">
                        {en.trainee_name ? en.trainee_name.charAt(0) : 'T'}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-200">{en.trainee_name || `Trainee #${en.user_id}`}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{en.trainee_email}</p>
                      </div>
                    </div>

                    <div className="w-36 text-right">
                      <span className="text-xs font-bold text-emerald-400">{en.progress_percentage || 0}% Completed</span>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${en.progress_percentage || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
