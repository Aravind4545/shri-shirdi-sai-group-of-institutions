import React, { useState } from "react";
import { Send, Search, MessageCircle, Phone, MoreVertical, CheckCheck } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: number;
  text: string;
  time: string;
  sent: boolean; // true = sent by admin (right), false = received (left)
}

interface Conversation {
  id: number;
  name: string;
  role: string;
  initials: string;
  avatarBg: string;
  preview: string;
  time: string;
  unread: number;
  messages: Message[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const conversations: Conversation[] = [
  {
    id: 1,
    name: "Dr. Priya Nair",
    role: "Physics Teacher",
    initials: "PN",
    avatarBg: "bg-indigo-500",
    preview: "Can we reschedule the parent meeting?",
    time: "10:42 AM",
    unread: 3,
    messages: [
      { id: 1, text: "Good morning! Hope you're well.", time: "10:30 AM", sent: false },
      { id: 2, text: "Good morning Dr. Nair! Yes, all good. How can I help?", time: "10:31 AM", sent: true },
      { id: 3, text: "I wanted to discuss the upcoming semester schedule for IIT batch.", time: "10:33 AM", sent: false },
      { id: 4, text: "Sure, I'll pull up the timetable. Any specific concern?", time: "10:35 AM", sent: true },
      { id: 5, text: "There's a clash between Physics lab and the UPSC seminar on Friday.", time: "10:38 AM", sent: false },
      { id: 6, text: "Can we reschedule the parent meeting?", time: "10:42 AM", sent: false },
    ],
  },
  {
    id: 2,
    name: "Mr. Rajan Iyer",
    role: "Head of Mathematics",
    initials: "RI",
    avatarBg: "bg-emerald-500",
    preview: "Exam papers have been submitted.",
    time: "9:55 AM",
    unread: 0,
    messages: [
      { id: 1, text: "The mid-term exam papers for Math are ready for review.", time: "9:40 AM", sent: false },
      { id: 2, text: "Thank you Rajan. I'll review them today.", time: "9:45 AM", sent: true },
      { id: 3, text: "Also, two students from NEET batch have requested extra sessions.", time: "9:50 AM", sent: false },
      { id: 4, text: "Approved. Please coordinate with the hostel warden for timing.", time: "9:52 AM", sent: true },
      { id: 5, text: "Exam papers have been submitted.", time: "9:55 AM", sent: false },
    ],
  },
  {
    id: 3,
    name: "Mrs. Kavita Sharma",
    role: "Parent – Arjun Sharma",
    initials: "KS",
    avatarBg: "bg-rose-500",
    preview: "Thank you for the update on Arjun's progress.",
    time: "Yesterday",
    unread: 1,
    messages: [
      { id: 1, text: "Hello, I wanted to inquire about Arjun's performance in recent tests.", time: "Yesterday 3:00 PM", sent: false },
      { id: 2, text: "Hello Mrs. Sharma! Arjun scored 88% in Physics and 91% in Chemistry this month.", time: "Yesterday 3:05 PM", sent: true },
      { id: 3, text: "That's great to hear! Is he on track for the entrance exam?", time: "Yesterday 3:07 PM", sent: false },
      { id: 4, text: "Absolutely. His ranking is in the top 15 of the IIT batch.", time: "Yesterday 3:10 PM", sent: true },
      { id: 5, text: "Thank you for the update on Arjun's progress.", time: "Yesterday 3:12 PM", sent: false },
    ],
  },
  {
    id: 4,
    name: "Dr. Meena Pillai",
    role: "HOD – Biology",
    initials: "MP",
    avatarBg: "bg-violet-500",
    preview: "Lab equipment list sent to procurement.",
    time: "Yesterday",
    unread: 0,
    messages: [
      { id: 1, text: "We need new microscopes for the NEET batch labs.", time: "Yesterday 11:00 AM", sent: false },
      { id: 2, text: "I've noted the requirement. Please share the specifications.", time: "Yesterday 11:05 AM", sent: true },
      { id: 3, text: "Sharing the list now. We need 10 compound microscopes.", time: "Yesterday 11:10 AM", sent: false },
      { id: 4, text: "Forwarded to procurement. Expected delivery in 2 weeks.", time: "Yesterday 11:15 AM", sent: true },
      { id: 5, text: "Lab equipment list sent to procurement.", time: "Yesterday 11:20 AM", sent: false },
    ],
  },
  {
    id: 5,
    name: "Mr. Suresh Nambiar",
    role: "Parent – Neha Nambiar",
    initials: "SN",
    avatarBg: "bg-amber-500",
    preview: "Will Neha be eligible for the scholarship?",
    time: "Mon",
    unread: 2,
    messages: [
      { id: 1, text: "Good afternoon. I had a question about the scholarship criteria.", time: "Mon 2:00 PM", sent: false },
      { id: 2, text: "Hello Mr. Nambiar! Happy to help. What would you like to know?", time: "Mon 2:05 PM", sent: true },
      { id: 3, text: "Will Neha be eligible for the scholarship?", time: "Mon 2:08 PM", sent: false },
    ],
  },
  {
    id: 6,
    name: "Ms. Sunita Rao",
    role: "Chemistry Teacher",
    initials: "SR",
    avatarBg: "bg-teal-500",
    preview: "Lesson plan for next week uploaded.",
    time: "Mon",
    unread: 0,
    messages: [
      { id: 1, text: "I've uploaded the lesson plan for next week on the portal.", time: "Mon 9:00 AM", sent: false },
      { id: 2, text: "Great, thank you Sunita. I'll review and approve it.", time: "Mon 9:10 AM", sent: true },
      { id: 3, text: "Lesson plan for next week uploaded.", time: "Mon 9:00 AM", sent: false },
    ],
  },
  {
    id: 7,
    name: "Admin Committee",
    role: "Internal Group",
    initials: "AC",
    avatarBg: "bg-slate-600",
    preview: "Annual day event planning meeting at 4 PM.",
    time: "Sun",
    unread: 0,
    messages: [
      { id: 1, text: "Reminder: Annual day planning meeting tomorrow at 4 PM in the conference room.", time: "Sun 10:00 AM", sent: false },
      { id: 2, text: "Confirmed. I'll be there.", time: "Sun 10:05 AM", sent: true },
      { id: 3, text: "Annual day event planning meeting at 4 PM.", time: "Sun 10:00 AM", sent: false },
    ],
  },
  {
    id: 8,
    name: "Mrs. Deepa Reddy",
    role: "HOD – English",
    initials: "DR",
    avatarBg: "bg-pink-500",
    preview: "Creative writing contest entries are in.",
    time: "Sat",
    unread: 0,
    messages: [
      { id: 1, text: "All entries for the creative writing contest have been received.", time: "Sat 3:00 PM", sent: false },
      { id: 2, text: "Wonderful! How many entries did we get?", time: "Sat 3:05 PM", sent: true },
      { id: 3, text: "47 entries across UPSC, IIT and NEET batches!", time: "Sat 3:07 PM", sent: false },
      { id: 4, text: "That's great participation. Please arrange the judging panel.", time: "Sat 3:10 PM", sent: true },
      { id: 5, text: "Creative writing contest entries are in.", time: "Sat 3:00 PM", sent: false },
    ],
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────

const AdminMessages: React.FC = () => {
  const [selectedId, setSelectedId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const [allConversations, setAllConversations] = useState<Conversation[]>(conversations);

  const selected = allConversations.find((c) => c.id === selectedId) ?? allConversations[0];

  const filteredConvos = allConversations.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalMessages = 1842;
  const totalUnread = allConversations.reduce((sum, c) => sum + c.unread, 0);
  const sentToday = 45;

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setAllConversations((prev) =>
      prev.map((c) => {
        if (c.id !== selectedId) return c;
        return {
          ...c,
          preview: text,
          time: timeStr,
          messages: [
            ...c.messages,
            { id: c.messages.length + 1, text, time: timeStr, sent: true },
          ],
        };
      })
    );
    setInputText("");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col gap-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Messages</h1>
        <p className="text-slate-500 text-sm mt-1">
          Admin communication hub — Aashvee ERP
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Messages", value: totalMessages.toLocaleString(), color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Unread", value: totalUnread, color: "text-rose-600", bg: "bg-rose-50" },
          { label: "Sent Today", value: sentToday, color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((s) => (
          <div
            key={s.label}
            className={`${s.bg} rounded-2xl border border-slate-100 p-4 flex items-center gap-3`}
          >
            <MessageCircle className={`w-5 h-5 ${s.color}`} />
            <div>
              <p className="text-xs text-slate-500 font-medium">{s.label}</p>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Two-panel Layout */}
      <div className="flex gap-4 flex-1" style={{ minHeight: "560px" }}>
        {/* ── Sidebar ── */}
        <div className="w-80 flex-shrink-0 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-slate-100">
            <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none flex-1"
                placeholder="Search conversations…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConvos.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`w-full text-left px-4 py-3 flex items-start gap-3 border-b border-slate-50 transition-colors ${
                  selectedId === c.id
                    ? "bg-indigo-50 border-l-4 border-l-indigo-500"
                    : "hover:bg-slate-50 border-l-4 border-l-transparent"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold ${c.avatarBg}`}
                >
                  {c.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-semibold text-slate-800 truncate">{c.name}</span>
                    <span className="text-xs text-slate-400 ml-1 flex-shrink-0">{c.time}</span>
                  </div>
                  <p className="text-xs text-slate-400">{c.role}</p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{c.preview}</p>
                </div>
                {c.unread > 0 && (
                  <span className="bg-indigo-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-1">
                    {c.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Chat Panel ── */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-white">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${selected.avatarBg}`}
            >
              {selected.initials}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-800">{selected.name}</p>
              <p className="text-xs text-slate-400">{selected.role}</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded-xl hover:bg-slate-100 text-slate-400">
                <Phone className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-xl hover:bg-slate-100 text-slate-400">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3 bg-slate-50/50">
            {selected.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}
              >
                {!msg.sent && (
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 self-end ${selected.avatarBg}`}
                  >
                    {selected.initials}
                  </div>
                )}
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                    msg.sent
                      ? "bg-indigo-600 text-white rounded-br-sm"
                      : "bg-white text-slate-700 rounded-bl-sm border border-slate-100"
                  }`}
                >
                  <p>{msg.text}</p>
                  <div
                    className={`flex items-center gap-1 mt-1 ${
                      msg.sent ? "justify-end" : "justify-start"
                    }`}
                  >
                    <span
                      className={`text-xs ${
                        msg.sent ? "text-indigo-200" : "text-slate-400"
                      }`}
                    >
                      {msg.time}
                    </span>
                    {msg.sent && (
                      <CheckCheck className="w-3 h-3 text-indigo-200" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="px-5 py-4 border-t border-slate-100 bg-white">
            <div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-2.5 border border-slate-200">
              <input
                className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
                placeholder="Type a message…"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className="w-8 h-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center transition-colors"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
