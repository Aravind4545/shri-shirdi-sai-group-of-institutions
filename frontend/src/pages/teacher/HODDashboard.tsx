import { useState, useEffect } from 'react';
import { 
  Users, BarChart3, TrendingUp, Target, Activity, 
  Award, BookOpen, CheckCircle2, ChevronRight 
} from 'lucide-react';

const HODDashboard = () => {
  // Placeholder data for HOD Dashboard metrics
  const departmentStats = {
    healthScore: 92,
    totalFaculty: 14,
    totalStudents: 450,
    averageAttendance: 88,
    outcomeAchieved: 76
  };

  const facultyComparison = [
    { id: 1, name: 'Dr. Sharma', subject: 'Physics', performanceScore: 95, studentRating: 4.8 },
    { id: 2, name: 'Prof. Reddy', subject: 'Mathematics', performanceScore: 89, studentRating: 4.5 },
    { id: 3, name: 'Dr. Verma', subject: 'Chemistry', performanceScore: 92, studentRating: 4.7 },
    { id: 4, name: 'Mrs. Gupta', subject: 'Biology', performanceScore: 85, studentRating: 4.3 },
  ];

  const subjectPerformance = [
    { subject: 'Physics', averageMarks: 78, passPercentage: 92 },
    { subject: 'Mathematics', averageMarks: 72, passPercentage: 88 },
    { subject: 'Chemistry', averageMarks: 81, passPercentage: 95 },
    { subject: 'Biology', averageMarks: 85, passPercentage: 97 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">HOD Dashboard</h1>
          <p className="text-slate-500 font-medium mt-1">
            Department analytics, faculty comparison, and outcome tracking.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-200">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
            <Activity className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase">Dept Health Score</p>
            <p className="text-2xl font-black text-slate-800">{departmentStats.healthScore}/100</p>
          </div>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+2 this term</span>
          </div>
          <h3 className="text-slate-500 font-bold text-sm">Total Faculty</h3>
          <p className="text-3xl font-black text-slate-800 mt-1">{departmentStats.totalFaculty}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+120 students</span>
          </div>
          <h3 className="text-slate-500 font-bold text-sm">Department Strength</h3>
          <p className="text-3xl font-black text-slate-800 mt-1">{departmentStats.totalStudents}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Steady</span>
          </div>
          <h3 className="text-slate-500 font-bold text-sm">Avg. Attendance</h3>
          <p className="text-3xl font-black text-slate-800 mt-1">{departmentStats.averageAttendance}%</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+5% YoY</span>
          </div>
          <h3 className="text-slate-500 font-bold text-sm">Outcomes Achieved</h3>
          <p className="text-3xl font-black text-slate-800 mt-1">{departmentStats.outcomeAchieved}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Faculty Comparison */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-500" /> Faculty Comparison
            </h2>
            <button className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-5">
            {facultyComparison.map((faculty) => (
              <div key={faculty.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                    {faculty.name.charAt(4)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{faculty.name}</h3>
                    <p className="text-xs font-medium text-slate-500">{faculty.subject}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-sm font-bold text-slate-700">Score: {faculty.performanceScore}</span>
                    <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${faculty.performanceScore}%` }} />
                    </div>
                  </div>
                  <p className="text-xs font-medium text-slate-500 mt-1">Rating: {faculty.studentRating} / 5.0</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Performance */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" /> Subject Performance
            </h2>
          </div>
          <div className="space-y-6">
            {subjectPerformance.map((sub, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-slate-700">{sub.subject}</span>
                  <span className="font-bold text-emerald-600">{sub.passPercentage}% Pass Rate</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 mb-1">
                  <div 
                    className={`h-3 rounded-full ${sub.passPercentage > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                    style={{ width: `${sub.passPercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs font-medium text-slate-500 text-right">Avg Score: {sub.averageMarks}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Outcome Tracking & Department Analytics */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-blue-500" /> Outcome Tracking & Analytics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
            <h3 className="font-bold text-slate-700 mb-2">Curriculum Coverage</h3>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-slate-800">85%</span>
              <span className="text-sm font-bold text-emerald-600 mb-1">On Track</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">Across all department subjects.</p>
          </div>
          
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
            <h3 className="font-bold text-slate-700 mb-2">Student Satisfaction</h3>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-slate-800">4.6<span className="text-lg text-slate-500">/5</span></span>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">Based on end-of-term surveys.</p>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
            <h3 className="font-bold text-slate-700 mb-2">Research Publications</h3>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-slate-800">12</span>
              <span className="text-sm font-bold text-emerald-600 mb-1">Published</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">By department faculty this year.</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default HODDashboard;
