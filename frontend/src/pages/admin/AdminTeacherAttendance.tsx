import React, { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  UserCheck,
  UserX,
  CalendarDays,
  Clock,
  ChevronDown,
  Download,
  Filter,
  TrendingUp,
  TrendingDown,
  BookOpen,
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const departmentData = [
  { dept: "Physics",   attendance: 95 },
  { dept: "Chemistry", attendance: 98 },
  { dept: "Math",      attendance: 96 },
  { dept: "Biology",   attendance: 94 },
  { dept: "English",   attendance: 99 },
];

const monthlyTrend = [
  { month: "Jan", attendance: 97 },
  { month: "Feb", attendance: 96 },
  { month: "Mar", attendance: 94 },
  { month: "Apr", attendance: 97 },
  { month: "May", attendance: 96 },
  { month: "Jun", attendance: 98 },
];

const pieData = [
  { name: "Present", value: 93 },
  { name: "On Leave", value: 5  },
  { name: "Absent",  value: 2  },
];

const PIE_COLORS = ["#10b981", "#f59e0b", "#ef4444"];

type TeacherStatus = "Present" | "Absent" | "On Leave";

interface Teacher {
  id: number;
  name: string;
  department: string;
  subject: string;
  checkIn: string;
  status: TeacherStatus;
  leaveType?: string;
}

const teachers: Teacher[] = [
  { id: 1,  name: "Dr. Ramesh Iyer",     department: "Physics",   subject: "Mechanics",        checkIn: "08:45 AM", status: "Present"  },
  { id: 2,  name: "Prof. Anita Sharma",  department: "Chemistry", subject: "Organic Chem",     checkIn: "08:50 AM", status: "Present"  },
  { id: 3,  name: "Mr. Sunil Gupta",     department: "Math",      subject: "Calculus",         checkIn: "09:02 AM", status: "Present"  },
  { id: 4,  name: "Dr. Kavya Menon",     department: "Biology",   subject: "Genetics",         checkIn: "—",        status: "On Leave", leaveType: "Medical" },
  { id: 5,  name: "Ms. Preethi Rao",     department: "English",   subject: "Literature",       checkIn: "08:38 AM", status: "Present"  },
  { id: 6,  name: "Mr. Arun Nair",       department: "Physics",   subject: "Electrostatics",   checkIn: "—",        status: "Absent"   },
  { id: 7,  name: "Dr. Meena Pillai",    department: "Chemistry", subject: "Inorganic Chem",   checkIn: "08:55 AM", status: "Present"  },
  { id: 8,  name: "Prof. Vinod Kumar",   department: "Math",      subject: "Algebra",          checkIn: "—",        status: "On Leave", leaveType: "Casual" },
  { id: 9,  name: "Ms. Deepa Krishnan",  department: "Biology",   subject: "Physiology",       checkIn: "09:05 AM", status: "Present"  },
  { id: 10, name: "Mr. Harish Verma",    department: "English",   subject: "Grammar & Writing", checkIn: "08:42 AM", status: "Present"  },
];

const departments = ["All Departments", "Physics", "Chemistry", "Math", "Biology", "English"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusConfig: Record<TeacherStatus, { bg: string; text: string; dot: string }> = {
  Present:   { bg: "bg-emerald-50 border-emerald-100", text: "text-emerald-700", dot: "bg-emerald-400" },
  Absent:    { bg: "bg-red-50 border-red-100",         text: "text-red-600",     dot: "bg-red-400"     },
  "On Leave":{ bg: "bg-amber-50 border-amber-100",     text: "text-amber-700",   dot: "bg-amber-400"   },
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  iconBg: string;
  trend?: "up" | "down";
  trendValue?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title, value, sub, icon, iconBg, trend, trendValue,
}) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-start gap-4">
    <div className={`p-3 rounded-xl ${iconBg}`}>{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{title}</p>
      <p className="text-2xl font-bold text-slate-800 mt-0.5">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      {trend && trendValue && (
        <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${trend === "up" ? "text-emerald-500" : "text-red-500"}`}>
          {trend === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {trendValue} vs last month
        </div>
      )}
    </div>
  </div>
);

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-2">
        <p className="text-xs font-semibold text-slate-600">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-sm font-bold" style={{ color: p.color }}>
            {p.name}: {p.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Main Component ───────────────────────────────────────────────────────────

const AdminTeacherAttendance: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState("2026-06-10");
  const [selectedDept, setSelectedDept] = useState("All Departments");

  const filtered = selectedDept === "All Departments"
    ? teachers
    : teachers.filter((t) => t.department === selectedDept);

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Teacher Attendance</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track and manage faculty attendance across all departments</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition self-start sm:self-auto">
          <Download size={15} />
          Export Report
        </button>
      </div>

      {/* ── Filters ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <Filter size={16} className="text-slate-400" />
        <span className="text-sm font-medium text-slate-600">Filters:</span>

        <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-1.5 bg-slate-50">
          <CalendarDays size={14} className="text-slate-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-sm text-slate-700 bg-transparent outline-none"
          />
        </div>

        <div className="relative flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-1.5 bg-slate-50">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="text-sm text-slate-700 bg-transparent outline-none appearance-none pr-5 cursor-pointer"
          >
            {departments.map((d) => <option key={d}>{d}</option>)}
          </select>
          <ChevronDown size={14} className="text-slate-400 absolute right-2 pointer-events-none" />
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Teachers"
          value="85"
          sub="All departments"
          icon={<Users size={20} className="text-indigo-600" />}
          iconBg="bg-indigo-50"
        />
        <StatCard
          title="Present Today"
          value="79"
          sub="As of 9:15 AM"
          icon={<UserCheck size={20} className="text-emerald-600" />}
          iconBg="bg-emerald-50"
          trend="up"
          trendValue="+2"
        />
        <StatCard
          title="Absent Today"
          value="6"
          sub="Including on-leave"
          icon={<UserX size={20} className="text-red-500" />}
          iconBg="bg-red-50"
          trend="down"
          trendValue="-1"
        />
        <StatCard
          title="Monthly Average"
          value="96.2%"
          sub="June 2026"
          icon={<CalendarDays size={20} className="text-violet-600" />}
          iconBg="bg-violet-50"
          trend="up"
          trendValue="+0.4%"
        />
      </div>

      {/* ── Charts Row 1 ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Bar - Department Wise */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-base font-semibold text-slate-700 mb-1">Department-wise Attendance</h2>
          <p className="text-xs text-slate-400 mb-4">Monthly attendance % per department</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={departmentData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="dept" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis domain={[88, 100]} tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="attendance" name="Attendance" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line - Monthly Trend */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-base font-semibold text-slate-700 mb-1">Monthly Attendance Trend</h2>
          <p className="text-xs text-slate-400 mb-4">Jan – Jun 2026 attendance %</p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={monthlyTrend} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis domain={[90, 100]} tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="attendance"
                name="Attendance"
                stroke="#8b5cf6"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#8b5cf6", strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Charts Row 2 ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Pie */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-base font-semibold text-slate-700 mb-1">Today's Status Split</h2>
          <p className="text-xs text-slate-400 mb-2">Present / Leave / Absent</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value}%`} />
              <Legend
                formatter={(value) => <span className="text-xs text-slate-600">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Department Status Summary */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-base font-semibold text-slate-700 mb-4">Department Summary</h2>
          <div className="space-y-4">
            {[
              { dept: "Physics",   total: 18, present: 17, color: "bg-blue-500"   },
              { dept: "Chemistry", total: 16, present: 16, color: "bg-green-500"  },
              { dept: "Math",      total: 20, present: 19, color: "bg-violet-500" },
              { dept: "Biology",   total: 15, present: 14, color: "bg-rose-500"   },
              { dept: "English",   total: 16, present: 16, color: "bg-amber-500"  },
            ].map((row) => {
              const pct = Math.round((row.present / row.total) * 100);
              return (
                <div key={row.dept}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <BookOpen size={13} className="text-slate-400" />
                      <span className="text-sm font-semibold text-slate-700">{row.dept}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-slate-800">{pct}%</span>
                      <span className="text-xs text-slate-400 ml-2">({row.present}/{row.total})</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div
                      className={`${row.color} h-2.5 rounded-full transition-all`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              { label: "Best Dept",      value: "English — 99%",  color: "text-emerald-600" },
              { label: "Needs Attention",value: "Biology — 94%",  color: "text-amber-600"   },
              { label: "Avg Check-in",   value: "08:52 AM",       color: "text-indigo-600"  },
            ].map((item) => (
              <div key={item.label} className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-500">{item.label}</p>
                <p className={`text-sm font-bold mt-0.5 ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Teacher Table ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-slate-700">Teacher Attendance — Today</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {selectedDept === "All Departments" ? "All departments" : selectedDept} · {filtered.length} records
            </p>
          </div>
          <div className="flex gap-2 text-xs">
            {(["Present", "On Leave", "Absent"] as TeacherStatus[]).map((s) => {
              const cfg = statusConfig[s];
              const count = filtered.filter((t) => t.status === s).length;
              return (
                <span key={s} className={`px-2.5 py-1 rounded-full font-semibold border ${cfg.bg} ${cfg.text}`}>
                  {count} {s}
                </span>
              );
            })}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {["Teacher", "Department", "Subject", "Check-in Time", "Status", "Leave Type"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3 pr-4 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => {
                const cfg = statusConfig[t.status];
                return (
                  <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                    {/* Name */}
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {t.name.replace("Dr. ", "").replace("Prof. ", "").replace("Mr. ", "").replace("Ms. ", "")
                            .split(" ").map((n) => n[0]).slice(0, 2).join("")}
                        </div>
                        <span className="font-medium text-slate-700 whitespace-nowrap">{t.name}</span>
                      </div>
                    </td>

                    {/* Dept */}
                    <td className="py-3 pr-4">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                        {t.department}
                      </span>
                    </td>

                    {/* Subject */}
                    <td className="py-3 pr-4 text-slate-500 whitespace-nowrap">{t.subject}</td>

                    {/* Check-in */}
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Clock size={13} className="text-slate-400" />
                        <span className="font-mono text-xs">{t.checkIn}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 pr-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {t.status}
                      </span>
                    </td>

                    {/* Leave Type */}
                    <td className="py-3">
                      {t.leaveType ? (
                        <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 font-medium">
                          {t.leaveType}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTeacherAttendance;
