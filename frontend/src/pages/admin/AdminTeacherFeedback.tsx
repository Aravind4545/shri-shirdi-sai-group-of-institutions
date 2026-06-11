import React from "react";
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
  MessageSquare,
  Star,
  AlertTriangle,
  ThumbsUp,
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const departmentRatings = [
  { department: "Physics", avgRating: 4.2 },
  { department: "Chemistry", avgRating: 4.5 },
  { department: "Math", avgRating: 4.1 },
  { department: "Biology", avgRating: 4.6 },
  { department: "English", avgRating: 4.8 },
];

const ratingDistribution = [
  { name: "5★", value: 44 },
  { name: "4★", value: 30 },
  { name: "3★", value: 16 },
  { name: "2★", value: 7 },
  { name: "1★", value: 3 },
];

const PIE_COLORS = ["#10b981", "#6366f1", "#f59e0b", "#f97316", "#ef4444"];

const recentFeedback = [
  {
    id: 1,
    student: "Arjun Sharma",
    teacher: "Dr. Priya Nair",
    department: "Physics",
    rating: 5,
    text: "Excellent teaching style, very clear explanations of complex concepts.",
    date: "10 Jun 2026",
  },
  {
    id: 2,
    student: "Neha Patel",
    teacher: "Mr. Rajan Iyer",
    department: "Math",
    rating: 4,
    text: "Good sessions overall, but could use more practice problems in class.",
    date: "09 Jun 2026",
  },
  {
    id: 3,
    student: "Rahul Verma",
    teacher: "Ms. Sunita Rao",
    department: "Chemistry",
    rating: 5,
    text: "Amazing lab sessions, hands-on experiments made learning very engaging.",
    date: "09 Jun 2026",
  },
  {
    id: 4,
    student: "Anjali Mehta",
    teacher: "Dr. Kiran Bose",
    department: "Biology",
    rating: 3,
    text: "Topics are covered but pace is a bit too fast for difficult chapters.",
    date: "08 Jun 2026",
  },
  {
    id: 5,
    student: "Vikram Singh",
    teacher: "Mrs. Deepa Pillai",
    department: "English",
    rating: 5,
    text: "Truly inspiring teacher! Literature analysis sessions are exceptional.",
    date: "08 Jun 2026",
  },
  {
    id: 6,
    student: "Priya Krishnan",
    teacher: "Dr. Priya Nair",
    department: "Physics",
    rating: 4,
    text: "Very knowledgeable, numerical sessions are particularly helpful.",
    date: "07 Jun 2026",
  },
  {
    id: 7,
    student: "Suresh Kumar",
    teacher: "Mr. Rajan Iyer",
    department: "Math",
    rating: 2,
    text: "Concepts not explained thoroughly. Need more examples during lectures.",
    date: "07 Jun 2026",
  },
  {
    id: 8,
    student: "Divya Nambiar",
    teacher: "Ms. Sunita Rao",
    department: "Chemistry",
    rating: 5,
    text: "Best chemistry teacher I've had. Makes organic chemistry feel simple!",
    date: "06 Jun 2026",
  },
  {
    id: 9,
    student: "Arun Joshi",
    teacher: "Dr. Kiran Bose",
    department: "Biology",
    rating: 4,
    text: "Diagrams and visual aids used in class make understanding much easier.",
    date: "06 Jun 2026",
  },
  {
    id: 10,
    student: "Meera Balakrishnan",
    teacher: "Mrs. Deepa Pillai",
    department: "English",
    rating: 5,
    text: "Writing workshops are fantastic. My essay skills have improved greatly.",
    date: "05 Jun 2026",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  iconBg: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, sub, iconBg }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const StarDisplay: React.FC<{ rating: number }> = ({ rating }) => (
  <span className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <span
        key={s}
        className={s <= rating ? "text-amber-400" : "text-slate-200"}
        style={{ fontSize: "15px" }}
      >
        ★
      </span>
    ))}
  </span>
);

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-md px-4 py-2 text-sm">
        <p className="font-semibold text-slate-700">{label}</p>
        <p className="text-indigo-600">Avg Rating: {payload[0].value}/5</p>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-md px-4 py-2 text-sm">
        <p className="font-semibold text-slate-700">{payload[0].name}</p>
        <p style={{ color: payload[0].payload.fill }}>{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

// ─── Main Component ───────────────────────────────────────────────────────────

const AdminTeacherFeedback: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Teacher Feedback</h1>
        <p className="text-slate-500 text-sm mt-1">
          Monitor student feedback and ratings across all departments — Aashvee ERP
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<MessageSquare className="w-6 h-6 text-indigo-600" />}
          label="Total Feedback"
          value="2,845"
          sub="This academic year"
          iconBg="bg-indigo-50"
        />
        <StatCard
          icon={<Star className="w-6 h-6 text-amber-500" />}
          label="Avg Rating"
          value="4.3 / 5"
          sub="Across all departments"
          iconBg="bg-amber-50"
        />
        <StatCard
          icon={<ThumbsUp className="w-6 h-6 text-emerald-600" />}
          label="5-Star Reviews"
          value="1,245"
          sub="43.8% of total"
          iconBg="bg-emerald-50"
        />
        <StatCard
          icon={<AlertTriangle className="w-6 h-6 text-rose-500" />}
          label="Concerns Raised"
          value="89"
          sub="Require follow-up"
          iconBg="bg-rose-50"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
        {/* Bar Chart – 3 cols */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h2 className="text-base font-semibold text-slate-700 mb-4">
            Average Rating by Department
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={departmentRatings}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="department"
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 5]}
                ticks={[0, 1, 2, 3, 4, 5]}
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar dataKey="avgRating" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart – 2 cols */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h2 className="text-base font-semibold text-slate-700 mb-4">
            Rating Distribution
          </h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={ratingDistribution}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {ratingDistribution.map((_, idx) => (
                  <Cell key={idx} fill={PIE_COLORS[idx]} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
            {ratingDistribution.map((item, idx) => (
              <span key={idx} className="flex items-center gap-1 text-xs text-slate-600">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: PIE_COLORS[idx] }}
                />
                {item.name} ({item.value}%)
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Feedback Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-700">Recent Feedback Entries</h2>
          <span className="text-xs text-slate-400 bg-slate-100 rounded-full px-3 py-1">
            Showing latest 10
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {["Student", "Teacher", "Department", "Rating", "Feedback", "Date"].map((h) => (
                  <th
                    key={h}
                    className="text-left py-3 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentFeedback.map((entry, idx) => (
                <tr
                  key={entry.id}
                  className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${
                    idx % 2 === 0 ? "" : "bg-slate-50/40"
                  }`}
                >
                  <td className="py-3 px-3 font-medium text-slate-800 whitespace-nowrap">
                    {entry.student}
                  </td>
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{entry.teacher}</td>
                  <td className="py-3 px-3">
                    <span className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-full">
                      {entry.department}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <StarDisplay rating={entry.rating} />
                  </td>
                  <td className="py-3 px-3 text-slate-500 max-w-xs">
                    <span className="block truncate" title={entry.text}>
                      {entry.text}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 whitespace-nowrap">{entry.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTeacherFeedback;
