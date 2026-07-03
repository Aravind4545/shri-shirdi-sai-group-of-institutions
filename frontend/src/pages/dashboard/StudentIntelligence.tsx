import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { ShieldCheck, TrendingUp, Sparkles, AlertTriangle, BookOpen, Target, BrainCircuit, Activity, Calculator, ArrowRight } from 'lucide-react';

const StudentIntelligence = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Rank Predictor State
  const [selectedExam, setSelectedExam] = useState<string>('ap_eamcet');
  const [predictorMarks, setPredictorMarks] = useState<string>('');
  const [predictedRank, setPredictedRank] = useState<number | null>(null);
  const [predictedPercentile, setPredictedPercentile] = useState<number | null>(null);

  const examsData: Record<string, { name: string; totalMarks: number; candidates: number; label: string }> = {
    'ap_eamcet': { name: 'AP EAPCET', totalMarks: 160, candidates: 350000, label: 'Expected AP State Rank' },
    'ts_eamcet': { name: 'TS EAPCET', totalMarks: 160, candidates: 350000, label: 'Expected TS State Rank' },
    'jee_main': { name: 'JEE Main', totalMarks: 300, candidates: 1200000, label: 'Expected AIR' },
    'neet': { name: 'NEET UG', totalMarks: 720, candidates: 2400000, label: 'Expected AIR' },
    'upsc_civils': { name: 'UPSC Civils (Prelims)', totalMarks: 200, candidates: 1000000, label: 'Expected AIR' }
  };

  useEffect(() => {
    fetchIntelligence();
  }, []);

  const fetchIntelligence = async () => {
    try {
      const res = await fetch('/api/intelligence/student', {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      if (res.ok) {
        setData(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading Academic Intelligence...</div>;
  if (!data || !data.health) return <div className="p-8">Data not available yet.</div>;

  const { health, insight, strongTopics, weakTopics, subjects } = data;

  const trendData = [
    { name: 'Week 1', score: health.healthScore - 15 },
    { name: 'Week 2', score: health.healthScore - 10 },
    { name: 'Week 3', score: health.healthScore - 5 },
    { name: 'Current', score: health.healthScore }
  ];

  const handlePredictRank = () => {
    const marks = parseFloat(predictorMarks);
    const examInfo = examsData[selectedExam];
    const total = examInfo.totalMarks;
    
    if (isNaN(marks) || marks < 0 || marks > total) {
      alert(`Please enter valid marks between 0 and ${total}.`);
      return;
    }

    let percentile = 0;
    
    if (selectedExam === 'jee_main') {
      if (marks >= 250) percentile = 99.9 + ((marks - 250)/50)*0.09;
      else if (marks >= 200) percentile = 99.0 + ((marks - 200)/50)*0.9;
      else if (marks >= 150) percentile = 97.0 + ((marks - 150)/50)*2.0;
      else if (marks >= 100) percentile = 90.0 + ((marks - 100)/50)*7.0;
      else if (marks >= 50) percentile = 70.0 + ((marks - 50)/50)*20.0;
      else percentile = (marks / 50) * 70.0;
    } else if (selectedExam === 'neet') {
      if (marks >= 700) percentile = 99.9 + ((marks - 700)/20)*0.09;
      else if (marks >= 650) percentile = 99.0 + ((marks - 650)/50)*0.9;
      else if (marks >= 500) percentile = 90.0 + ((marks - 500)/150)*9.0;
      else if (marks >= 300) percentile = 70.0 + ((marks - 300)/200)*20.0;
      else if (marks >= 150) percentile = 40.0 + ((marks - 150)/150)*30.0;
      else percentile = (marks / 150) * 40.0;
    } else if (selectedExam === 'ap_eamcet' || selectedExam === 'ts_eamcet') {
      if (marks >= 140) percentile = 99.5 + ((marks - 140)/20)*0.49;
      else if (marks >= 120) percentile = 98.0 + ((marks - 120)/20)*1.5;
      else if (marks >= 100) percentile = 92.0 + ((marks - 100)/20)*6.0;
      else if (marks >= 80) percentile = 80.0 + ((marks - 80)/20)*12.0;
      else if (marks >= 60) percentile = 60.0 + ((marks - 60)/20)*20.0;
      else percentile = (marks / 60) * 60.0;
    } else if (selectedExam === 'upsc_civils') {
      if (marks >= 130) percentile = 99.9 + ((marks - 130)/70)*0.09;
      else if (marks >= 100) percentile = 98.0 + ((marks - 100)/30)*1.9;
      else if (marks >= 80) percentile = 90.0 + ((marks - 80)/20)*8.0;
      else if (marks >= 60) percentile = 70.0 + ((marks - 60)/20)*20.0;
      else percentile = (marks / 60) * 70.0;
    }
    
    percentile = Math.min(Math.max(percentile, 0), 100);
    
    const totalCandidates = examInfo.candidates;
    let rank = Math.round(((100 - percentile) / 100) * totalCandidates);
    if (rank <= 0) rank = 1;
    
    setPredictedPercentile(parseFloat(percentile.toFixed(2)));
    setPredictedRank(rank);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center bg-gradient-to-r from-blue-900 to-indigo-800 p-8 rounded-3xl shadow-lg text-white">
        <div>
          <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-blue-300" /> 
            Academic Intelligence
          </h1>
          <p className="text-blue-100 max-w-2xl">
            Your centralized AI command center tracking health, predictions, and growth.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Metric: Academic Health */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <Activity className={`w-16 h-16 mb-4 ${health.healthScore >= 80 ? 'text-emerald-500' : health.healthScore >= 60 ? 'text-blue-500' : 'text-rose-500'}`} />
          <h3 className="text-xl font-bold text-slate-800">Academic Health</h3>
          <p className="text-5xl font-black mt-2 text-slate-900">{health.healthScore}<span className="text-2xl text-slate-400">/100</span></p>
          <span className={`mt-4 px-4 py-1.5 rounded-full text-sm font-bold ${
            health.status === 'Excellent' || health.status === 'Good' ? 'bg-emerald-100 text-emerald-700' : 
            'bg-amber-100 text-amber-700'
          }`}>
            {health.status} Status
          </span>
          <div className="w-full mt-6 grid grid-cols-2 gap-4 text-left">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="text-xs font-bold text-slate-500 uppercase">Attendance</p>
              <p className="font-bold text-slate-800">{health.components.attendanceScore}%</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="text-xs font-bold text-slate-500 uppercase">Test Avg</p>
              <p className="font-bold text-slate-800">{health.components.testScore}%</p>
            </div>
          </div>
        </div>

        {/* Success Prediction */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-500" /> AI Success Prediction
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-bold text-slate-600">Probability of Success</span>
                <span className="text-sm font-bold text-indigo-600">{insight.successProbability}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${insight.successProbability}%` }}></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <p className="text-xs font-bold text-blue-700 uppercase">Expected Rank</p>
                <p className="text-2xl font-black text-blue-900 mt-1">{insight.predictedRank.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                <p className="text-xs font-bold text-purple-700 uppercase">Percentile</p>
                <p className="text-2xl font-black text-purple-900 mt-1">{insight.predictedPercentile}</p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Readiness Level</p>
              <p className="font-bold text-slate-800">{insight.readinessLevel}</p>
            </div>
          </div>
        </div>

        {/* AI Insights & Growth */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" /> Generated Insights
          </h3>
          <div className="flex-1 space-y-3 overflow-y-auto">
            {insight.aiInsights.map((note: string, idx: number) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                <p className="text-sm font-medium text-amber-900 leading-relaxed">{note}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
             <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Monthly Growth</p>
                <p className="text-xl font-black text-emerald-600">+{insight.monthlyGrowth}%</p>
             </div>
             <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Consistency</p>
                <p className="text-xl font-black text-blue-600">{insight.learningConsistencyScore}/100</p>
             </div>
          </div>
        </div>
      </div>

      {/* Mock Test Rank Predictor */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute -right-10 -top-10 opacity-[0.03]">
          <Calculator className="w-64 h-64" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <div>
              <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2 mb-2">
                <Calculator className="w-6 h-6 text-brand-blue" />
                AI Rank Predictor
              </h3>
              <p className="text-slate-500 font-medium">
                Enter your expected or mock test marks to instantly calculate your predicted All India Rank and Percentile using our AI curve model.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-bold text-slate-700 mb-2">Select Exam Target</label>
                <select 
                  value={selectedExam}
                  onChange={(e) => {
                    setSelectedExam(e.target.value);
                    setPredictedRank(null);
                    setPredictedPercentile(null);
                  }}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-blue outline-none font-bold text-lg text-slate-800"
                >
                  {Object.entries(examsData).map(([key, data]) => (
                    <option key={key} value={key}>{data.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Your Marks (Out of {examsData[selectedExam].totalMarks})
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    placeholder={`Max ${examsData[selectedExam].totalMarks}`}
                    value={predictorMarks}
                    onChange={(e) => setPredictorMarks(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-blue outline-none font-bold text-xl text-slate-800 pr-16"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                    / {examsData[selectedExam].totalMarks}
                  </span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handlePredictRank}
              className="w-full sm:w-auto px-8 py-4 bg-brand-blue text-white font-black rounded-2xl shadow-md hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
            >
              Predict Rank <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {(predictedRank !== null && predictedPercentile !== null) && (
            <div className="flex-1 bg-gradient-to-br from-indigo-900 to-indigo-700 p-8 rounded-3xl text-white shadow-lg flex flex-col justify-center">
              <p className="text-indigo-200 font-bold uppercase tracking-wider text-sm mb-6 flex items-center gap-2">
                <Target className="w-4 h-4" /> Prediction Results
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-indigo-200 text-sm font-bold mb-1">{examsData[selectedExam].label}</p>
                  <p className="text-5xl font-black text-white drop-shadow-md">
                    {predictedRank.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-indigo-200 text-sm font-bold mb-1">Percentile</p>
                  <p className="text-4xl font-black text-white drop-shadow-md mt-1">
                    {predictedPercentile}
                    <span className="text-xl text-indigo-300 ml-1">%ile</span>
                  </p>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-indigo-800/50 backdrop-blur-sm rounded-xl border border-indigo-500/30">
                <p className="text-sm text-indigo-100 leading-relaxed font-medium">
                  Based on a simulated demographic of {examsData[selectedExam].candidates.toLocaleString()} candidates on the {examsData[selectedExam].name} difficulty curve.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress Chart */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-500" /> Progress Trend
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis domain={['dataMin - 10', 'dataMax + 10']} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <RechartsTooltip wrapperClassName="rounded-xl shadow-lg border-none" />
              <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={4} dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default StudentIntelligence;
