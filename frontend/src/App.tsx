import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import IITPage from './pages/IITPage';
import IITRegisterPage from './pages/IITRegisterPage';
import IITLoginPage from './pages/IITLoginPage';
import NEETPage from './pages/NEETPage';
import NEETRegisterPage from './pages/NEETRegisterPage';
import NEETLoginPage from './pages/NEETLoginPage';
import UPSCPage from './pages/UPSCPage';
import UPSCRegisterPage from './pages/UPSCRegisterPage';
import UPSCLoginPage from './pages/UPSCLoginPage';
import PlaceholderPage from './pages/PlaceholderPage';
import AuthSelector from './pages/AuthSelector';
import UniversalLogin from './pages/UniversalLogin';

// Dashboard Imports
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';

// Teacher Imports
import TeacherLayout from './layouts/TeacherLayout';
import HODLayout from './layouts/HODLayout';
import TeacherProtectedRoute from './components/TeacherProtectedRoute';
import TeacherLogin from './pages/teacher/TeacherLogin';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherStudentManagement from './pages/teacher/StudentManagement';
import TeacherResultAnalytics from './pages/teacher/ResultAnalytics';
import TeacherAnalytics from './pages/teacher/TeacherAnalytics';
import TeacherAssignments from './pages/teacher/Assignments';
import TeacherAssignmentGrading from './pages/teacher/AssignmentGrading';
import TeacherAttendance from './pages/teacher/TeacherAttendance';
import ComplaintBox from './pages/shared/ComplaintBox';
import AdminComplaints from './pages/admin/AdminComplaints';
import TeacherBehaviorFeedback from './pages/teacher/TeacherBehaviorFeedback';
import HODDashboard from './pages/teacher/HODDashboard';
import AdminBehaviorTracking from './pages/admin/AdminBehaviorTracking';
import Profile from './pages/dashboard/Profile';
import StudentAssignments from './pages/dashboard/StudentAssignments';
import AssignmentSubmission from './pages/dashboard/AssignmentSubmission';
import StudentAnalytics from './pages/dashboard/StudentAnalytics';
import AdminAnalytics from './pages/admin/AdminAnalytics';

import StudentIntelligence from './pages/dashboard/StudentIntelligence';
import TeacherIntelligence from './pages/teacher/TeacherIntelligence';
import AdminIntelligence from './pages/admin/AdminIntelligence';
import StudentLeaderboard from './pages/dashboard/StudentLeaderboard';
import TeacherLeaderboard from './pages/teacher/TeacherLeaderboard';
import AdminLeaderboard from './pages/admin/AdminLeaderboard';
import StudyMaterials from './pages/dashboard/StudyMaterials';
import Tests from './pages/dashboard/Tests';
import Results from './pages/dashboard/Results';
import Announcements from './pages/dashboard/Announcements';
import Attendance from './pages/dashboard/Attendance';
import Settings from './pages/dashboard/Settings';
import Messages from './pages/dashboard/Messages';
import TeacherFeedbackForm from './pages/dashboard/TeacherFeedbackForm';
import TeacherMessages from './pages/teacher/TeacherMessages';
import TeacherStudyMaterials from './pages/teacher/TeacherStudyMaterials';
import TeacherAnnouncements from './pages/teacher/TeacherAnnouncements';
import CompetitionAnalysis from './pages/dashboard/CompetitionAnalysis';

// Mock Test Imports
import TeacherMockTests from './pages/dashboard/TeacherMockTests';
import StudentMockTests from './pages/dashboard/StudentMockTests';
import TakeMockTest from './pages/dashboard/TakeMockTest';
import AdminMockTests from './pages/dashboard/AdminMockTests';

// Exam Imports
import ExamInterface from './pages/exam/ExamInterface';
import ResultAnalytics from './pages/exam/ResultAnalytics';
import FeePortal from './pages/dashboard/FeePortal';
import AIHub from './pages/dashboard/AIHub';
import FloatingAIAssistant from './components/FloatingAIAssistant';

// Admin Imports
import AdminLogin from './pages/admin/AdminLogin';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMessages from './pages/admin/AdminMessages';
import StudentManagement from './pages/admin/StudentManagement';
import TeacherManagement from './pages/admin/TeacherManagement';
import ProgramManagement from './pages/admin/ProgramManagement';
import StudyMaterialManagement from './pages/admin/StudyMaterialManagement';
import TestManagement from './pages/admin/TestManagement';
import QuestionBank from './pages/admin/QuestionBank';
import ResultManagement from './pages/admin/ResultManagement';
import AnnouncementManagement from './pages/admin/AnnouncementManagement';
import AttendanceManagement from './pages/admin/AttendanceManagement';
import CMSManagement from './pages/admin/CMSManagement';
import AdminTeacherAttendance from './pages/admin/AdminTeacherAttendance';
import AdminTeacherFeedback from './pages/admin/AdminTeacherFeedback';

// Admin ERP Imports
import AdmissionsManagement from './pages/admin/erp/AdmissionsManagement';
import FeeManagement from './pages/admin/erp/FeeManagement';
import PaymentManagement from './pages/admin/erp/PaymentManagement';
import FinancialAnalytics from './pages/admin/FinancialAnalytics';
import AIControls from './pages/admin/erp/AIControls';

// Parent Imports
import ParentLayout from './layouts/ParentLayout';
import ParentDashboard from './pages/parent/ParentDashboard';

function App() {
  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#333', color: '#fff' } }} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Generic Auth Selectors */}
        <Route path="/login" element={<UniversalLogin />} />
        <Route path="/register" element={<AuthSelector />} />

        {/* IIT Program Routes */}
        <Route path="/iit" element={<IITPage />} />
        <Route path="/iit/register" element={<IITRegisterPage />} />
        <Route path="/iit/login" element={<IITLoginPage />} />
        
        {/* NEET Program Routes */}
        <Route path="/neet" element={<NEETPage />} />
        <Route path="/neet/register" element={<NEETRegisterPage />} />
        <Route path="/neet/login" element={<NEETLoginPage />} />
        
        {/* UPSC Program Routes */}
        <Route path="/upsc" element={<UPSCPage />} />
        <Route path="/upsc/register" element={<UPSCRegisterPage />} />
        <Route path="/upsc/login" element={<UPSCLoginPage />} />
        
        {/* Other Programs */}
        <Route path="/upsc-placeholder" element={<PlaceholderPage title="UPSC" />} />
        
        {/* Teacher Routes */}
        <Route path="/teacher/login" element={<TeacherLogin />} />
        <Route 
          path="/teacher" 
          element={
            <TeacherProtectedRoute allowedRoles={['Teacher', 'Admin', 'SuperAdmin']}>
              <TeacherLayout />
            </TeacherProtectedRoute>
          }
        >
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="assignments" element={<TeacherAssignments />} />
          <Route path="assignments/:id" element={<TeacherAssignmentGrading />} />
          <Route path="students" element={<TeacherStudentManagement />} />
          <Route path="attendance" element={<TeacherAttendance />} />
          <Route path="analytics" element={<TeacherAnalytics />} />
          <Route path="intelligence" element={<TeacherIntelligence />} />
          <Route path="leaderboard" element={<TeacherLeaderboard />} />
          {/* Placeholders for others */}
          <Route path="tests" element={<div className="p-8 font-bold">Test Manager Coming Soon</div>} />
          <Route path="mocktests" element={<TeacherMockTests />} />
          <Route path="materials" element={<TeacherStudyMaterials />} />
          <Route path="announcements" element={<TeacherAnnouncements />} />
          <Route path="messages" element={<TeacherMessages />} />
          <Route path="complaints" element={<ComplaintBox />} />
          <Route path="behavior" element={<TeacherBehaviorFeedback />} />
          <Route path="teacher-feedback" element={<AdminTeacherFeedback />} />
        </Route>

        {/* HOD Routes */}
        <Route 
          path="/hod" 
          element={
            <TeacherProtectedRoute allowedRoles={['HOD']}>
              <HODLayout />
            </TeacherProtectedRoute>
          }
        >
          <Route path="dashboard" element={<HODDashboard />} />
          <Route path="assignments" element={<TeacherAssignments />} />
          <Route path="assignments/:id" element={<TeacherAssignmentGrading />} />
          <Route path="students" element={<TeacherStudentManagement />} />
          <Route path="attendance" element={<TeacherAttendance />} />
          <Route path="analytics" element={<TeacherAnalytics />} />
          <Route path="intelligence" element={<TeacherIntelligence />} />
          <Route path="leaderboard" element={<TeacherLeaderboard />} />
          <Route path="mocktests" element={<TeacherMockTests />} />
          <Route path="materials" element={<TeacherStudyMaterials />} />
          <Route path="announcements" element={<TeacherAnnouncements />} />
          <Route path="messages" element={<TeacherMessages />} />
          <Route path="complaints" element={<ComplaintBox />} />
          <Route path="behavior" element={<TeacherBehaviorFeedback />} />
          <Route path="teacher-feedback" element={<AdminTeacherFeedback />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="admissions" element={<AdmissionsManagement />} />
          <Route path="fees" element={<FeeManagement />} />
          <Route path="payments" element={<PaymentManagement />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="intelligence" element={<AdminIntelligence />} />
          <Route path="leaderboard" element={<AdminLeaderboard />} />
          <Route path="reports" element={<FinancialAnalytics />} />
          <Route path="ai-controls" element={<AIControls />} />
          <Route path="students" element={<StudentManagement />} />
          <Route path="teachers" element={<TeacherManagement />} />
          <Route path="programs" element={<ProgramManagement />} />
          <Route path="materials" element={<StudyMaterialManagement />} />
          <Route path="tests" element={<TestManagement />} />
          <Route path="mocktests" element={<AdminMockTests />} />
          <Route path="questions" element={<QuestionBank />} />
          <Route path="results" element={<ResultManagement />} />
          <Route path="announcements" element={<AnnouncementManagement />} />
          <Route path="attendance" element={<AttendanceManagement />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="teacher-attendance" element={<AdminTeacherAttendance />} />
          <Route path="teacher-feedback" element={<AdminTeacherFeedback />} />
          <Route path="cms" element={<CMSManagement />} />
          <Route path="complaints" element={<AdminComplaints />} />
          <Route path="behavior" element={<AdminBehaviorTracking />} />
        </Route>
        
        {/* Exam Taking Routes (Standalone layout) */}
        <Route path="/exam/:testId" element={
          <ProtectedRoute>
            <ExamInterface />
          </ProtectedRoute>
        } />
        
        {/* Unified Dashboard Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
              <FloatingAIAssistant />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="ai-hub" element={<AIHub />} />
          <Route path="profile" element={<Profile />} />
          <Route path="assignments" element={<StudentAssignments />} />
          <Route path="assignments/:id" element={<AssignmentSubmission />} />
          <Route path="materials" element={<StudyMaterials />} />
          <Route path="mocktests" element={<StudentMockTests />} />
          <Route path="mocktests/:id/take" element={<TakeMockTest />} />
          <Route path="tests" element={<Tests />} />
          <Route path="analytics" element={<StudentAnalytics />} />
          <Route path="intelligence" element={<StudentIntelligence />} />
          <Route path="competition-analysis" element={<CompetitionAnalysis />} />
          <Route path="leaderboard" element={<StudentLeaderboard />} />
          <Route path="fees" element={<FeePortal />} />
          <Route path="results" element={<Results />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="teacher-feedback" element={<TeacherFeedbackForm />} />
          <Route path="settings" element={<Settings />} />
          <Route path="messages" element={<Messages />} />
          <Route path="complaints" element={<ComplaintBox />} />
        </Route>

        {/* Legacy redirect routes for the individual login success pages to point to unified dashboard */}
        <Route path="/iit/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>} />
        <Route path="/neet/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>} />
        <Route path="/upsc/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>} />

        {/* Parent Routes */}
        <Route path="/parent" element={<ProtectedRoute><ParentLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<ParentDashboard />} />
        </Route>

        {/* Catch-all for any other routes */}
        <Route path="*" element={<PlaceholderPage title="Page Not Found" />} />
      </Routes>
    </Router>
  );
}

export default App;
