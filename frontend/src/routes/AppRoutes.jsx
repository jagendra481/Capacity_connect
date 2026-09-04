import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ProtectedRoute from '../components/common/ProtectedRoute';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';
import Loader from '../components/common/Loader';

// Public Home Landing Page
import Home from '../pages/Home';

// Auth Pages
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import VerifyEmail from '../pages/auth/VerifyEmail';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

// Trainee Pages
import TraineeDashboard from '../pages/trainee/TraineeDashboard';
import Profile from '../pages/trainee/Profile';
import EditProfile from '../pages/trainee/EditProfile';
import MyCourses from '../pages/trainee/MyCourses';
import MyAssessments from '../pages/trainee/MyAssessments';
import MySkills from '../pages/trainee/MySkills';
import MyRecommendations from '../pages/trainee/MyRecommendations';
import MyAchievements from '../pages/trainee/MyAchievements';

// Course Pages
import CourseList from '../pages/courses/CourseList';
import CourseDetails from '../pages/courses/CourseDetails';
import LessonPlayer from '../pages/courses/LessonPlayer';

// Assessment Pages
import Quiz from '../pages/assessments/Quiz';
import QuizResult from '../pages/assessments/QuizResult';
import AssessmentHistory from '../pages/assessments/AssessmentHistory';

// Skill & Competency Pages
import SkillGapAnalysis from '../pages/skills/SkillGapAnalysis';
import CompetencyMatrix from '../pages/competency/CompetencyMatrix';

// Capacity Radar Pages (USP)
import CapacityRadarPage from '../pages/capacity/CapacityRadarPage';
import CapacityReport from '../pages/capacity/CapacityReport';

// Recommendation Pages
import Recommendations from '../pages/recommendations/Recommendations';
import LearningPathPage from '../pages/recommendations/LearningPath';

// AI Pages
import AILearningAssistant from '../pages/ai/AILearningAssistant';

// Gamification Pages
import Achievements from '../pages/gamification/Achievements';
import Leaderboard from '../pages/gamification/Leaderboard';

// Knowledge Hub Pages
import KnowledgeHub from '../pages/knowledge/KnowledgeHub';
import CreatePost from '../pages/knowledge/CreatePost';
import PostDetails from '../pages/knowledge/PostDetails';

// Trainer Pages
import TrainerDashboard from '../pages/trainer/TrainerDashboard';
import TrainerTraineesPage from '../pages/trainer/TrainerTrainees';
import TrainerCoursesPage from '../pages/trainer/TrainerCourses';

// Calendar Pages
import TrainingCalendar from '../pages/calendar/TrainingCalendar';

// Certificate Pages
import Certificates from '../pages/certificates/Certificates';
import CertificateVerify from '../pages/certificates/CertificateVerify';
import CertificateVerification from '../pages/certificates/CertificateVerification';

// Notification Pages
import Notifications from '../pages/notifications/Notifications';
import NotificationSettings from '../pages/notifications/NotificationSettings';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import UserManagementPage from '../pages/admin/UserManagement';
import DepartmentManagementPage from '../pages/admin/DepartmentManagement';
import AnalyticsPage from '../pages/admin/Analytics';
import CertificateManagement from '../pages/admin/CertificateManagement';

// Shell Layout Wrapper
const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader size="large" message="Loading Capacity Connect platform..." />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Auth & Verification Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-certificate" element={<CertificateVerification />} />
      <Route path="/certificates/verify/:hash" element={<CertificateVerify />} />
      <Route path="/certificates/verify" element={<CertificateVerification />} />

      {/* Trainee Protected Routes */}
      <Route
        path="/trainee/dashboard"
        element={
          <ProtectedRoute allowedRoles={['trainee', 'trainer', 'administrator']}>
            <AppLayout>
              <TraineeDashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/trainee/courses"
        element={
          <ProtectedRoute>
            <AppLayout>
              <MyCourses />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/trainee/skills"
        element={
          <ProtectedRoute>
            <AppLayout>
              <MySkills />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/trainee/assessments"
        element={
          <ProtectedRoute>
            <AppLayout>
              <MyAssessments />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/trainee/assessments/history"
        element={
          <ProtectedRoute>
            <AppLayout>
              <AssessmentHistory />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/trainee/recommendations"
        element={
          <ProtectedRoute>
            <AppLayout>
              <MyRecommendations />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/trainee/achievements"
        element={
          <ProtectedRoute>
            <AppLayout>
              <MyAchievements />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/capacity/radar"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CapacityRadarPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/capacity/report"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CapacityReport />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Notifications />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications/settings"
        element={
          <ProtectedRoute>
            <AppLayout>
              <NotificationSettings />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/certificates"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Certificates />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/trainee/certificates"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Certificates />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <AppLayout>
              <TrainingCalendar />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/knowledge"
        element={
          <ProtectedRoute>
            <AppLayout>
              <KnowledgeHub />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/knowledge/create"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CreatePost />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/knowledge/posts/:id"
        element={
          <ProtectedRoute>
            <AppLayout>
              <PostDetails />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/gamification/achievements"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Achievements />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/gamification/leaderboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Leaderboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/recommendations"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Recommendations />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/recommendations/paths"
        element={
          <ProtectedRoute>
            <AppLayout>
              <LearningPathPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai/assistant"
        element={
          <ProtectedRoute>
            <AppLayout>
              <AILearningAssistant />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/skills/gap"
        element={
          <ProtectedRoute>
            <AppLayout>
              <SkillGapAnalysis />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/competency/matrix"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CompetencyMatrix />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CourseList />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:id"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CourseDetails />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:id/lessons/:lessonId"
        element={
          <ProtectedRoute>
            <AppLayout>
              <LessonPlayer />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/assessments/:id"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Quiz />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/assessments/:id/results"
        element={
          <ProtectedRoute>
            <AppLayout>
              <QuizResult />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/trainee/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Profile />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/trainee/profile/edit"
        element={
          <ProtectedRoute>
            <AppLayout>
              <EditProfile />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Trainer Protected Routes */}
      <Route
        path="/trainer/dashboard"
        element={
          <ProtectedRoute allowedRoles={['trainer', 'administrator']}>
            <AppLayout>
              <TrainerDashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/trainer/trainees"
        element={
          <ProtectedRoute allowedRoles={['trainer', 'administrator']}>
            <AppLayout>
              <TrainerTraineesPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/trainer/courses"
        element={
          <ProtectedRoute allowedRoles={['trainer', 'administrator']}>
            <AppLayout>
              <TrainerCoursesPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin Protected Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['administrator']}>
            <AppLayout>
              <AdminDashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['administrator']}>
            <AppLayout>
              <UserManagementPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/departments"
        element={
          <ProtectedRoute allowedRoles={['administrator']}>
            <AppLayout>
              <DepartmentManagementPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute allowedRoles={['administrator']}>
            <AppLayout>
              <AnalyticsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/capacity-radar"
        element={
          <ProtectedRoute allowedRoles={['administrator']}>
            <AppLayout>
              <CapacityRadarPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/certificates"
        element={
          <ProtectedRoute allowedRoles={['administrator']}>
            <AppLayout>
              <CertificateManagement />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Public Landing Page Route */}
      <Route path="/" element={<Home />} />

      {/* Fallback Catch-all */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-6 text-center">
            <h1 className="text-4xl font-extrabold text-slate-100 mb-2">404</h1>
            <p className="text-slate-400 mb-6">Page not found</p>
            <a
              href="/"
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl text-sm"
            >
              Back to Home
            </a>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
