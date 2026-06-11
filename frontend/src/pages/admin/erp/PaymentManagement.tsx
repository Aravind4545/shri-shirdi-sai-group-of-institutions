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
  IndianRupee,
  TrendingUp,
  Clock,
  AlertTriangle,
  Download,
  Search,
  Filter,
  ChevronDown,
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const monthlyRevenueData = [
  { month: "Jan", revenue: 285000 },
  { month: "Feb", revenue: 310000 },
  { month: "Mar", revenue: 420000 },
  { month: "Apr", revenue: 395000 },
  { month: "May", revenue: 510000 },
  { month: "Jun", revenue: 642000 },
];

const feeCategoryData = [
  { name: "Tuition Fee", value: 65 },
  { name: "Transport", value: 15 },
  { name: "Lab Fee", value: 10 },
  { name: "Other", value: 10 },
];

const PIE_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444"];

const recentPayments = [
  { id: 1,  name: "Rahul Sharma",       program: "Lakshya",  amount: 45000, date: "2026-06-08", status: "Paid" },
  { id: 2,  name: "Priya Nair",         program: "Deekshya", amount: 42000, date: "2026-06-07", status: "Pending" },
  { id: 3,  name: "Arjun Mehta",        program: "DAFNE",    amount: 38000, date: "2026-06-06", status: "Paid" },
  { id: 4,  name: "Sneha Reddy",        program: "Deekshya", amount: 42000, date: "2026-06-05", status: "Overdue" },
  { id: 5,  name: "Vikram Patel",       program: "Lakshya",  amount: 45000, date: "2026-06-04", status: "Paid" },
  { id: 6,  name: "Anjali Singh",       program: "DAFNE",    amount: 38000, date: "2026-06-03", status: "Pending" },
  { id: 7,  name: "Rohit Verma",        program: "Lakshya",  amount: 45000, date: "2026-06-02", status: "Paid" },
  { id: 8,  name: "Meera Krishnan",     program: "Deekshya", amount: 42000, date: "2026-06-01", status: "Overdue" },
  { id: 9,  name: "Kiran Joshi",        program: "DAFNE",    amount: 38000, date: "2026-05-31", status: "Paid" },
  { id: 10, name: "Divya Subramaniam",  program: "Deekshya", amount: 42000, date: "2026-05-30", status: "Pending" },
];

// ─── Helper Components ────────────────────────────────────────────────────────

const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    Paid:    "bg-emerald-100 text-emerald-700 border border-emerald-200",
    Pending: "bg-amber-100 text-amber-700 border border-amber-200",
    Overdue: "bg-red-100 text-red-700 border border-red-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[status] ?? ""}`}>
      {status}
    </span>
  );
};

interface KpiCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  iconBg: string;
  trend?: string;
}

const KpiCard = ({ title, value, subtitle, icon, iconBg, trend }: KpiCardProps) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-start gap-4 hover:shadow-md transition-shadow">
    <div className={`${iconBg} p-3 rounded-xl flex-shrink-0`}>{icon}</div>
    <div className="min-w-0">
      <p className="text-sm text-slate-500 font-medium mb-1">{title}</p>
      <p className="text-2xl font-bold text-slate-800 tracking-tight">{value}</p>
      <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
      {trend && <p className="text-xs text-emerald-600 font-medium mt-1">{trend}</p>}
    </div>
  </div>
);

const CustomTooltipBar = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3">
        <p className="text-xs font-semibold text-slate-500 mb-1">{label}</p>
        <p className="text-sm font-bold text-indigo-600">{formatINR(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const CustomTooltipPie = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3">
        <p className="text-xs font-semibold text-slate-600">{payload[0].name}</p>
        <p className="text-sm font-bold text-slate-800">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

// ─── Main Component ───────────────────────────────────────────────────────────

const PaymentManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredPayments = recentPayments.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.program.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "All" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="bg-slate-50 min-h-screen p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Payment Management</h1>
          <p className="text-slate-500 mt-1 text-sm">Track revenue, fee collections, and payment statuses</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm">
          <Download size={16} />
          Export Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <KpiCard
          title="Total Revenue"
          value="₹48,32,500"
          subtitle="Academic Year 2025–26"
          icon={<IndianRupee size={22} className="text-indigo-600" />}
          iconBg="bg-indigo-50"
          trend="↑ 12.4% vs last year"
        />
        <KpiCard
          title="Pending Fees"
          value="₹8,15,200"
          subtitle="Across 187 students"
          icon={<Clock size={22} className="text-amber-600" />}
          iconBg="bg-amber-50"
        />
        <KpiCard
          title="This Month Revenue"
          value="₹6,42,000"
          subtitle="June 2026"
          icon={<TrendingUp size={22} className="text-emerald-600" />}
          iconBg="bg-emerald-50"
          trend="↑ 25.9% vs May"
        />
        <KpiCard
          title="Overdue Payments"
          value="₹2,10,800"
          subtitle="48 students affected"
          icon={<AlertTriangle size={22} className="text-red-600" />}
          iconBg="bg-red-50"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Bar Chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Monthly Revenue</h2>
              <p className="text-xs text-slate-400 mt-0.5">Jan – Jun 2026</p>
            </div>
            <span className="bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full">
              ₹25,62,000 total
            </span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyRevenueData} barSize={36} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`}
              />
              <Tooltip content={<CustomTooltipBar />} cursor={{ fill: "#f8fafc" }} />
              <Bar dataKey="revenue" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-800">Fee Category Split</h2>
            <p className="text-xs text-slate-400 mt-0.5">Distribution by type</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={feeCategoryData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {feeCategoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltipPie />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {feeCategoryData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: PIE_COLORS[index] }}
                  />
                  <span className="text-slate-600 text-xs">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-700 text-xs">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Recent Payments</h2>
            <p className="text-xs text-slate-400 mt-0.5">{filteredPayments.length} records shown</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search student or program…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 w-56"
              />
            </div>
            {/* Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3 pr-4">#</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3 pr-4">Student Name</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3 pr-4">Program</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3 pr-4">Amount</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3 pr-4">Date</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment, idx) => (
                <tr
                  key={payment.id}
                  className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? "" : "bg-slate-50/40"}`}
                >
                  <td className="py-3.5 pr-4 text-slate-400 font-mono text-xs">{String(payment.id).padStart(2, "0")}</td>
                  <td className="py-3.5 pr-4 font-semibold text-slate-800">{payment.name}</td>
                  <td className="py-3.5 pr-4">
                    <span
                      className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                        payment.program === "Lakshya"
                          ? "bg-blue-50 text-blue-700"
                          : payment.program === "Deekshya"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {payment.program}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 font-bold text-slate-800">
                    {formatINR(payment.amount)}
                  </td>
                  <td className="py-3.5 pr-4 text-slate-500">
                    {new Date(payment.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="py-3.5">
                    <StatusBadge status={payment.status} />
                  </td>
                </tr>
              ))}
              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-sm">
                    No records found for the current filter.
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

export default PaymentManagement;
