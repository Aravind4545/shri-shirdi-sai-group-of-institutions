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
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Check,
  X,
  TrendingUp,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type AppStatus = "Approved" | "Pending" | "Rejected";

interface Application {
  id: number;
  name: string;
  phone: string;
  program: "IIT" | "NEET" | "UPSC";
  appliedDate: string;
  score: number;
  status: AppStatus;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const monthlyApplications = [
  { month: "Jan", applications: 45 },
  { month: "Feb", applications: 68 },
  { month: "Mar", applications: 92 },
  { month: "Apr", applications: 75 },
  { month: "May", applications: 38 },
  { month: "Jun", applications: 24 },
];

const programDistribution = [
  { name: "IIT", value: 45 },
  { name: "NEET", value: 35 },
  { name: "UPSC", value: 20 },
];

const approvalTrend = [
  { month: "Jan", rate: 72 },
  { month: "Feb", rate: 75 },
  { month: "Mar", rate: 80 },
  { month: "Apr", rate: 78 },
  { month: "May", rate: 82 },
  { month: "Jun", rate: 85 },
];

const PIE_COLORS = ["#6366f1", "#10b981", "#f59e0b"];

const PROGRAM_BADGE: Record<string, string> = {
  IIT: "bg-indigo-100 text-indigo-700",
  NEET: "bg-emerald-100 text-emerald-700",
  UPSC: "bg-amber-100 text-amber-700",
};

const initialApplications: Application[] = [
  { id: 1, name: "Arjun Mehta", phone: "9876543210", program: "IIT", appliedDate: "10 Jun 2026", score: 182, status: "Approved" },
  { id: 2, name: "Sneha Pillai", phone: "9823456701", program: "NEET", appliedDate: "09 Jun 2026", score: 174, status: "Pending" },
  { id: 3, name: "Rahul Verma", phone: "9812345678", program: "UPSC", appliedDate: "09 Jun 2026", score: 165, status: "Approved" },
  { id: 4, name: "Priya Krishnan", phone: "9867543219", program: "IIT", appliedDate: "08 Jun 2026", score: 190, status: "Approved" },
  { id: 5, name: "Kiran Bose", phone: "9898765432", program: "NEET", appliedDate: "08 Jun 2026", score: 148, status: "Rejected" },
  { id: 6, name: "Ananya Sharma", phone: "9845671234", program: "UPSC", appliedDate: "07 Jun 2026", score: 171, status: "Pending" },
  { id: 7, name: "Vijay Nair", phone: "9834567890", program: "IIT", appliedDate: "07 Jun 2026", score: 159, status: "Pending" },
  { id: 8, name: "Meera Joshi", phone: "9876501234", program: "NEET", appliedDate: "06 Jun 2026", score: 185, status: "Approved" },
  { id: 9, name: "Suresh Reddy", phone: "9811234567", program: "IIT", appliedDate: "06 Jun 2026", score: 143, status: "Rejected" },
  { id: 10, name: "Divya Nambiar", phone: "9856789012", program: "UPSC", appliedDate: "05 Jun 2026", score: 168, status: "Pending" },
  { id: 11, name: "Arun Kumar", phone: "9867890123", program: "IIT", appliedDate: "05 Jun 2026", score: 177, status: "Approved" },
  { id: 12, name: "Lakshmi Iyer", phone: "9878901234", program: "NEET", appliedDate: "04 Jun 2026", score: 138, status: "Rejected" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  iconBg: string;
  textColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, iconBg, textColor }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
    </div>
  </div>
);

const StatusBadge: React.FC<{ status: AppStatus }> = ({ status }) => {
  const styles: Record<AppStatus, string> = {
    Approved: "bg-emerald-100 text-emerald-700",
    Pending: "bg-amber-100 text-amber-700",
    Rejected: "bg-rose-100 text-rose-700",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-md px-4 py-2 text-sm">
        <p className="font-semibold text-slate-700">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color ?? p.stroke }}>
            {p.name}: {p.value}{p.name === "Approval Rate" ? "%" : ""}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

type TabKey = "All" | "Pending" | "Approved" | "Rejected";

// ─── Main Component ───────────────────────────────────────────────────────────

const AdmissionsManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("All");
  const [apps, setApps] = useState<Application[]>(initialApplications);

  const stats = {
    total: apps.length,
    approved: apps.filter((a) => a.status === "Approved").length,
    pending: apps.filter((a) => a.status === "Pending").length,
    rejected: apps.filter((a) => a.status === "Rejected").length,
  };

  const tabs: TabKey[] = ["All", "Pending", "Approved", "Rejected"];

  const filteredApps =
    activeTab === "All" ? apps : apps.filter((a) => a.status === activeTab);

  const handleApprove = (id: number) => {
    setApps((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Approved" } : a))
    );
  };

  const handleReject = (id: number) => {
    setApps((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Rejected" } : a))
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Admissions Management</h1>
        <p className="text-slate-500 text-sm mt-1">
          Review, approve, and track student applications — Aashvee ERP
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<Users className="w-6 h-6 text-indigo-600" />}
          label="Total Applications"
          value={342}
          iconBg="bg-indigo-50"
          textColor="text-indigo-700"
        />
        <StatCard
          icon={<CheckCircle className="w-6 h-6 text-emerald-600" />}
          label="Approved"
          value={198}
          iconBg="bg-emerald-50"
          textColor="text-emerald-700"
        />
        <StatCard
          icon={<Clock className="w-6 h-6 text-amber-600" />}
          label="Pending Review"
          value={87}
          iconBg="bg-amber-50"
          textColor="text-amber-700"
        />
        <StatCard
          icon={<XCircle className="w-6 h-6 text-rose-600" />}
          label="Rejected"
          value={57}
          iconBg="bg-rose-50"
          textColor="text-rose-700"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Applications per Month</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyApplications} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="applications" name="Applications" fill="#6366f1" radius={[5, 5, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Program Preference</h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={programDistribution}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={68}
                paddingAngle={3}
                dataKey="value"
              >
                {programDistribution.map((_, idx) => (
                  <Cell key={idx} fill={PIE_COLORS[idx]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
            {programDistribution.map((item, idx) => (
              <span key={idx} className="flex items-center gap-1 text-xs text-slate-600">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: PIE_COLORS[idx] }}
                />
                {item.name} {item.value}%
              </span>
            ))}
          </div>
        </div>

        {/* Line Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-semibold text-slate-700">Approval Rate Trend (%)</h2>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={approvalTrend} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 90]} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="rate"
                name="Approval Rate"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ fill: "#10b981", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        {/* Tabs */}
        <div className="flex items-center gap-1 mb-4 border-b border-slate-100 pb-3">
          {tabs.map((tab) => {
            const count =
              tab === "All"
                ? apps.length
                : apps.filter((a) => a.status === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {tab}
                <span
                  className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === tab ? "bg-indigo-500 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
          <div className="ml-auto text-xs text-slate-400 bg-slate-50 rounded-full px-3 py-1">
            {filteredApps.length} records
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {["#", "Applicant Name", "Phone", "Program", "Applied Date", "Score", "Status", "Action"].map((h) => (
                  <th
                    key={h}
                    className="text-left py-3 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((app, idx) => (
                <tr
                  key={app.id}
                  className={`border-b border-slate-50 hover:bg-slate-50/70 transition-colors ${
                    idx % 2 === 0 ? "" : "bg-slate-50/30"
                  }`}
                >
                  <td className="py-3 px-3 text-slate-400 text-xs">{app.id}</td>
                  <td className="py-3 px-3 font-semibold text-slate-800 whitespace-nowrap">
                    {app.name}
                  </td>
                  <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{app.phone}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${PROGRAM_BADGE[app.program]}`}
                    >
                      {app.program}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{app.appliedDate}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`font-bold ${
                        app.score >= 175
                          ? "text-emerald-600"
                          : app.score >= 160
                          ? "text-amber-600"
                          : "text-rose-500"
                      }`}
                    >
                      {app.score}
                    </span>
                    <span className="text-slate-400 text-xs"> / 200</span>
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="py-3 px-3">
                    {app.status === "Pending" ? (
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleApprove(app.id)}
                          className="flex items-center gap-1 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold px-2.5 py-1 rounded-lg transition-colors"
                        >
                          <Check className="w-3 h-3" /> Approve
                        </button>
                        <button
                          onClick={() => handleReject(app.id)}
                          className="flex items-center gap-1 text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold px-2.5 py-1 rounded-lg transition-colors"
                        >
                          <X className="w-3 h-3" /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">—</span>
                    )}
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

export default AdmissionsManagement;
