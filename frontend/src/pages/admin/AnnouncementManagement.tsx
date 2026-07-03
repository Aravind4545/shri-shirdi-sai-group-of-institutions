import React, { useState } from "react";
import {
  Megaphone,
  Bell,
  CalendarDays,
  AlertCircle,
  Plus,
  X,
  CheckCircle2,
  Clock,
  ArchiveX,
  ChevronDown,
  Search,
  Filter,
  FileText,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Priority = "High" | "Medium" | "Low";
type Status = "Active" | "Draft" | "Expired";
type Target = "All" | "IIT" | "NEET" | "UPSC" | "Teachers";

interface Announcement {
  id: number;
  title: string;
  target: Target;
  priority: Priority;
  createdDate: string;
  status: Status;
  author: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const initialAnnouncements: Announcement[] = [
  {
    id: 1,
    title: "JEE Main 2026 – Mock Test Series Schedule Released",
    target: "IIT",
    priority: "High",
    createdDate: "2026-06-09",
    status: "Active",
    author: "Admin",
  },
  {
    id: 2,
    title: "NEET PG Orientation Session – All NEET Students Mandatory",
    target: "NEET",
    priority: "High",
    createdDate: "2026-06-08",
    status: "Active",
    author: "Dr. Nair",
  },
  {
    id: 3,
    title: "Annual Sports Day 2026 – Registration Open for All Students",
    target: "All",
    priority: "Medium",
    createdDate: "2026-06-07",
    status: "Active",
    author: "Admin",
  },
  {
    id: 4,
    title: "UPSC Prelims Strategy Workshop – UPSC Batch Only",
    target: "UPSC",
    priority: "High",
    createdDate: "2026-06-07",
    status: "Active",
    author: "Prof. Shukla",
  },
  {
    id: 5,
    title: "Faculty Meeting – June Curriculum Review (All Teachers)",
    target: "Teachers",
    priority: "High",
    createdDate: "2026-06-06",
    status: "Active",
    author: "Principal",
  },
  {
    id: 6,
    title: "Library System Maintenance – 10 June (Saturday) 8 AM–12 PM",
    target: "All",
    priority: "Medium",
    createdDate: "2026-06-05",
    status: "Active",
    author: "IT Dept.",
  },
  {
    id: 7,
    title: "Fee Reminder: Last Date for Q2 Payment is 15 June 2026",
    target: "All",
    priority: "High",
    createdDate: "2026-06-04",
    status: "Active",
    author: "Accounts",
  },
  {
    id: 8,
    title: "New Study Material Uploaded – Organic Chemistry Vol. 3",
    target: "NEET",
    priority: "Medium",
    createdDate: "2026-06-03",
    status: "Draft",
    author: "Prof. Mehta",
  },
  {
    id: 9,
    title: "Motivational Webinar – 'Cracking UPSC in First Attempt'",
    target: "UPSC",
    priority: "Low",
    createdDate: "2026-05-30",
    status: "Expired",
    author: "Admin",
  },
  {
    id: 10,
    title: "Holiday Notice: Institution Closed on 12 June – Founders Day",
    target: "All",
    priority: "Medium",
    createdDate: "2026-05-28",
    status: "Expired",
    author: "Admin",
  },
];


// ─── Helpers / Badges ─────────────────────────────────────────────────────────
const PriorityBadge = ({ level }: { level: Priority }) => {
  const map: Record<Priority, string> = {
    High: "bg-red-100 text-red-700 border border-red-200",
    Medium: "bg-amber-100 text-amber-700 border border-amber-200",
    Low: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[level]}`}>
      {level}
    </span>
  );
};

const StatusBadge = ({ status }: { status: Status }) => {
  const map: Record<Status, { cls: string; icon: React.ReactNode }> = {
    Active: {
      cls: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      icon: <CheckCircle2 size={11} className="mr-1" />,
    },
    Draft: {
      cls: "bg-slate-100 text-slate-600 border border-slate-200",
      icon: <Clock size={11} className="mr-1" />,
    },
    Expired: {
      cls: "bg-gray-100 text-gray-500 border border-gray-200",
      icon: <ArchiveX size={11} className="mr-1" />,
    },
  };
  const { cls, icon } = map[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {icon}{status}
    </span>
  );
};

const TargetTag = ({ target }: { target: Target }) => {
  const map: Record<Target, string> = {
    All: "bg-indigo-50 text-indigo-700 border border-indigo-100",
    IIT: "bg-blue-50 text-blue-700 border border-blue-100",
    NEET: "bg-purple-50 text-purple-700 border border-purple-100",
    UPSC: "bg-teal-50 text-teal-700 border border-teal-100",
    Teachers: "bg-orange-50 text-orange-700 border border-orange-100",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold ${map[target]}`}>
      {target}
    </span>
  );
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4">
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-slate-800 leading-tight">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

// ─── Add Announcement Modal ───────────────────────────────────────────────────
interface ModalProps {
  onClose: () => void;
  onAdd: (a: Announcement) => void;
}

const AddAnnouncementModal: React.FC<ModalProps> = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({
    title: "",
    content: "",
    target: "All" as Target,
    priority: "Medium" as Priority,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.content.trim()) e.content = "Content is required.";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const newItem: Announcement = {
      id: Date.now(),
      title: form.title,
      target: form.target,
      priority: form.priority,
      createdDate: new Date().toISOString().slice(0, 10),
      status: "Active",
      author: "Admin",
    };
    onAdd(newItem);
    onClose();
  };

  const inputCls =
    "w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-slate-50 placeholder-slate-400";
  const labelCls = "block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition"
        >
          <X size={20} />
        </button>
        <div className="flex items-center gap-2 mb-5">
          <div className="p-2 rounded-xl bg-indigo-100">
            <Megaphone size={18} className="text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">New Announcement</h3>
            <p className="text-xs text-slate-400">Fill in the details below</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className={labelCls}>Title</label>
            <input
              type="text"
              className={`${inputCls} ${errors.title ? "border-red-300 ring-1 ring-red-200" : ""}`}
              placeholder="Enter announcement title…"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Content */}
          <div>
            <label className={labelCls}>Content</label>
            <textarea
              rows={4}
              className={`${inputCls} resize-none ${errors.content ? "border-red-300 ring-1 ring-red-200" : ""}`}
              placeholder="Type announcement content here…"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
            {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
          </div>

          {/* Target + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Target Audience</label>
              <div className="relative">
                <select
                  className={`${inputCls} appearance-none pr-8`}
                  value={form.target}
                  onChange={(e) => setForm({ ...form, target: e.target.value as Target })}
                >
                  {(["All", "IIT", "NEET", "UPSC", "Teachers"] as Target[]).map(
                    (t) => <option key={t}>{t}</option>
                  )}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Priority</label>
              <div className="relative">
                <select
                  className={`${inputCls} appearance-none pr-8`}
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}
                >
                  {(["High", "Medium", "Low"] as Priority[]).map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition shadow-sm"
            >
              Publish Announcement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};



// ─── Page Component ───────────────────────────────────────────────────────────
const AnnouncementManagement: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const handleAdd = (a: Announcement) => {
    setAnnouncements((prev) => [a, ...prev]);
  };

  const filtered = announcements.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = announcements.filter((a) => a.status === "Active").length;
  const thisWeek = announcements.filter((a) => {
    const d = new Date(a.createdDate);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return d >= weekAgo;
  }).length;
  const highPriority = announcements.filter((a) => a.priority === "High").length;

  return (
    <>
      {showModal && (
        <AddAnnouncementModal onClose={() => setShowModal(false)} onAdd={handleAdd} />
      )}

      <div className="min-h-screen bg-slate-50 p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Megaphone size={26} className="text-indigo-600" />
              Announcement Management
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Create, manage and track all announcements across Aashvee programmes.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition shadow-sm self-start sm:self-auto"
          >
            <Plus size={15} /> Add Announcement
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Megaphone}
            label="Total Announcements"
            value={announcements.length}
            sub="Across all programmes"
            color="bg-indigo-500"
          />
          <StatCard
            icon={CheckCircle2}
            label="Active"
            value={activeCount}
            sub="Currently live"
            color="bg-emerald-500"
          />
          <StatCard
            icon={CalendarDays}
            label="This Week"
            value={thisWeek}
            sub="In the last 7 days"
            color="bg-blue-500"
          />
          <StatCard
            icon={AlertCircle}
            label="High Priority"
            value={highPriority}
            sub="Requiring attention"
            color="bg-red-500"
          />
        </div>

        {/* Previous Announcements & Metrics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Card 1: Previous Announcements (lg:col-span-2) */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-semibold text-slate-700">Previous Announcements Log</h2>
                </div>
                <span className="text-xs text-slate-400 font-medium">History (Expired / Archived)</span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                A historical log of expired announcements previously broadcasted to various student batches and programs.
              </p>
              
              <div className="space-y-2.5 max-h-[200px] overflow-y-auto pr-1">
                {announcements.filter(a => a.status === "Expired").length > 0 ? (
                  announcements.filter(a => a.status === "Expired").map(a => (
                    <div key={a.id} className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100/70 transition-colors flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold text-slate-700 line-clamp-1">{a.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-medium text-slate-400">Created: {a.createdDate}</span>
                          <span className="text-[10px] font-medium text-slate-400">• By: {a.author}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <TargetTag target={a.target} />
                        <StatusBadge status={a.status} />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-6">No expired announcements in history.</p>
                )}
              </div>
            </div>
          </div>

          {/* Card 2: Summary Metrics & Archive Rules (lg:col-span-1) */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h2 className="text-base font-semibold text-slate-700">Database Summary</h2>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Global metrics for announcements compiled across all programs and categories.
              </p>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 font-medium">Total Announcements Created</span>
                  <span className="font-bold text-slate-800">{announcements.length}</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 font-medium">Active (Currently Live)</span>
                  <span className="font-bold text-emerald-600">{activeCount}</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 font-medium">Draft Mode (Unpublished)</span>
                  <span className="font-bold text-amber-600">
                    {announcements.filter(a => a.status === "Draft").length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 font-medium">Archived / Expired</span>
                  <span className="font-bold text-slate-550 text-slate-500">
                    {announcements.filter(a => a.status === "Expired").length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Announcements Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
          {/* Table Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-semibold text-slate-800">All Announcements</h2>
              <p className="text-xs text-slate-400">
                {filtered.length} of {announcements.length} entries
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search announcements…"
                  className="pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 w-52"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
                <Filter size={14} /> Filter
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  <th className="px-5 py-3 bg-slate-50">#</th>
                  <th className="px-5 py-3 bg-slate-50">Title</th>
                  <th className="px-4 py-3 bg-slate-50">Target</th>
                  <th className="px-4 py-3 bg-slate-50">Priority</th>
                  <th className="px-4 py-3 bg-slate-50">Created</th>
                  <th className="px-4 py-3 bg-slate-50">Status</th>
                  <th className="px-4 py-3 bg-slate-50">Author</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.slice(0, 10).map((a, idx) => (
                  <tr
                    key={a.id}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3 text-slate-400 font-mono text-xs">
                      {String(idx + 1).padStart(2, "0")}
                    </td>
                    <td className="px-5 py-3 max-w-xs">
                      <p className="text-slate-700 font-medium leading-snug line-clamp-1">
                        {a.title}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <TargetTag target={a.target} />
                    </td>
                    <td className="px-4 py-3">
                      <PriorityBadge level={a.priority} />
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
                      {a.createdDate}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                      {a.author}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing 1 – {Math.min(10, filtered.length)} of {filtered.length} announcements
            </span>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition">
                ← Prev
              </button>
              <button className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition">
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnnouncementManagement;
