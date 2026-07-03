import React, { useState } from 'react';
import {
  AlertCircle, CheckCircle2, Clock, Filter, Eye,
  MessageSquareWarning, ChevronRight, ShieldAlert,
} from 'lucide-react';

// ─── Mock Data ───────────────────────────────────────────────────────────────

type ComplaintStatus = 'Open' | 'Resolved' | 'Escalated';
type Priority = 'High' | 'Medium' | 'Low';

interface Complaint {
  id: string;
  studentName: string;
  category: string;
  description: string;
  priority: Priority;
  status: ComplaintStatus;
  filedDate: string;
}

const allComplaints: Complaint[] = [
  { id: 'CMP-001', studentName: 'Arjun Sharma',    category: 'Academic',        description: 'Exam results not updated in portal after revaluation request.',  priority: 'High',   status: 'Open',      filedDate: '2026-06-01' },
  { id: 'CMP-002', studentName: 'Priya Nair',       category: 'Infrastructure',  description: 'Water leakage in Girls Hostel Block B, Room 204.',               priority: 'High',   status: 'Escalated', filedDate: '2026-05-28' },
  { id: 'CMP-003', studentName: 'Rohit Verma',      category: 'Teacher',         description: 'Physics teacher frequently comes late to class.',                 priority: 'Medium', status: 'Resolved',  filedDate: '2026-05-20' },
  { id: 'CMP-004', studentName: 'Sneha Kulkarni',   category: 'Hostel',          description: 'Mess food quality has deteriorated significantly this month.',    priority: 'Medium', status: 'Open',      filedDate: '2026-06-03' },
  { id: 'CMP-005', studentName: 'Karan Mehta',      category: 'Academic',        description: 'Study material for NEET mock tests not provided as promised.',    priority: 'High',   status: 'Escalated', filedDate: '2026-05-30' },
  { id: 'CMP-006', studentName: 'Ananya Iyer',      category: 'Infrastructure',  description: 'Library air conditioning not working for over two weeks.',        priority: 'Low',    status: 'Resolved',  filedDate: '2026-05-15' },
  { id: 'CMP-007', studentName: 'Vikram Patel',     category: 'Other',           description: 'WiFi connectivity issues in academic block during peak hours.',   priority: 'Medium', status: 'Resolved',  filedDate: '2026-05-10' },
  { id: 'CMP-008', studentName: 'Divya Menon',      category: 'Teacher',         description: 'Chemistry teacher using outdated syllabus content for IIT.', priority: 'High',   status: 'Escalated', filedDate: '2026-06-05' },
  { id: 'CMP-009', studentName: 'Aditya Singh',     category: 'Hostel',          description: 'Room allocation changed without prior notice or consent.',        priority: 'Low',    status: 'Open',      filedDate: '2026-06-07' },
  { id: 'CMP-010', studentName: 'Meera Reddy',      category: 'Academic',        description: 'Mock test schedule conflicts with mandatory NEET sessions.',  priority: 'Medium', status: 'Resolved',  filedDate: '2026-05-22' },
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

const statusBadge = (status: ComplaintStatus) => {
  const map: Record<ComplaintStatus, string> = {
    Open:      'bg-amber-100 text-amber-700',
    Resolved:  'bg-emerald-100 text-emerald-700',
    Escalated: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${map[status]}`}>
      {status}
    </span>
  );
};

const priorityBadge = (priority: Priority) => {
  const map: Record<Priority, string> = {
    High:   'bg-red-50 text-red-600 border border-red-200',
    Medium: 'bg-amber-50 text-amber-600 border border-amber-200',
    Low:    'bg-slate-100 text-slate-500 border border-slate-200',
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded ${map[priority]}`}>
      {priority}
    </span>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const TABS: { label: string; value: ComplaintStatus | 'All' }[] = [
  { label: 'All', value: 'All' },
  { label: 'Open', value: 'Open' },
  { label: 'Resolved', value: 'Resolved' },
  { label: 'Escalated', value: 'Escalated' },
];

export default function AdminComplaints() {
  const [activeTab, setActiveTab] = useState<ComplaintStatus | 'All'>('All');

  const filtered = activeTab === 'All'
    ? allComplaints
    : allComplaints.filter((c) => c.status === activeTab);

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <MessageSquareWarning className="w-7 h-7 text-indigo-600" />
            Complaints Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track, manage, and resolve student complaints across all programs
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-600 shadow-sm cursor-pointer hover:bg-slate-50 transition">
          <Filter className="w-4 h-4" />
          Export Report
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Complaints"    value={156} icon={MessageSquareWarning} color="bg-indigo-500" subtext="Academic year 2025-26" />
        <StatCard label="Open"                value={23}  icon={Clock}               color="bg-amber-500"  subtext="Awaiting resolution" />
        <StatCard label="Resolved"            value={118} icon={CheckCircle2}        color="bg-emerald-500" subtext="Successfully closed" />
        <StatCard label="Escalated"           value={15}  icon={AlertCircle}         color="bg-red-500"    subtext="Needs urgent attention" />
      </div>

      {/* Policy & Descriptions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Card 1: SLA Policy */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                <Clock className="w-4 h-4" />
              </div>
              <h2 className="text-base font-semibold text-slate-700">Resolution SLA Policy</h2>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Standard operating procedures and response windows defined by priority level for redressal.
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-red-600">High Priority</span>
                  <span className="text-xs font-medium text-slate-400">Within 24 Hours</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Urgent academic discrepancies, safety issues, hostel water/power failures, or medical concerns.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-amber-600">Medium / Low Priority</span>
                  <span className="text-xs font-medium text-slate-400">Within 48-72 Hours</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Routine infrastructure requests, minor academic queries, schedule conflicts, or mess meal feedback.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Committee Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h2 className="text-base font-semibold text-slate-700">Grievance Committee</h2>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Assigned representatives responsible for investigating and closing filed grievances.
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs font-semibold text-slate-700">Academic & Faculty Issues</p>
                <p className="text-xs text-slate-500 mt-1">
                  Managed by Dr. Anand Kumar (Academic Dean). Focuses on exam portals, syllabus completion, and class scheduling conflicts.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs font-semibold text-slate-700">Facilities & Infrastructure</p>
                <p className="text-xs text-slate-500 mt-1">
                  Managed by Mr. Suresh Babu (Operations Head). Handles hostel room allocations, mess food quality, and library air conditioning.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Escalation Framework */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h2 className="text-base font-semibold text-slate-700">Escalation Path</h2>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Framework applied when standard SLA timelines are breached or resolutions are contested.
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs font-semibold text-slate-700">Level 1 Escalation</p>
                <p className="text-xs text-slate-500 mt-1">
                  Auto-triggered if a high priority ticket remains unresolved for 36 hours. Reassigned directly to department HOD.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs font-semibold text-slate-700">Level 2 Escalation</p>
                <p className="text-xs text-slate-500 mt-1">
                  Requires direct intervention by the Vice Principal. Reviewed during weekly administrative oversight meetings.
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
            <h2 className="text-base font-semibold text-slate-700">Recent Complaints</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Showing {filtered.length} of {allComplaints.length} complaints
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
                    ? 'bg-white text-indigo-600 shadow-sm'
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
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Complaint ID</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student Name</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Filed Date</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-indigo-600 font-semibold">{c.id}</td>
                  <td className="px-5 py-3.5 font-medium text-slate-800">{c.studentName}</td>
                  <td className="px-5 py-3.5 text-slate-600">{c.category}</td>
                  <td className="px-5 py-3.5 text-slate-500 max-w-[220px]">
                    <span title={c.description} className="line-clamp-1 block">
                      {c.description}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">{priorityBadge(c.priority)}</td>
                  <td className="px-5 py-3.5">{statusBadge(c.status)}</td>
                  <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{c.filedDate}</td>
                  <td className="px-5 py-3.5">
                    <button className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-medium text-xs bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-400 text-sm">
                    No complaints found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Last updated: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          <button className="flex items-center gap-1 text-indigo-600 hover:underline font-medium">
            View all complaints <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
