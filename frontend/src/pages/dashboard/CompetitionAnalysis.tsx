import React, { useState } from 'react';
import { 
  Trophy, Target, TrendingUp, BookOpen, UserCircle, Users, Activity,
  AlertCircle, ArrowUpRight, CheckCircle2, ChevronDown, Download, Bell, HelpCircle, Calendar
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from 'recharts';

const CompetitionAnalysis = () => {
  const [timeFilter, setTimeFilter] = useState('This Month');
  const [subjectFilter, setSubjectFilter] = useState('All Subjects');

  // Dummy Data for Charts
  const radarData = [
    { subject: 'Physics', you: 80, classAvg: 60, fullMark: 100 },
    { subject: 'Chemistry', you: 70, classAvg: 55, fullMark: 100 },
    { subject: 'Mathematics', you: 90, classAvg: 65, fullMark: 100 },
    { subject: 'Biology', you: 65, classAvg: 70, fullMark: 100 },
    { subject: 'English', you: 85, classAvg: 75, fullMark: 100 },
  ];

  const classData = [
    { name: '12-A', value: 82.4 },
    { name: '12-B', value: 76.1 },
    { name: '12-C', value: 91.7 },
    { name: '12-D', value: 68.9 },
    { name: '12-E', value: 61.3 },
  ];

  const sectionData = [
    { name: 'A', value: 89.4 },
    { name: 'B', value: 76.8 },
    { name: 'C', value: 64.2 },
    { name: 'D', value: 60.1 },
    { name: 'E', value: 53.6 },
  ];

  const trendData = [
    { week: 'Week 1', you: 45, classAvg: 62 },
    { week: 'Week 2', you: 48, classAvg: 66 },
    { week: 'Week 3', you: 52, classAvg: 70 },
    { week: 'Week 4', you: 56, classAvg: 74 },
    { week: 'Week 5', you: 59, classAvg: 76 },
    { week: 'Week 6', you: 62, classAvg: 82 },
  ];

  const weakTopics = [
    { topic: 'Integration', subject: 'Mathematics', accuracy: 42, priority: 'High' },
    { topic: 'Current Electricity', subject: 'Physics', accuracy: 48, priority: 'High' },
    { topic: 'Chemical Equilibrium', subject: 'Chemistry', accuracy: 51, priority: 'High' },
    { topic: 'Plant Physiology', subject: 'Biology', accuracy: 55, priority: 'Medium' },
    { topic: 'Geometry', subject: 'Mathematics', accuracy: 58, priority: 'Medium' },
  ];

  const subjectWise = [
    { subject: 'Mathematics', you: 84, classAvg: 64, topper: 96, rank: 2, color: '#3b82f6' },
    { subject: 'Physics', you: 76, classAvg: 58, topper: 94, rank: 3, color: '#8b5cf6' },
    { subject: 'Chemistry', you: 72, classAvg: 54, topper: 92, rank: 5, color: '#f59e0b' },
    { subject: 'Biology', you: 81, classAvg: 60, topper: 93, rank: 2, color: '#10b981' },
    { subject: 'English', you: 79, classAvg: 62, topper: 95, rank: 4, color: '#0ea5e9' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-slate-50 min-h-screen p-4 md:p-6 rounded-3xl">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Trophy className="w-8 h-8 text-indigo-600" /> COMPETITION ANALYSIS
          </h1>
          <p className="text-slate-500 font-medium mt-1">Analyze. Compare. Improve. Stay ahead of the competition!</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-4 py-2 border border-slate-200 rounded-xl cursor-pointer shadow-sm hover:bg-slate-50">
            <UserCircle className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-bold text-slate-700">{subjectFilter}</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 border border-slate-200 rounded-xl cursor-pointer shadow-sm hover:bg-slate-50">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-bold text-slate-700">{timeFilter}</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-8 border-b border-slate-200 pb-2 custom-scrollbar">
        <button className="text-sm font-bold text-indigo-600 border-b-2 border-indigo-600 pb-2 whitespace-nowrap">Overview</button>
        <button className="text-sm font-bold text-slate-500 hover:text-slate-800 pb-2 whitespace-nowrap">Students vs Students</button>
        <button className="text-sm font-bold text-slate-500 hover:text-slate-800 pb-2 whitespace-nowrap">Class vs Class</button>
        <button className="text-sm font-bold text-slate-500 hover:text-slate-800 pb-2 whitespace-nowrap">Section vs Section</button>
        <button className="text-sm font-bold text-slate-500 hover:text-slate-800 pb-2 whitespace-nowrap">Mains vs NEET</button>
        <button className="text-sm font-bold text-slate-500 hover:text-slate-800 pb-2 whitespace-nowrap">Trend Analysis</button>
        <button className="text-sm font-bold text-slate-500 hover:text-slate-800 pb-2 whitespace-nowrap">Insights & Focus</button>
      </div>

      {/* Top Stats Banner */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500">
            <UserCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Your Rank</p>
            <p className="text-xl font-black text-slate-800">82.4</p>
            <p className="text-xs font-bold text-emerald-500">Top 18%</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Total Tests</p>
            <p className="text-xl font-black text-slate-800">2,856</p>
            <p className="text-xs font-bold text-slate-400">Out of 3,482</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-500">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Tests Taken</p>
            <p className="text-xl font-black text-slate-800">24</p>
            <p className="text-xs font-bold text-emerald-500 flex items-center"><ArrowUpRight className="w-3 h-3"/> 4 this month</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Average Score</p>
            <p className="text-xl font-black text-slate-800">76.8%</p>
            <p className="text-xs font-bold text-emerald-500 flex items-center"><ArrowUpRight className="w-3 h-3"/> 8.4% this month</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-500">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Top Subject</p>
            <p className="text-sm font-black text-slate-800 mt-1">Mathematics</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-500">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Accuracy</p>
            <p className="text-xl font-black text-slate-800">82.3%</p>
            <p className="text-xs font-bold text-emerald-500 flex items-center"><ArrowUpRight className="w-3 h-3"/> 6.1% this month</p>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Radar Chart */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-indigo-500" /> STUDENTS VS STUDENTS
          </h3>
          <div className="flex justify-between items-center mb-2 px-2">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">You</div>
               <div>
                 <p className="text-xs font-bold text-slate-400 uppercase">Your Score</p>
                 <p className="text-xl font-black text-indigo-600">82.4 <span className="text-xs text-emerald-500">Top 18%</span></p>
               </div>
            </div>
            <div className="text-right">
               <p className="text-xs font-bold text-slate-400 uppercase">Class Average</p>
               <p className="text-xl font-black text-slate-800">64.7 <span className="text-xs text-slate-400">Out of 100</span></p>
            </div>
          </div>
          <div className="h-48 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                <Radar name="You" dataKey="you" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                <Radar name="Class Avg" dataKey="classAvg" stroke="#94a3b8" strokeDasharray="3 3" fill="none" />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs font-bold text-emerald-600 text-center mt-2 flex justify-center items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> You are performing better than 82% of your class!
          </p>
        </div>

        {/* Class vs Class */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-blue-500" /> CLASS VS CLASS
          </h3>
          <div className="flex justify-between items-center mb-4 px-2">
            <div>
               <p className="text-xs font-bold text-slate-400 uppercase">Your Class</p>
               <p className="text-xl font-black text-blue-600">82.4 <span className="text-xs text-emerald-500">Top 3</span></p>
            </div>
            <div className="text-right">
               <p className="text-xs font-bold text-slate-400 uppercase">Top Class</p>
               <p className="text-xl font-black text-slate-800">91.7 <span className="text-xs text-slate-400">Class 12 - C</span></p>
            </div>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 100]} />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={24}>
                  {classData.map((entry, index) => (
                    <cell key={`cell-${index}`} fill={entry.name === '12-A' ? '#6366f1' : '#cbd5e1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs font-bold text-emerald-600 text-center mt-2 flex justify-center items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> You are in Top 3 in your grade!
          </p>
        </div>

        {/* Section vs Section */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-emerald-500" /> SECTION VS SECTION
          </h3>
          <div className="flex justify-between items-center mb-4 px-2">
            <div>
               <p className="text-xs font-bold text-slate-400 uppercase">Your Section</p>
               <p className="text-xl font-black text-emerald-600">76.8% <span className="text-xs text-emerald-500">Top 2</span></p>
            </div>
            <div className="text-right">
               <p className="text-xs font-bold text-slate-400 uppercase">Top Section</p>
               <p className="text-xl font-black text-slate-800">89.4% <span className="text-xs text-slate-400">Section - A</span></p>
            </div>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectionData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 100]} />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={24}>
                  {sectionData.map((entry, index) => (
                    <cell key={`cell-${index}`} fill={entry.name === 'B' ? '#6366f1' : '#cbd5e1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs font-bold text-emerald-600 text-center mt-2 flex justify-center items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> You are ahead of 78% of your section!
          </p>
        </div>

        {/* Mains vs NEET Comparison */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
          <h3 className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-emerald-500" /> MAINS VS NEET COMPARISON
          </h3>
          <div className="flex-1 border border-slate-100 rounded-xl overflow-hidden">
            <div className="grid grid-cols-3 bg-slate-50 p-3 border-b border-slate-100 text-xs font-bold text-slate-500">
              <div></div>
              <div className="text-center text-blue-600 uppercase">JEE Mains</div>
              <div className="text-center text-indigo-600 uppercase">NEET</div>
            </div>
            <div className="grid grid-cols-3 p-3 border-b border-slate-50 items-center text-sm font-medium">
              <div className="text-slate-500 font-bold text-xs">Score</div>
              <div className="text-center font-black text-slate-800">76.6%</div>
              <div className="text-center font-bold text-slate-600">72.3%</div>
            </div>
            <div className="grid grid-cols-3 p-3 border-b border-slate-50 items-center text-sm font-medium">
              <div className="text-slate-500 font-bold text-xs">Percentile</div>
              <div className="text-center font-black text-slate-800">78%</div>
              <div className="text-center font-bold text-slate-600">72%</div>
            </div>
            <div className="grid grid-cols-3 p-3 border-b border-slate-50 items-center text-sm font-medium">
              <div className="text-slate-500 font-bold text-xs">Avg. Accuracy</div>
              <div className="text-center font-black text-slate-800">82.6%</div>
              <div className="text-center font-bold text-slate-600">65.8%</div>
            </div>
            <div className="grid grid-cols-3 p-3 items-center text-sm font-medium">
              <div className="text-slate-500 font-bold text-xs">Tests Taken</div>
              <div className="text-center font-black text-slate-800">24</div>
              <div className="text-center font-bold text-slate-600">18</div>
            </div>
          </div>
          <p className="text-xs font-bold text-emerald-600 text-center mt-4 flex justify-center items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> You have a strong performance in JEE Mains!
          </p>
        </div>

        {/* Subject Wise Comparison */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-emerald-500" /> SUBJECT WISE COMPARISON
          </h3>
          <div className="w-full">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
                  <th className="pb-2">Subject</th>
                  <th className="pb-2"></th>
                  <th className="pb-2 text-center">You</th>
                  <th className="pb-2 text-center">Class Avg</th>
                  <th className="pb-2 text-center">Topper</th>
                  <th className="pb-2 text-center">Rank</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {subjectWise.map((s, i) => (
                  <tr key={i} className="text-xs font-bold">
                    <td className="py-3 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }}></div>
                      <span className="text-slate-700">{s.subject}</span>
                    </td>
                    <td className="py-3 w-16">
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${s.you}%`, backgroundColor: s.color }}></div>
                      </div>
                    </td>
                    <td className="py-3 text-center text-slate-800">{s.you}%</td>
                    <td className="py-3 text-center text-slate-400">{s.classAvg}%</td>
                    <td className="py-3 text-center text-emerald-600">{s.topper}%</td>
                    <td className="py-3 text-center text-slate-800">{s.rank}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Trend */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-indigo-500" /> PERFORMANCE TREND
          </h3>
          <div className="flex gap-4 px-2 mb-2">
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-indigo-500"></div><span className="text-[10px] font-bold text-slate-500 uppercase">Your Score</span></div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-300"></div><span className="text-[10px] font-bold text-slate-500 uppercase">Class Average</span></div>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 100]} />
                <RechartsTooltip />
                <Line type="monotone" dataKey="you" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="classAvg" stroke="#cbd5e1" strokeWidth={2} dot={{ r: 3, fill: '#cbd5e1' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs font-bold text-emerald-600 text-center mt-2 flex justify-center items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> Your performance is improving consistently!
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Weak Topics */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-rose-500" /> TOP WEAK TOPICS TO FOCUS
          </h3>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
                  <th className="pb-3">Topic</th>
                  <th className="pb-3">Subject</th>
                  <th className="pb-3">Accuracy</th>
                  <th className="pb-3">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {weakTopics.map((topic, i) => (
                  <tr key={i} className="text-xs font-bold">
                    <td className="py-3 text-slate-800 flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${topic.priority === 'High' ? 'bg-rose-500' : 'bg-amber-500'}`}></div>
                      {topic.topic}
                    </td>
                    <td className="py-3 text-slate-500">{topic.subject}</td>
                    <td className="py-3 text-slate-800">{topic.accuracy}%</td>
                    <td className="py-3">
                      <span className={`${topic.priority === 'High' ? 'text-rose-500' : 'text-amber-500'}`}>
                        {topic.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="w-full mt-2 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-indigo-100">
            View All Weak Topics
          </button>
        </div>

        {/* Action Plan & Insights */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-indigo-500" /> ACTION PLAN
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-xs font-bold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" /> Focus on weak topics (High Priority 3 first)
              </li>
              <li className="flex items-start gap-2 text-xs font-bold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" /> Practice 2 extra mock tests every week
              </li>
              <li className="flex items-start gap-2 text-xs font-bold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" /> Revise formulas and concepts daily
              </li>
              <li className="flex items-start gap-2 text-xs font-bold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" /> Analyze test performance and improve accuracy
              </li>
            </ul>
            <button className="w-full mt-4 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-indigo-100">
              View Study Plan
            </button>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 text-amber-500" /> KEY INSIGHTS
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-xs font-bold text-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0"></div> You are consistent!
              </li>
              <li className="flex items-start gap-2 text-xs font-bold text-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0"></div> Accuracy improved by 6.1% vs last month.
              </li>
              <li className="flex items-start gap-2 text-xs font-bold text-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0"></div> Focus on weak topics to break into Top 10%.
              </li>
              <li className="flex items-start gap-2 text-xs font-bold text-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0"></div> Keep practicing and maintain your streak!
              </li>
            </ul>
            <button className="w-full mt-4 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-indigo-100">
              View Detailed Report
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <h4 className="text-xs font-bold text-indigo-900">Compare with Friends</h4>
          </div>
          <p className="text-[10px] text-indigo-600/80 mb-3 font-medium">See how you rank among friends</p>
          <span className="text-xs font-bold text-indigo-600 mt-auto">Compare Now</span>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-5 h-5 text-purple-600" />
            <h4 className="text-xs font-bold text-purple-900">Personalized Insights</h4>
          </div>
          <p className="text-[10px] text-purple-600/80 mb-3 font-medium">AI-powered tips just for you</p>
          <span className="text-xs font-bold text-purple-600 mt-auto">View Insights</span>
        </div>

        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h4 className="text-xs font-bold text-blue-900">Mock Test Predictor</h4>
          </div>
          <p className="text-[10px] text-blue-600/80 mb-3 font-medium">Predict your rank in next test</p>
          <span className="text-xs font-bold text-blue-600 mt-auto">Predict Now</span>
        </div>

        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="w-5 h-5 text-emerald-600" />
            <h4 className="text-xs font-bold text-emerald-900">Performance Alerts</h4>
          </div>
          <p className="text-[10px] text-emerald-600/80 mb-3 font-medium">Get alerts on weak areas & test dates</p>
          <span className="text-xs font-bold text-emerald-600 mt-auto">Set Alerts</span>
        </div>

        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-3 mb-2">
            <Download className="w-5 h-5 text-amber-600" />
            <h4 className="text-xs font-bold text-amber-900">Download Reports</h4>
          </div>
          <p className="text-[10px] text-amber-600/80 mb-3 font-medium">Download detailed performance reports</p>
          <span className="text-xs font-bold text-amber-600 mt-auto">Download</span>
        </div>
      </div>

    </div>
  );
};

export default CompetitionAnalysis;
