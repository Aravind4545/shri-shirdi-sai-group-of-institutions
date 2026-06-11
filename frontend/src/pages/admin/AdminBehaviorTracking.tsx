import React, { useState } from 'react';
import {
  Users, ThumbsUp, AlertTriangle, Gavel, Filter, ChevronRight,
  Activity, Star,
} from 'lucide-react';

// ─── Mock Data ───────────────────────────────────────────────────────────────

type BehaviorType = 'Positive' | 'Concern' | 'Disciplinary';
type BehaviorStatus = 'Resolved' | 'Pending' | 'Under Review';

interface BehaviorRecord {
  id: string;
  studentName: string;
  class: string;
  program: string;
  type: BehaviorType;
  category: string;
  reportedBy: string;
  date: string;
  status: BehaviorStatus;
}

const allRecords: BehaviorRecord[] = [
  { id: 'BHV-001', studentName: 'Rahul Gupta',      class: 'Class 12', program: 'Lakshya',  type: 'Positive',     category: 'Academic Excellence',   reportedBy: 'Dr. Anand Kumar',   date: '2026-06-08', status: 'Resolved' },
  { id: 'BHV-002', studentName: 'Simran Kaur',       class: 'Class 11', program: 'Deekshya', type: 'Disciplinary', category: 'Unauthorised Absence',   reportedBy: 'Ms. Priya Sharma',  date: '2026-06-07', status: 'Under Review' },
  { id: 'BHV-003', studentName: 'Nikhil Joshi',      class: 'Class 10', program: 'Lakshya',  type: 'Concern',      category: 'Declining Performance',  reportedBy: 'Mr. Ravi Tiwari',   date: '2026-06-06', status: 'Pending' },
  { id: 'BHV-004', studentName: 'Pooja Agarwal',     class: 'Class 12', program: 'DAFNE',    type: 'Positive',     category: 'Leadership Award',       reportedBy: 'Dr. Sunita Rao',    date: '2026-06-05', status: 'Resolved' },
  { id: 'BHV-005', studentName: 'Siddharth Mishra',  class: 'Class 9',  program: 'Deekshya', type: 'Disciplinary', category: 'Mobile Phone Violation',  reportedBy: 'Mr. Alok Verma',    date: '2026-06-04', status: 'Resolved' },
  { id: 'BHV-006', studentName: 'Kavya Pillai',      class: 'Class 11', program: 'Lakshya',  type: 'Concern',      category: 'Peer Conflict',          reportedBy: 'Ms. Deepa Nair',    date: '2026-06-03', status: 'Under Review' },
  { id: 'BHV-007', studentName: 'Arnav Kapoor',      class: 'Class 8',  program: 'Deekshya', type: 'Positive',     category: 'Best Attendance Award',  reportedBy: 'Mr. Suresh Babu',   date: '2026-06-02', status: 'Resolved' },
  { id: 'BHV-008', studentName: 'Tanvi Desai',       class: 'Class 10', program: 'DAFNE',    type: 'Disciplinary', category: 'Academic Misconduct',    reportedBy: 'Dr. Meera Singh',   date: '2026-06-01', status: 'Under Review' },
  { id: 'BHV-009', studentName: 'Harsh Pandey',      class: 'Class 9',  program: 'Lakshya',  type: 'Concern',      category: 'Mental Health Flag',     reportedBy: 'Counsellor Ritu',   date: '2026-05-30', status: 'Pending' },
  { id: 'BHV-010', studentName: 'Ishita Bhatt',      class: 'Class 12', program: 'Deekshya', type: 'Positive',     category: 'Helping Peers',          reportedBy: 'Mr. Anil Joshi',    date: '2026-05-29', status: 'Resolved' },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

const StatCard = ({
  label, value, icon: Icon, color, subtext,
}: {
  label: string; value: string | number; icon: React.ElementType; color: string; subtext?: string;
}) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
      {subtext && <p className="text-xs text-slate-400 mt-0.5">{subtext}</p>}
    </div>
  </div>
);

const typeBadge = (type: BehaviorType) => {
  const map: Record<BehaviorType, { cls: string; icon: React.ElementType }> = {
    Positive:     { cls: 'bg-emerald-100 text-emerald-700', icon: Star },
    Concern:      { cls: 'bg-amber-100 text-amber-700',     icon: AlertTriangle },
    Disciplinary: { cls: 'bg-red-100 text-red-700',         icon: Gavel },
  };
  const { cls, icon: Icon } = map[type];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${cls}`}>
      <Icon className="w-3 h-3" />
      {type}
    </span>
  );
};

const statusBadge = (status: BehaviorStatus) => {
  const map: Record<BehaviorStatus, string> = {
    Resolved:      'bg-emerald-50 text-emerald-600 border border-emerald-200',
    Pending:       'bg-amber-50 text-amber-600 border border-amber-200',
    'Under Review':'bg-blue-50 text-blue-600 border border-blue-200',
  };
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${map[status]}`}>
      {status}
    </span>
  );
};

const programBadge = (program: string) => {
  const map: Record<string, string> = {
    Lakshya:  'bg-violet-50 text-violet-600',
    Deekshya: 'bg-teal-50 text-teal-600',
    DAFNE:    'bg-orange-50 text-orange-600',
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded ${map[program] ?? 'bg-slate-100 text-slate-500'}`}>
      {program}
    </span>
  );
};

const TABS: { label: string; value: BehaviorType | 'All' }[] = [
  { label: 'All',          value: 'All' },
  { label: 'Positive',     value: 'Positive' },
  { label: 'Concerns',     value: 'Concern' },
  { label: 'Disciplinary', value: 'Disciplinary' },
];

export default function AdminBehaviorTracking() {
  const [activeTab, setActiveTab] = useState<BehaviorType | 'All'>('All');

  const filtered = activeTab === 'All'
    ? allRecords
    : allRecords.filter((r) => r.type === activeTab);

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Activity className="w-7 h-7 text-violet-600" />
            Behaviour Tracking
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor student behaviour across Lakshya, Deekshya & DAFNE programs
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-600 shadow-sm cursor-pointer hover:bg-slate-50 transition">
          <Filter className="w-4 h-4" />
          Export Report
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Students Monitored"  value="1,284" icon={Users}         color="bg-violet-500" subtext="Active this semester" />
        <StatCard label="Positive Reports"    value={892}   icon={ThumbsUp}      color="bg-emerald-500" subtext="Awards & recognitions" />
        <StatCard label="Concerns Flagged"    value={89}    icon={AlertTriangle} color="bg-amber-500"  subtext="Requires counselling" />
        <StatCard label="Disciplinary Actions" value={23}   icon={Gavel}         color="bg-red-500"    subtext="Formal action taken" />
      </div>

      {/* Policy & Descriptions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Card 1: Behavior Policy */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600">
                <Star className="w-4 h-4" />
              </div>
              <h2 className="text-base font-semibold text-slate-700">Code of Conduct Policy</h2>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Standard framework for student evaluation, positive reinforcement, and disciplinary compliance.
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs font-semibold text-slate-700">Positive Awards</p>
                <p className="text-xs text-slate-500 mt-1">
                  Granted for academic excellence, helping peers, leadership roles, and maintaining perfect attendance. Reflected directly in students' profiles.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs font-semibold text-slate-700">Behavioral Flagging</p>
                <p className="text-xs text-slate-500 mt-1">
                  Identifies declining performance, peer conflicts, or mental health concerns. Aimed at prompt support and early counseling interventions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Student Counselling Protocol */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                <ThumbsUp className="w-4 h-4" />
              </div>
              <h2 className="text-base font-semibold text-slate-700">Counselling & Intervention</h2>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Systematic support pathway designed to assist students flagged with behavioral or academic concerns.
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs font-semibold text-slate-700">Level 1: Mentor Review</p>
                <p className="text-xs text-slate-500 mt-1">
                  Class teacher initiates a private discussion with the student to address immediate academic or peer conflicts.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs font-semibold text-slate-700">Level 2: Professional Guidance</p>
                <p className="text-xs text-slate-500 mt-1">
                  Formal referral to the institutional counselor. Scheduled therapy sessions and behavioral tracking over a 4-week period.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Disciplinary Action Workflow */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                <Gavel className="w-4 h-4" />
              </div>
              <h2 className="text-base font-semibold text-slate-700">Disciplinary Workflow</h2>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Protocol followed when severe misconduct (e.g. mobile violations, misconduct during exams) is reported.
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs font-semibold text-slate-700">Investigation & Parent Meet</p>
                <p className="text-xs text-slate-500 mt-1">
                  Incident report is validated by the HOD. Parents are notified and requested to join a formal review meeting.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs font-semibold text-slate-700">Resolution & Probation</p>
                <p className="text-xs text-slate-500 mt-1">
                  Appropriate corrective actions taken. Student remains under supervision until the case is marked as Resolved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

        {/* Table Header */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-700">Recent Behaviour Records</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Showing {filtered.length} of {allRecords.length} records
            </p>
          </div>
          {/* Tabs */}
          <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.value
                    ? 'bg-white text-violet-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student Name</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Class</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Program</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Reported By</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-800">{r.studentName}</td>
                  <td className="px-5 py-3.5 text-slate-600">{r.class}</td>
                  <td className="px-5 py-3.5">{programBadge(r.program)}</td>
                  <td className="px-5 py-3.5">{typeBadge(r.type)}</td>
                  <td className="px-5 py-3.5 text-slate-500">{r.category}</td>
                  <td className="px-5 py-3.5 text-slate-500">{r.reportedBy}</td>
                  <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{r.date}</td>
                  <td className="px-5 py-3.5">{statusBadge(r.status)}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-400 text-sm">
                    No records found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Last updated: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          <button className="flex items-center gap-1 text-violet-600 hover:underline font-medium">
            View all records <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
