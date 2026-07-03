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
  AlertTriangle,
  UserCheck,
  CalendarDays,
  ChevronDown,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const classWiseData = [
  { class: "12A", attendance: 95 },
  { class: "12B", attendance: 93 },
  { class: "11A", attendance: 91 },
  { class: "11B", attendance: 88 },
  { class: "10A", attendance: 92 },
  { class: "10B", attendance: 89 },
  { class: "9A", attendance: 87 },
];

const dailyTrendData = [
  { day: "Mon", attendance: 94 },
  { day: "Tue", attendance: 91 },
  { day: "Wed", attendance: 88 },
  { day: "Thu", attendance: 95 },
  { day: "Fri", attendance: 90 },
  { day: "Sat", attendance: 85 },
];

const pieData = [
  { name: "Present", value: 91 },
  { name: "Absent", value: 6 },
  { name: "Late", value: 3 },
];

const PIE_COLORS = ["#10b981", "#ef4444", "#f59e0b"];

const lowAttendanceStudents = [
  { id: 1, name: "Arjun Sharma",     class: "12B", program: "IIT",  attendance: 68, daysAbsent: 22, status: "Critical" },
  { id: 2, name: "Priya Nair",       class: "11A", program: "NEET", attendance: 71, daysAbsent: 20, status: "Critical" },
  { id: 3, name: "Rohit Verma",      class: "10B", program: "IIT",  attendance: 72, daysAbsent: 19, status: "Warning"  },
  { id: 4, name: "Sneha Pillai",     class: "9A",  program: "UPSC",    attendance: 73, daysAbsent: 18, status: "Warning"  },
  { id: 5, name: "Kiran Mehta",      class: "11B", program: "NEET", attendance: 69, daysAbsent: 21, status: "Critical" },
  { id: 6, name: "Divya Krishnan",   class: "12A", program: "IIT",  attendance: 74, daysAbsent: 17, status: "Warning"  },
  { id: 7, name: "Aditya Rao",       class: "10A", program: "UPSC",    attendance: 70, daysAbsent: 21, status: "Critical" },
  { id: 8, name: "Meena Joshi",      class: "12B", program: "NEET", attendance: 73, daysAbsent: 18, status: "Warning"  },
  { id: 9, name: "Suresh Kumar",     class: "11A", program: "IIT",  attendance: 67, daysAbsent: 23, status: "Critical" },
  { id: 10, name: "Lakshmi Devi",    class: "9A",  program: "UPSC",    attendance: 74, daysAbsent: 17, status: "Warning"  },
];

const classes = ["All Classes", "12A", "12B", "11A", "11B", "10A", "10B", "9A"];
const programs = ["All Programs", "IIT", "NEET", "UPSC"];

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

const AttendanceManagement: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState("2026-06-10");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [selectedProgram, setSelectedProgram] = useState("All Programs");

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Student Attendance</h1>
          <p className="text-sm text-slate-500 mt-0.5">Monitor and manage attendance across all classes and programs</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition">
            <Download size={15} />
            Export
          </button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <Filter size={16} className="text-slate-400" />
        <span className="text-sm font-medium text-slate-600">Filters:</span>

        {/* Date */}
        <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-1.5 bg-slate-50">
          <CalendarDays size={14} className="text-slate-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-sm text-slate-700 bg-transparent outline-none"
          />
        </div>

        {/* Class filter */}
        <div className="relative flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-1.5 bg-slate-50 cursor-pointer">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="text-sm text-slate-700 bg-transparent outline-none appearance-none pr-5 cursor-pointer"
          >
            {classes.map((c) => <option key={c}>{c}</option>)}
          </select>
          <ChevronDown size={14} className="text-slate-400 absolute right-2 pointer-events-none" />
        </div>

        {/* Program filter */}
        <div className="relative flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-1.5 bg-slate-50 cursor-pointer">
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            className="text-sm text-slate-700 bg-transparent outline-none appearance-none pr-5 cursor-pointer"
          >
            {programs.map((p) => <option key={p}>{p}</option>)}
          </select>
          <ChevronDown size={14} className="text-slate-400 absolute right-2 pointer-events-none" />
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Overall Attendance"
          value="91.4%"
          sub="Academic year 2025–26"
          icon={<TrendingUp size={20} className="text-emerald-600" />}
          iconBg="bg-emerald-50"
          trend="up"
          trendValue="+1.2%"
        />
        <StatCard
          title="Students Below 75%"
          value="23"
          sub="Require immediate attention"
          icon={<AlertTriangle size={20} className="text-red-500" />}
          iconBg="bg-red-50"
          trend="down"
          trendValue="-3"
        />
        <StatCard
          title="Today Present"
          value="1,185"
          sub="Out of 1,250 students"
          icon={<UserCheck size={20} className="text-blue-600" />}
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Monthly Average"
          value="89.2%"
          sub="June 2026"
          icon={<CalendarDays size={20} className="text-violet-600" />}
          iconBg="bg-violet-50"
          trend="up"
          trendValue="+0.8%"
        />
      </div>

      {/* ── Charts Row 1 ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Bar Chart - Class wise */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-base font-semibold text-slate-700 mb-1">Class-wise Attendance</h2>
          <p className="text-xs text-slate-400 mb-4">Attendance percentage by class section</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={classWiseData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="class" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis domain={[80, 100]} tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="attendance" name="Attendance" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart - Daily Trend */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-base font-semibold text-slate-700 mb-1">Daily Attendance Trend</h2>
          <p className="text-xs text-slate-400 mb-4">Last 6 school days attendance %</p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={dailyTrendData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis domain={[80, 100]} tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="attendance"
                name="Attendance"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Charts Row 2: Pie + Summary ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Pie */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col">
          <h2 className="text-base font-semibold text-slate-700 mb-1">Today's Attendance Split</h2>
          <p className="text-xs text-slate-400 mb-2">Present / Absent / Late breakdown</p>
          <div className="flex items-center justify-center flex-1">
            <ResponsiveContainer width="100%" height={220}>
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
        </div>

        {/* Quick Stats */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-base font-semibold text-slate-700 mb-4">Program-wise Summary</h2>
          <div className="space-y-4">
            {[
              { program: "IIT", desc: "Engineering Prep", students: 520, attendance: 92.1, color: "bg-indigo-500" },
              { program: "NEET", desc: "Medical Prep", students: 480, attendance: 90.8, color: "bg-emerald-500" },
              { program: "UPSC", desc: "Civil Services Prep", students: 250, attendance: 88.6, color: "bg-amber-500" },
            ].map((row) => (
              <div key={row.program}>
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <span className="text-sm font-semibold text-slate-700">{row.program}</span>
                    <span className="text-xs text-slate-400 ml-2">{row.desc}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-800">{row.attendance}%</span>
                    <span className="text-xs text-slate-400 ml-2">({row.students} students)</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div
                    className={`${row.color} h-2.5 rounded-full transition-all`}
                    style={{ width: `${row.attendance}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { label: "Highest Class", value: "12A — 95%", color: "text-emerald-600" },
              { label: "Lowest Class",  value: "9A — 87%",  color: "text-red-500"    },
              { label: "Avg Absences",  value: "6.2 days",  color: "text-amber-600"  },
            ].map((item) => (
              <div key={item.label} className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-500">{item.label}</p>
                <p className={`text-sm font-bold mt-0.5 ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Low Attendance Table ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-slate-700">Students Below 75% Attendance</h2>
            <p className="text-xs text-slate-400 mt-0.5">Showing students who need immediate follow-up</p>
          </div>
          <span className="bg-red-50 text-red-600 text-xs font-semibold px-3 py-1 rounded-full border border-red-100">
            23 at risk
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {["Student Name", "Class", "Program", "Attendance %", "Days Absent", "Alert Status"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3 pr-4 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lowAttendanceStudents.map((s, i) => (
                <tr key={s.id} className={`border-b border-slate-50 hover:bg-slate-50 transition ${i % 2 === 0 ? "" : ""}`}>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {s.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <span className="font-medium text-slate-700">{s.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-slate-600">{s.class}</td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      s.program === "IIT"
                        ? "bg-indigo-50 text-indigo-600"
                        : s.program === "NEET"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-600"
                    }`}>
                      {s.program}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="font-bold text-red-500">{s.attendance}%</span>
                  </td>
                  <td className="py-3 pr-4 text-slate-600">{s.daysAbsent} days</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                      s.status === "Critical"
                        ? "bg-red-50 text-red-600 border border-red-100"
                        : "bg-amber-50 text-amber-600 border border-amber-100"
                    }`}>
                      <AlertTriangle size={10} />
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceManagement;
