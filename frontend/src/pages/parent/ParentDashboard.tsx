import React, { useState, useEffect } from 'react';
import { 
  CalendarCheck, TrendingUp, Target, Activity, 
  MessageSquare, Bell, AlertTriangle, UserCheck, CheckCircle2 
} from 'lucide-react';

const ParentDashboard = () => {
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    // Fetch student data using the token (parents login with student credentials for now)
    fetch('/api/auth/me', {
      headers: { 'x-auth-token': localStorage.getItem('token') || '' }
    })
      .then(res => res.json())
      .then(data => setStudent(data))
      .catch(err => console.error(err));
  }, []);

  if (!student) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500">Loading Parent Portal...</div>;

  return (
    <div className="space-y-6 animate-in fade-in max-w-7xl mx-auto p-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-lg flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black mb-2">Parent Portal</h2>
          <p className="text-blue-100 font-medium text-lg">Monitoring academic progress and holistic development for <span className="font-bold text-white">{student.fullName}</span></p>
        </div>
        <div className="hidden md:flex flex-col items-end">
          <p className="text-sm font-semibold text-blue-200 uppercase tracking-wider">Program</p>
          <p className="text-xl font-bold">{student.programInfo?.program}</p>
        </div>
      </div>

      {/* Child Information & Key Contacts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {/* Card 1: Child Profile Info (lg:col-span-2) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex flex-col md:flex-row md:items-center justify-between h-full gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-black text-2xl text-indigo-600">
                {student.fullName?.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Student Profile</p>
                <h3 className="text-xl font-bold text-slate-800">{student.fullName}</h3>
                <p className="text-xs text-slate-500 mt-0.5">ID: SSSI-{student._id?.substring(18) || '2026-042'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 flex-1 max-w-2xl border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-8">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Father's Name</p>
                <p className="text-sm font-bold text-slate-700 mt-0.5">Mr. K. R. Prasad</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact Number</p>
                <p className="text-sm font-bold text-slate-700 mt-0.5">{student.mobileNumber || '+91 98765 43210'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Class & Section</p>
                <p className="text-sm font-bold text-slate-700 mt-0.5">Class 12 - Section A1</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Program & Stream</p>
                <p className="text-sm font-bold text-slate-700 mt-0.5">
                  {student.programInfo?.program || 'IIT'} ({student.programInfo?.stream || 'MPC'})
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Key Academic Contacts (lg:col-span-1) */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-base font-semibold text-slate-700">Key Contacts</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">Reach out to the institution management for queries.</p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <div>
                  <p className="text-xs font-bold text-slate-700">Class Teacher</p>
                  <p className="text-xs text-slate-500 mt-0.5">Mrs. Priya Sharma</p>
                </div>
                <a href="tel:+919845012345" className="text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors">+91 98450 12345</a>
              </div>
              
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <div>
                  <p className="text-xs font-bold text-slate-700">Batch Incharge</p>
                  <p className="text-xs text-slate-500 mt-0.5">Mr. Suresh Babu</p>
                </div>
                <a href="tel:+919845067890" className="text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors">+91 98450 67890</a>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <div>
                  <p className="text-xs font-bold text-slate-700">Principal</p>
                  <p className="text-xs text-slate-500 mt-0.5">Dr. K. Anand Kumar</p>
                </div>
                <a href="tel:+919845054321" className="text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors">+91 98450 54321</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Attendance */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Attendance</h3>
          </div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-4xl font-black text-slate-800">92%</span>
            <span className="text-emerald-500 font-bold text-sm mb-1">+2% this month</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '92%' }}></div>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-3">3 classes missed this term</p>
        </div>

        {/* Performance */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Performance</h3>
          </div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-4xl font-black text-slate-800">88.5</span>
            <span className="text-slate-500 font-bold text-sm mb-1">Avg Score</span>
          </div>
          <p className="text-sm text-indigo-600 font-bold bg-indigo-50 inline-block px-3 py-1 rounded-lg mt-1">Top 15% in Class</p>
        </div>

        {/* Assignments */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Assignments</h3>
          </div>
          <div className="flex justify-between items-center mb-4">
            <div className="text-center">
              <span className="block text-2xl font-black text-emerald-600">24</span>
              <span className="text-xs font-bold text-slate-500 uppercase">Completed</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-black text-amber-600">2</span>
              <span className="text-xs font-bold text-slate-500 uppercase">Pending</span>
            </div>
          </div>
          <button className="w-full text-sm font-bold text-amber-700 bg-amber-50 py-2 rounded-lg hover:bg-amber-100 transition-colors">View Details</button>
        </div>

        {/* Behaviour Reports */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-rose-100 text-rose-600 rounded-xl">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Behaviour</h3>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span className="font-bold text-slate-700">Excellent Conduct</span>
          </div>
          <p className="text-sm text-slate-500 line-clamp-2 italic">"{student.fullName} has shown great leadership skills in group projects."</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teacher Remarks & Announcements */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-800 text-lg">Teacher Remarks</h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-slate-700">Dr. Sarah (Physics)</span>
                  <span className="text-xs font-bold text-slate-400">2 days ago</span>
                </div>
                <p className="text-sm text-slate-600">Needs to focus a bit more on numerical solving in Thermodynamics. Theory concepts are clear.</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-emerald-800">Mr. John (Mathematics)</span>
                  <span className="text-xs font-bold text-emerald-600">1 week ago</span>
                </div>
                <p className="text-sm text-emerald-700">Outstanding performance in the recent Calculus mock test. Keep it up!</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-800 text-lg">Recent Announcements</h3>
              </div>
            </div>
            <div className="p-0 divide-y divide-slate-100">
              <div className="p-4 hover:bg-slate-50 transition-colors flex gap-4 items-start">
                <div className="w-2 h-2 mt-2 rounded-full bg-amber-500 flex-shrink-0"></div>
                <div>
                  <h4 className="font-bold text-slate-700 text-sm">Parent-Teacher Meeting (PTM) Scheduled</h4>
                  <p className="text-xs text-slate-500 mt-1">The quarterly PTM is scheduled for next Saturday. Please book your slots via the portal.</p>
                </div>
              </div>
              <div className="p-4 hover:bg-slate-50 transition-colors flex gap-4 items-start">
                <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500 flex-shrink-0"></div>
                <div>
                  <h4 className="font-bold text-slate-700 text-sm">Fee Installment Reminder</h4>
                  <p className="text-xs text-slate-500 mt-1">Gentle reminder that the 2nd term fee installment is due on the 15th of this month.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Complaints Visibility */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden h-full">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-slate-800 text-lg">Complaints & Issues</h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">Track complaints raised by you or your ward.</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="border border-slate-200 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-bold text-slate-700">Hostel Wi-Fi Issue</span>
                  <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-bold">Resolved</span>
                </div>
                <p className="text-xs text-slate-500">Raised: 10th May</p>
              </div>
              
              <div className="border border-slate-200 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-bold text-slate-700">Request for extra doubt clearing session</span>
                  <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs font-bold">In Progress</span>
                </div>
                <p className="text-xs text-slate-500">Raised: 2 days ago</p>
              </div>

              <button className="w-full mt-4 flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">
                <MessageSquare className="w-4 h-4" /> Raise New Query
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
