import React, { useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Award,
  TrendingUp,
  CheckCircle,
  FileText,
  ChevronDown,
  Download,
  Filter,
  Search,
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const programScores = [
  { program: "Lakshya", avgScore: 82 },
  { program: "Deekshya", avgScore: 79 },
  { program: "DAFNE", avgScore: 76 },
];

const monthlyPassRate = [
  { month: "Jan", passRate: 78 },
  { month: "Feb", passRate: 81 },
  { month: "Mar", passRate: 83 },
  { month: "Apr", passRate: 80 },
  { month: "May", passRate: 85 },
  { month: "Jun", passRate: 88 },
];

const gradeDistribution = [
  { name: "A", value: 35 },
  { name: "B", value: 30 },
  { name: "C", value: 20 },
  { name: "D", value: 10 },
  { name: "F", value: 5 },
];

const GRADE_COLORS = ["#6366f1", "#22d3ee", "#f59e0b", "#f97316", "#ef4444"];

const recentResults = [
  { id: 1, student: "Arjun Mehta",    exam: "JEE Mock 5",      subject: "Physics",     score: "91/100", grade: "A", status: "Pass" },
  { id: 2, student: "Priya Sharma",   exam: "NEET Mock 3",     subject: "Biology",     score: "87/100", grade: "A", status: "Pass" },
  { id: 3, student: "Rohit Verma",    exam: "UPSC PT Mock 2",  subject: "GS Paper I",  score: "74/100", grade: "B", status: "Pass" },
  { id: 4, student: "Sneha Patel",    exam: "JEE Mock 5",      subject: "Chemistry",   score: "62/100", grade: "C", status: "Pass" },
  { id: 5, student: "Karan Singh",    exam: "NEET Mock 3",     subject: "Chemistry",   score: "55/100", grade: "C", status: "Pass" },
  { id: 6, student: "Anjali Rao",     exam: "JEE Mock 5",      subject: "Mathematics", score: "95/100", grade: "A", status: "Pass" },
  { id: 7, student: "Vikram Nair",    exam: "UPSC PT Mock 2",  subject: "GS Paper II", score: "48/100", grade: "D", status: "Fail" },
  { id: 8, student: "Deepika Joshi",  exam: "NEET Mock 4",     subject: "Physics",     score: "81/100", grade: "B", status: "Pass" },
  { id: 9, student: "Manish Gupta",   exam: "JEE Mock 6",      subject: "Physics",     score: "38/100", grade: "F", status: "Fail" },
  { id: 10, student: "Ritu Agarwal",  exam: "UPSC PT Mock 3",  subject: "CSAT",        score: "77/100", grade: "B", status: "Pass" },
];

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
            {p.name}: {p.value}{p.name === "passRate" || p.name === "Pass Rate" ? "%" : ""}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Main Component ───────────────────────────────────────────────────────────

const ResultManagement: React.FC = () => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredResults = recentResults.filter((r) => {
    const matchSearch =
      r.student.toLowerCase().includes(search.toLowerCase()) ||
      r.exam.toLowerCase().includes(search.toLowerCase()) ||
      r.subject.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Result Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Track and manage examination results across all programs
          </p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
          <Download size={16} />
          Export Results
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<FileText size={22} />}
          label="Total Results Published"
          value="1,245"
          sub="Across all programs"
          color="text-indigo-600"
          bg="bg-indigo-50"
        />
        <StatCard
          icon={<TrendingUp size={22} />}
          label="Average Score"
          value="73.4%"
          sub="+2.1% from last month"
          color="text-cyan-600"
          bg="bg-cyan-50"
        />
        <StatCard
          icon={<Award size={22} />}
          label="Highest Score"
          value="99%"
          sub="Anjali Rao · Mathematics"
          color="text-amber-600"
          bg="bg-amber-50"
        />
        <StatCard
          icon={<CheckCircle size={22} />}
          label="Pass Rate"
          value="88.2%"
          sub="↑ 3.2% vs last month"
          color="text-emerald-600"
          bg="bg-emerald-50"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
        {/* Bar Chart – Program-wise Avg Score */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">
            Program-wise Average Score
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={programScores} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="program"
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[60, 100]}
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="avgScore" name="Avg Score" radius={[8, 8, 0, 0]}>
                <Cell fill="#6366f1" />
                <Cell fill="#22d3ee" />
                <Cell fill="#f59e0b" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart – Monthly Pass Rate */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">
            Monthly Pass Rate Trend (Jan – Jun)
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={monthlyPassRate}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[70, 95]}
                tickFormatter={(v) => `${v}%`}
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                formatter={() => "Pass Rate"}
              />
              <Line
                type="monotone"
                dataKey="passRate"
                name="Pass Rate"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={{ fill: "#6366f1", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 + Table */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
        {/* Pie Chart – Grade Distribution */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">
            Grade Distribution
          </h2>
          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {gradeDistribution.map((_, index) => (
                    <Cell key={index} fill={GRADE_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value}%`, "Share"]}
                />
                <Legend
                  iconType="circle"
                  iconSize={10}
                  wrapperStyle={{ fontSize: 12 }}
                  formatter={(value) => `Grade ${value}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Grade Summary */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-sm font-semibold text-slate-700">Grade Summary by Program</h2>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { program: "Lakshya", a: "48%", b: "28%", c: "16%", pass: "92%" },
              { program: "Deekshya", a: "32%", b: "34%", c: "22%", pass: "88%" },
              { program: "DAFNE", a: "25%", b: "28%", c: "22%", pass: "81%" },
            ].map((prog) => (
              <div
                key={prog.program}
                className="rounded-xl border border-slate-100 bg-slate-50 p-4"
              >
                <p className="text-xs font-bold text-indigo-600 mb-3 uppercase tracking-wide">
                  {prog.program}
                </p>
                {[
                  { label: "Grade A", val: prog.a, color: "bg-indigo-500" },
                  { label: "Grade B", val: prog.b, color: "bg-cyan-500" },
                  { label: "Grade C", val: prog.c, color: "bg-amber-500" },
                ].map((g) => (
                  <div key={g.label} className="mb-2">
                    <div className="flex justify-between text-xs text-slate-600 mb-0.5">
                      <span>{g.label}</span>
                      <span className="font-semibold">{g.val}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-200">
                      <div
                        className={`h-1.5 rounded-full ${g.color}`}
                        style={{ width: g.val }}
                      />
                    </div>
                  </div>
                ))}
                <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-xs text-slate-500">Pass Rate</span>
                  <span className="text-sm font-bold text-emerald-600">{prog.pass}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-sm font-semibold text-slate-700">Recent Exam Results</h2>
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search student / exam…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 w-48"
              />
            </div>
            {/* Filter */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none pl-3 pr-7 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                <option value="All">All Status</option>
                <option value="Pass">Pass</option>
                <option value="Fail">Fail</option>
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
                {["#", "Student Name", "Exam", "Subject", "Score", "Grade", "Status"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide pb-3 pr-4 last:pr-0"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                >
                  <td className="py-3 pr-4 text-slate-400 text-xs">{row.id}</td>
                  <td className="py-3 pr-4 font-medium text-slate-800">{row.student}</td>
                  <td className="py-3 pr-4 text-slate-600">{row.exam}</td>
                  <td className="py-3 pr-4 text-slate-600">{row.subject}</td>
                  <td className="py-3 pr-4 font-semibold text-slate-800">{row.score}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        row.grade === "A"
                          ? "bg-indigo-100 text-indigo-700"
                          : row.grade === "B"
                          ? "bg-cyan-100 text-cyan-700"
                          : row.grade === "C"
                          ? "bg-amber-100 text-amber-700"
                          : row.grade === "D"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {row.grade}
                    </span>
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                        row.status === "Pass"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          row.status === "Pass" ? "bg-emerald-500" : "bg-red-500"
                        }`}
                      />
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredResults.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 text-sm">
                    No results match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
          <span>Showing {filteredResults.length} of {recentResults.length} results</span>
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

export default ResultManagement;
