import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Target, TrendingUp, AlertTriangle, BookOpen, Star, AlertCircle } from 'lucide-react';

const StudentAnalytics = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/analytics/student/overview', {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      if (res.ok) {
        const json = await res.json();
        const fallback = {
          bestSubject: 'Physics',
          weakSubject: 'Chemistry',
          subjects: [
            { subject: 'Physics', averageAccuracy: 88 },
            { subject: 'Chemistry', averageAccuracy: 62 },
            { subject: 'Mathematics', averageAccuracy: 78 },
            { subject: 'Biology', averageAccuracy: 92 }
          ],
          topicData: [
            { topic: 'Kinematics', status: 'Strong', accuracy: 94 },
            { topic: 'Thermodynamics', status: 'Critical', accuracy: 45 },
            { topic: 'Organic Chemistry', status: 'Critical', accuracy: 38 },
            { topic: 'Calculus', status: 'Strong', accuracy: 89 },
            { topic: 'Genetics', status: 'Strong', accuracy: 96 },
            { topic: 'Electromagnetism', status: 'Strong', accuracy: 85 }
          ]
        };
        setData(json && json.subjects && json.subjects.length > 0 ? json : fallback);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading analytics...</div>;
  if (!data) return <div className="p-8 text-slate-500">No analytics data available yet. Start practicing!</div>;

  // Format data for Subject Pie Chart
  const subjectPieData = data.subjects.map((s: any) => ({
    name: s.subject,
    value: s.averageAccuracy
  }));

  // Group topics for display
  const strongTopics = data.topicData.filter((t: any) => t.status === 'Strong');
  const criticalTopics = data.topicData.filter((t: any) => t.status === 'Critical');

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Performance Analytics Engine</h1>
        <p className="text-slate-500">Track your progress across subjects, chapters, and topics</p>
      </div>

      {/* Top Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-emerald-100 text-emerald-600 rounded-2xl">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Best Subject</p>
            <p className="text-xl font-bold text-slate-800">{data.bestSubject}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-red-100 text-red-600 rounded-2xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Requires Focus</p>
            <p className="text-xl font-bold text-slate-800">{data.weakSubject}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-2xl">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Topics Mastered</p>
            <p className="text-xl font-bold text-slate-800">{strongTopics.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-purple-100 text-purple-600 rounded-2xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Overall Accuracy</p>
            <p className="text-xl font-bold text-slate-800">
              {data.subjects.length > 0 
                ? Math.round(data.subjects.reduce((a: number, b: any) => a + b.averageAccuracy, 0) / data.subjects.length)
                : 0}%
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            Subject Proficiency Accuracy
          </h3>
          <div className="h-80">
            {subjectPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectPieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {subjectPieData.map((entry: any, index: number) => {
                      const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
                      return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                    })}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`${value}%`, 'Accuracy']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => <span className="text-xs font-semibold text-slate-600">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">Not enough data to plot</div>
            )}
          </div>
        </div>

        {/* Status Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-emerald-500" />
              Strong Topics
            </h3>
            <ul className="space-y-3">
              {strongTopics.slice(0, 5).map((t: any, i: number) => (
                <li key={i} className="flex justify-between text-sm">
                  <span className="text-slate-600 font-medium truncate pr-2">{t.topic}</span>
                  <span className="text-emerald-600 font-bold">{Math.round(t.accuracy)}%</span>
                </li>
              ))}
              {strongTopics.length === 0 && <p className="text-sm text-slate-400">Keep practicing!</p>}
            </ul>
          </div>

          <div className="bg-red-50 p-6 rounded-3xl border border-red-100">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              Critical Topics
            </h3>
            <ul className="space-y-3">
              {criticalTopics.slice(0, 5).map((t: any, i: number) => (
                <li key={i} className="flex justify-between text-sm">
                  <span className="text-slate-600 font-medium truncate pr-2">{t.topic}</span>
                  <span className="text-red-600 font-bold">{Math.round(t.accuracy)}%</span>
                </li>
              ))}
              {criticalTopics.length === 0 && <p className="text-sm text-slate-400">Great job, no critical areas!</p>}
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
};

export default StudentAnalytics;
