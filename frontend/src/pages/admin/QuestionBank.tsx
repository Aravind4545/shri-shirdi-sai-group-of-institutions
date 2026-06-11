import React from "react";
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Database,
  Filter,
  Download,
  Upload,
  Plus,
  BookMarked,
  Award,
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const recentQuestions = [
  {
    id: 1,
    text: "A particle moves in a circular path of radius r with uniform speed v. The acceleration of the particle is…",
    subject: "Physics",
    topic: "Circular Motion",
    difficulty: "Medium",
    addedBy: "Dr. Sharma",
    date: "2026-06-09",
  },
  {
    id: 2,
    text: "Which of the following reagents converts a primary alcohol to an aldehyde without further oxidation?",
    subject: "Chemistry",
    topic: "Oxidation & Reduction",
    difficulty: "Hard",
    addedBy: "Prof. Mehta",
    date: "2026-06-09",
  },
  {
    id: 3,
    text: "If the roots of the quadratic equation 2x² – 5x + k = 0 are equal, find the value of k.",
    subject: "Math",
    topic: "Quadratic Equations",
    difficulty: "Easy",
    addedBy: "Ms. Iyer",
    date: "2026-06-08",
  },
  {
    id: 4,
    text: "The powerhouse of the cell is the mitochondria. Explain how ATP is synthesised during oxidative phosphorylation.",
    subject: "Biology",
    topic: "Cell Biology",
    difficulty: "Hard",
    addedBy: "Dr. Nair",
    date: "2026-06-08",
  },
  {
    id: 5,
    text: "Identify the figure of speech used in: 'The sun rose in the east painting the sky crimson and gold.'",
    subject: "English",
    topic: "Figures of Speech",
    difficulty: "Easy",
    addedBy: "Ms. Kulkarni",
    date: "2026-06-07",
  },
  {
    id: 6,
    text: "Two charges q₁ = +3μC and q₂ = –5μC are separated by a distance of 0.2 m in vacuum. Find the force between them.",
    subject: "Physics",
    topic: "Electrostatics",
    difficulty: "Medium",
    addedBy: "Dr. Sharma",
    date: "2026-06-07",
  },
  {
    id: 7,
    text: "What is the hybridisation of carbon in benzene? Justify with a diagram of the molecular orbital structure.",
    subject: "Chemistry",
    topic: "Chemical Bonding",
    difficulty: "Medium",
    addedBy: "Prof. Mehta",
    date: "2026-06-06",
  },
  {
    id: 8,
    text: "Evaluate ∫₀^π sin²x dx using the reduction formula. Express the answer in its simplest form.",
    subject: "Math",
    topic: "Integral Calculus",
    difficulty: "Hard",
    addedBy: "Ms. Iyer",
    date: "2026-06-06",
  },
  {
    id: 9,
    text: "Who was the first Governor-General of independent India and what was the significance of his role?",
    subject: "History",
    topic: "Modern Indian History",
    difficulty: "Easy",
    addedBy: "Mr. Pillai",
    date: "2026-06-05",
  },
  {
    id: 10,
    text: "Which international organisation was established by the Treaty of Versailles in 1919 to maintain world peace?",
    subject: "GK",
    topic: "World Affairs",
    difficulty: "Easy",
    addedBy: "Mr. Pillai",
    date: "2026-06-05",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const truncate = (str: string, n: number) =>
  str.length > n ? str.slice(0, n) + "…" : str;

const DifficultyBadge = ({ level }: { level: string }) => {
  const map: Record<string, string> = {
    Easy: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    Medium: "bg-amber-100 text-amber-700 border border-amber-200",
    Hard: "bg-red-100 text-red-700 border border-red-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[level] ?? ""}`}
    >
      {level}
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
  value: string;
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



// ─── Page Component ───────────────────────────────────────────────────────────
const QuestionBank: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Database size={26} className="text-indigo-600" />
            Question Bank
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage, review, and analyse all exam questions across subjects &amp; programmes.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
            <Filter size={15} /> Filter
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
            <Upload size={15} /> Import
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
            <Download size={15} /> Export
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition shadow-sm">
            <Plus size={15} /> Add Question
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Database}
          label="Total Questions"
          value="1,35,430"
          sub="Across all subjects"
          color="bg-indigo-500"
        />
        <StatCard
          icon={CheckCircle2}
          label="Easy"
          value="45,210"
          sub="33% of total"
          color="bg-emerald-500"
        />
        <StatCard
          icon={AlertTriangle}
          label="Medium"
          value="62,840"
          sub="47% of total"
          color="bg-amber-500"
        />
        <StatCard
          icon={XCircle}
          label="Hard"
          value="27,380"
          sub="20% of total"
          color="bg-red-500"
        />
      </div>

      {/* Policy & Descriptions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Card 1: Content Coverage & Syllabus Mapping (lg:col-span-2) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                <BookMarked className="w-4 h-4" />
              </div>
              <h2 className="text-base font-semibold text-slate-700">Content Ingestion & Syllabus Alignment</h2>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Standardized question database structured to support Lakshya (JEE), Deekshya (NEET), and DAFNE (Civil Services) curriculums.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs font-semibold text-slate-700">Multi-disciplinary Coverage</p>
                <p className="text-xs text-slate-500 mt-1">
                  Questions are categorised by subject, chapter, and micro-topic. Rigorous metadata tags are applied (e.g. formulas, diagrams) to facilitate precise mock test generation.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs font-semibold text-slate-700">JEE/NEET Competitive Standards</p>
                <p className="text-xs text-slate-500 mt-1">
                  Database contains previous year questions (PYQs) and anticipated patterns. Curated monthly by subject matter experts to match recent NTA test formats.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Quality Rubrics & Difficulty Standards (lg:col-span-1) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Award className="w-4 h-4" />
              </div>
              <h2 className="text-base font-semibold text-slate-700">Quality Control Rubrics</h2>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Validation standards to ensure structural correctness and difficulty rating accuracy.
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs font-semibold text-slate-700">Peer-Review Process</p>
                <p className="text-xs text-slate-500 mt-1">
                  Every new question undergoes three-tier verification (Subject Expert → Proofreader → Technical Admin) before publishing.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs font-semibold text-slate-700">Difficulty Ratio Standard</p>
                <p className="text-xs text-slate-500 mt-1">
                  Maintained ratio of 33% Easy (conceptual), 47% Medium (analytical), and 20% Hard (advanced application).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Questions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <BookOpen size={17} className="text-indigo-500" />
              Recently Added Questions
            </h2>
            <p className="text-xs text-slate-400">Latest 10 questions across the bank</p>
          </div>
          <button className="text-xs text-indigo-600 font-semibold hover:underline">
            View All →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                <th className="px-5 py-3 bg-slate-50 rounded-tl-none">#</th>
                <th className="px-5 py-3 bg-slate-50">Question</th>
                <th className="px-4 py-3 bg-slate-50">Subject</th>
                <th className="px-4 py-3 bg-slate-50">Topic</th>
                <th className="px-4 py-3 bg-slate-50">Difficulty</th>
                <th className="px-4 py-3 bg-slate-50">Added By</th>
                <th className="px-4 py-3 bg-slate-50">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentQuestions.map((q, idx) => (
                <tr
                  key={q.id}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <td className="px-5 py-3 text-slate-400 font-mono text-xs">
                    {String(idx + 1).padStart(2, "0")}
                  </td>
                  <td className="px-5 py-3 max-w-xs">
                    <p className="text-slate-700 font-medium leading-snug">
                      {truncate(q.text, 72)}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
                      {q.subject}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                    {q.topic}
                  </td>
                  <td className="px-4 py-3">
                    <DifficultyBadge level={q.difficulty} />
                  </td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap text-xs">
                    {q.addedBy}
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
                    {q.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Showing 1 – 10 of 1,35,430 questions</span>
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
  );
};

export default QuestionBank;
