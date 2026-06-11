import React, { useState } from "react";
import {
  BarChart,
  Bar,
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
  BookOpen,
  Stethoscope,
  Landmark,
  Users,
  Layers,
  GraduationCap,
  TrendingUp,
  CheckCircle2,
  Clock,
  ChevronDown,
  Search,
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const programs = [
  {
    id: "lakshya",
    name: "Lakshya",
    subtitle: "Engineering Preparation",
    students: 450,
    batches: 9,
    passRate: 78,
    avgScore: 74,
    icon: BookOpen,
    color: "blue",
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    border: "border-blue-100",
    accent: "#3b82f6",
    gradientFrom: "from-blue-500",
    gradientTo: "to-blue-700",
  },
  {
    id: "deekshya",
    name: "Deekshya",
    subtitle: "Medical Preparation",
    students: 600,
    batches: 12,
    passRate: 82,
    avgScore: 79,
    icon: Stethoscope,
    color: "emerald",
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    border: "border-emerald-100",
    accent: "#10b981",
    gradientFrom: "from-emerald-500",
    gradientTo: "to-emerald-700",
  },
  {
    id: "dafne",
    name: "DAFNE",
    subtitle: "Civil Services Preparation",
    students: 200,
    batches: 5,
    passRate: 65,
    avgScore: 68,
    icon: Landmark,
    color: "amber",
    bg: "bg-amber-50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    border: "border-amber-100",
    accent: "#f59e0b",
    gradientFrom: "from-amber-500",
    gradientTo: "to-amber-600",
  },
];

const subjectScoresData = [
  { subject: "Physics",   Lakshya: 78, Deekshya: 82, DAFNE: 55 },
  { subject: "Chemistry", Lakshya: 74, Deekshya: 85, DAFNE: 58 },
  { subject: "Math",      Lakshya: 80, Deekshya: 72, DAFNE: 70 },
  { subject: "Biology",   Lakshya: 60, Deekshya: 88, DAFNE: 52 },
];

const studentDistribution = [
  { name: "Lakshya",  value: 450 },
  { name: "Deekshya", value: 600 },
  { name: "DAFNE",    value: 200 },
];

const PIE_COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

const batchData = [
  { id: 1,  name: "JEE-Alpha-2026",  program: "Lakshya",  students: 52, teacher: "Dr. Ramesh Iyer",     schedule: "Mon/Wed/Fri 7:00 AM", status: "Active" },
  { id: 2,  name: "JEE-Beta-2026",   program: "Lakshya",  students: 50, teacher: "Prof. Sunil Verma",   schedule: "Tue/Thu/Sat 7:00 AM", status: "Active" },
  { id: 3,  name: "NEET-Core-2026",  program: "Deekshya", students: 55, teacher: "Dr. Anita Sharma",    schedule: "Mon/Wed/Fri 8:00 AM", status: "Active" },
  { id: 4,  name: "NEET-Plus-2026",  program: "Deekshya", students: 53, teacher: "Dr. Pradeep Rao",     schedule: "Tue/Thu/Sat 8:00 AM", status: "Active" },
  { id: 5,  name: "NEET-Adv-2026",   program: "Deekshya", students: 48, teacher: "Prof. Meena Das",     schedule: "Mon/Wed/Fri 9:00 AM", status: "Inactive" },
  { id: 6,  name: "UPSC-Elite-2026", program: "DAFNE",    students: 42, teacher: "Shri. Vijay Nair",    schedule: "Tue/Thu 6:30 AM",    status: "Active" },
  { id: 7,  name: "UPSC-Std-2026",   program: "DAFNE",    students: 40, teacher: "Dr. Kavita Singh",    schedule: "Mon/Wed 6:30 AM",    status: "Active" },
  { id: 8,  name: "JEE-Crash-2026",  program: "Lakshya",  students: 38, teacher: "Prof. Arjun Mehta",   schedule: "Daily 6:00 AM",       status: "Inactive" },
];

const quickStats = [
  { label: "Total Batches",    value: "24",  icon: Layers,         color: "text-indigo-600", bg: "bg-indigo-50" },
  { label: "Active Teachers",  value: "85",  icon: GraduationCap,  color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Avg Batch Size",   value: "52",  icon: Users,          color: "text-blue-600",   bg: "bg-blue-50" },
  { label: "Overall Pass Rate",value: "76%", icon: TrendingUp,     color: "text-amber-600",  bg: "bg-amber-50" },
];

// ─── Helper Components ────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: string }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
      status === "Active"
        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
        : "bg-slate-100 text-slate-500 border border-slate-200"
    }`}
  >
    {status === "Active" ? <CheckCircle2 size={11} /> : <Clock size={11} />}
    {status}
  </span>
);

const ProgramBadge = ({ program }: { program: string }) => {
  const map: Record<string, string> = {
    Lakshya:  "bg-blue-50 text-blue-700",
    Deekshya: "bg-emerald-50 text-emerald-700",
    DAFNE:    "bg-amber-50 text-amber-700",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${map[program] ?? ""}`}>
      {program}
    </span>
  );
};

const CustomTooltipGrouped = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 min-w-[140px]">
        <p className="text-xs font-bold text-slate-600 mb-2">{label}</p>
        {payload.map((p: any) => (
          <div key={p.name} className="flex items-center justify-between gap-4 text-xs mb-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.fill }} />
              <span className="text-slate-500">{p.name}</span>
            </span>
            <span className="font-bold text-slate-800">{p.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CustomTooltipPie = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const total = 1250;
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3">
        <p className="text-xs font-semibold text-slate-600">{payload[0].name}</p>
        <p className="text-sm font-bold text-slate-800">{payload[0].value} students</p>
        <p className="text-xs text-slate-400">{((payload[0].value / total) * 100).toFixed(1)}% of total</p>
      </div>
    );
  }
  return null;
};

// ─── Main Component ───────────────────────────────────────────────────────────

const ProgramManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [programFilter, setProgramFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredBatches = batchData.filter((b) => {
    const matchSearch =
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchProgram = programFilter === "All" || b.program === programFilter;
    const matchStatus = statusFilter === "All" || b.status === statusFilter;
    return matchSearch && matchProgram && matchStatus;
  });

  return (
    <div className="bg-slate-50 min-h-screen p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Program Management</h1>
          <p className="text-slate-500 mt-1 text-sm">Overview of Lakshya, Deekshya & DAFNE programs</p>
        </div>
        <div className="flex items-center gap-2">
          {programs.map((p) => (
            <span
              key={p.id}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full ${p.bg} ${p.iconColor}`}
            >
              {p.name}
            </span>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4">
              <div className={`${stat.bg} p-3 rounded-xl flex-shrink-0`}>
                <Icon size={20} className={stat.color} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Program Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {programs.map((prog) => {
          const Icon = prog.icon;
          return (
            <div
              key={prog.id}
              className={`bg-white rounded-2xl shadow-sm border ${prog.border} p-6 hover:shadow-md transition-shadow`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-5">
                <div className={`${prog.iconBg} p-3 rounded-xl`}>
                  <Icon size={24} className={prog.iconColor} />
                </div>
                <span className={`text-xs font-semibold ${prog.iconColor} ${prog.bg} px-2.5 py-1 rounded-full`}>
                  {prog.passRate}% Pass Rate
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-800">{prog.name}</h3>
              <p className="text-sm text-slate-500 mb-5">{prog.subtitle}</p>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="text-center">
                  <p className="text-xl font-bold text-slate-800">{prog.students}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Students</p>
                </div>
                <div className="text-center border-x border-slate-100">
                  <p className="text-xl font-bold text-slate-800">{prog.batches}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Batches</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-slate-800">{prog.avgScore}%</p>
                  <p className="text-xs text-slate-400 mt-0.5">Avg Score</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                  <span>Pass Rate</span>
                  <span className="font-semibold">{prog.passRate}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${prog.passRate}%`, backgroundColor: prog.accent }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Grouped Bar Chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-800">Subject-wise Score Comparison</h2>
            <p className="text-xs text-slate-400 mt-0.5">Average scores across programs (%) — AY 2025–26</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={subjectScoresData}
              barSize={22}
              barGap={4}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="subject" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip content={<CustomTooltipGrouped />} cursor={{ fill: "#f8fafc" }} />
              <Legend
                wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
                iconType="circle"
                iconSize={8}
              />
              <Bar dataKey="Lakshya"  fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Deekshya" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="DAFNE"    fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-800">Student Distribution</h2>
            <p className="text-xs text-slate-400 mt-0.5">1,250 total enrolled</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={studentDistribution}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {studentDistribution.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltipPie />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2.5">
            {studentDistribution.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: PIE_COLORS[index] }}
                  />
                  <span className="text-xs text-slate-600">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-700">{item.value}</span>
                  <span className="text-xs text-slate-400 ml-1">
                    ({((item.value / 1250) * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Batch Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Active Batches</h2>
            <p className="text-xs text-slate-400 mt-0.5">{filteredBatches.length} batches shown</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search batch or teacher…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 w-52"
              />
            </div>
            {/* Program Filter */}
            <div className="relative">
              <select
                value={programFilter}
                onChange={(e) => setProgramFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
              >
                <option value="All">All Programs</option>
                <option value="Lakshya">Lakshya</option>
                <option value="Deekshya">Deekshya</option>
                <option value="DAFNE">DAFNE</option>
              </select>
              <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {["#", "Batch Name", "Program", "Students", "Teacher", "Schedule", "Status"].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3 pr-4 last:pr-0"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredBatches.map((batch, idx) => (
                <tr
                  key={batch.id}
                  className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${
                    idx % 2 === 0 ? "" : "bg-slate-50/40"
                  }`}
                >
                  <td className="py-3.5 pr-4 text-slate-400 font-mono text-xs">
                    {String(batch.id).padStart(2, "0")}
                  </td>
                  <td className="py-3.5 pr-4 font-semibold text-slate-800">{batch.name}</td>
                  <td className="py-3.5 pr-4">
                    <ProgramBadge program={batch.program} />
                  </td>
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-1.5">
                      <Users size={13} className="text-slate-400" />
                      <span className="font-semibold text-slate-700">{batch.students}</span>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4 text-slate-600">{batch.teacher}</td>
                  <td className="py-3.5 pr-4 text-slate-500 text-xs">{batch.schedule}</td>
                  <td className="py-3.5">
                    <StatusBadge status={batch.status} />
                  </td>
                </tr>
              ))}
              {filteredBatches.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-sm">
                    No batches found for the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProgramManagement;
