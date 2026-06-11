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
  ClipboardList,
  Activity,
  CalendarCheck,
  BarChart2,
  Plus,
  Search,
  ChevronDown,
  Filter,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const testsPerMonth = [
  { month: "Jan", tests: 42 },
  { month: "Feb", tests: 38 },
  { month: "Mar", tests: 55 },
  { month: "Apr", tests: 49 },
  { month: "May", tests: 60 },
  { month: "Jun", tests: 56 },
];

const testTypeDistribution = [
  { name: "Practice", value: 40 },
  { name: "Chapter", value: 30 },
  { name: "Full Syllabus", value: 20 },
  { name: "Others", value: 10 },
];

const TYPE_COLORS = ["#6366f1", "#22d3ee", "#f59e0b", "#94a3b8"];

const subjectWiseCounts = [
  { subject: "Physics", count: 85 },
  { subject: "Chemistry", count: 75 },
  { subject: "Math", count: 92 },
  { subject: "Biology", count: 60 },
  { subject: "English", count: 30 },
];

const mockTests = [
  {
    id: 1,
    name: "JEE Main Mock Test 7",
    subject: "Physics + Chemistry + Math",
    class: "Class 12",
    duration: "180 min",
    marks: 300,
    status: "Active",
    created: "05 Jun 2026",
  },
  {
    id: 2,
    name: "NEET Full Syllabus Test 4",
    subject: "Biology + Chemistry + Physics",
    class: "Class 12",
    duration: "180 min",
    marks: 720,
    status: "Active",
    created: "04 Jun 2026",
  },
  {
    id: 3,
    name: "UPSC GS Practice Set 11",
    subject: "GS Paper I",
    class: "All",
    duration: "120 min",
    marks: 200,
    status: "Completed",
    created: "02 Jun 2026",
  },
  {
    id: 4,
    name: "JEE Advanced Chapter Test",
    subject: "Mathematics",
    class: "Class 12",
    duration: "60 min",
    marks: 100,
    status: "Draft",
    created: "01 Jun 2026",
  },
  {
    id: 5,
    name: "NEET Chapter Test – Genetics",
    subject: "Biology",
    class: "Class 11",
    duration: "45 min",
    marks: 90,
    status: "Active",
    created: "30 May 2026",
  },
  {
    id: 6,
    name: "CSAT Practice Paper 5",
    subject: "Aptitude + English",
    class: "All",
    duration: "120 min",
    marks: 200,
    status: "Completed",
    created: "28 May 2026",
  },
  {
    id: 7,
    name: "Physics Thermodynamics Test",
    subject: "Physics",
    class: "Class 11",
    duration: "30 min",
    marks: 60,
    status: "Draft",
    created: "25 May 2026",
  },
  {
    id: 8,
    name: "JEE Main Mock Test 6",
    subject: "Physics + Chemistry + Math",
    class: "Class 12",
    duration: "180 min",
    marks: 300,
    status: "Completed",
    created: "20 May 2026",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusStyle = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "Draft":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    case "Completed":
      return "bg-slate-100 text-slate-600 border border-slate-200";
    default:
      return "bg-slate-100 text-slate-500";
  }
};

const statusDot = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-emerald-500";
    case "Draft":
      return "bg-amber-400";
    case "Completed":
      return "bg-slate-400";
    default:
      return "bg-slate-300";
  }
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  color: string;
  bg: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, sub, color, bg }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4">
    <div className={`${bg} p-3 rounded-xl`}>
      <div className={color}>{icon}</div>
    </div>
    <div>
      <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-slate-800 leading-tight">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-100 rounded-xl shadow-lg px-4 py-3 text-sm">
        <p className="font-semibold text-slate-700 mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="font-medium">
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Main Component ───────────────────────────────────────────────────────────

const AdminMockTests: React.FC = () => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const filtered = mockTests.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Mock Test Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Create, schedule, and track mock tests across Lakshya, Deekshya &amp; DAFNE
          </p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
          <Plus size={16} />
          New Mock Test
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<ClipboardList size={22} />}
          label="Total Tests"
          value="342"
          sub="All programs combined"
          color="text-indigo-600"
          bg="bg-indigo-50"
        />
        <StatCard
          icon={<Activity size={22} />}
          label="Active Tests"
          value="18"
          sub="Currently live"
          color="text-emerald-600"
          bg="bg-emerald-50"
        />
        <StatCard
          icon={<CalendarCheck size={22} />}
          label="Completed This Month"
          value="56"
          sub="June 2026"
          color="text-cyan-600"
          bg="bg-cyan-50"
        />
        <StatCard
          icon={<BarChart2 size={22} />}
          label="Avg Score"
          value="71.2%"
          sub="↑ 1.8% from last month"
          color="text-amber-600"
          bg="bg-amber-50"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
        {/* Tests per Month */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">
            Tests Created Per Month (Jan – Jun 2026)
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={testsPerMonth} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="tests" name="Tests" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie – Test Type */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Test Type Distribution</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={testTypeDistribution}
                cx="50%"
                cy="45%"
                innerRadius={52}
                outerRadius={82}
                paddingAngle={3}
                dataKey="value"
              >
                {testTypeDistribution.map((_, i) => (
                  <Cell key={i} fill={TYPE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`${value}%`, "Share"]}
              />
              <Legend
                iconType="circle"
                iconSize={9}
                wrapperStyle={{ fontSize: 11 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
        {/* Subject-wise Bar */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">
            Subject-wise Test Count
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={subjectWiseCounts} layout="vertical" barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="subject"
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                width={70}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Tests" radius={[0, 8, 8, 0]}>
                {subjectWiseCounts.map((_, i) => (
                  <Cell
                    key={i}
                    fill={["#6366f1", "#22d3ee", "#f59e0b", "#10b981", "#f97316"][i]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Stats Panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Status Overview</h2>
          <div className="space-y-3">
            {[
              { label: "Active", count: 18, pct: 53, color: "bg-emerald-500" },
              { label: "Draft", count: 8, pct: 23, color: "bg-amber-400" },
              { label: "Completed", count: 316, pct: 92, color: "bg-indigo-400" },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span className="font-medium">{s.label}</span>
                  <span className="font-semibold text-slate-700">{s.count} tests</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className={`h-2 rounded-full ${s.color}`}
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-slate-100 pt-4 space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Program Breakdown
            </p>
            {[
              { name: "Lakshya", count: 148, color: "bg-indigo-500" },
              { name: "Deekshya", count: 122, color: "bg-cyan-500" },
              { name: "DAFNE", count: 72, color: "bg-amber-500" },
            ].map((p) => (
              <div key={p.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${p.color}`} />
                  <span className="text-xs text-slate-600">{p.name}</span>
                </div>
                <span className="text-xs font-bold text-slate-700">{p.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tests Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-sm font-semibold text-slate-700">Recent Mock Tests</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search test / subject…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 w-48"
              />
            </div>
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none pl-3 pr-7 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Completed">Completed</option>
              </select>
              <ChevronDown
                size={12}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
            <button className="flex items-center gap-1.5 text-xs text-slate-500 border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-50 transition-colors">
              <Filter size={13} />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {[
                  "#",
                  "Test Name",
                  "Subject",
                  "Class",
                  "Duration",
                  "Total Marks",
                  "Status",
                  "Created",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide pb-3 pr-4 last:pr-0 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                >
                  <td className="py-3 pr-4 text-slate-400 text-xs">{row.id}</td>
                  <td className="py-3 pr-4 font-semibold text-slate-800 max-w-[180px]">
                    <span className="line-clamp-1">{row.name}</span>
                  </td>
                  <td className="py-3 pr-4 text-slate-500 text-xs max-w-[160px]">
                    <span className="line-clamp-1">{row.subject}</span>
                  </td>
                  <td className="py-3 pr-4 text-slate-600 whitespace-nowrap">{row.class}</td>
                  <td className="py-3 pr-4 text-slate-600 whitespace-nowrap">{row.duration}</td>
                  <td className="py-3 pr-4 font-semibold text-slate-800">{row.marks}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle(row.status)}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot(row.status)}`} />
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-slate-500 text-xs whitespace-nowrap">
                    {row.created}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      <button
                        title="View"
                        className="p-1.5 rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        title="Edit"
                        className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        title="Delete"
                        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="py-10 text-center text-slate-400 text-sm"
                  >
                    No tests match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
          <span>Showing {filtered.length} of {mockTests.length} tests</span>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              Prev
            </button>
            <button className="px-3 py-1.5 border border-slate-200 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
              1
            </button>
            <button className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              2
            </button>
            <button className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMockTests;
