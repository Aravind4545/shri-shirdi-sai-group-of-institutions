import { useState, useEffect } from 'react';
import { Target, TrendingUp, AlertTriangle, CheckCircle, BarChart3, BrainCircuit } from 'lucide-react';

const ResultAnalytics = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch('https://shri-shirdi-sai-group-of-institutions.onrender.com/api/exam/analytics', {
      headers: { 'x-auth-token': localStorage.getItem('token') || '' }
    })
      .then(res => res.json())
      .then(data => setResults(data))
      .catch(err => console.error(err));
  }, []);

  if (!results.length) return <div className="p-8 text-center text-slate-500 font-bold">No results available yet. Take a test!</div>;

  const latestResult: any = results[results.length - 1];

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <div className="flex justify-between items-end border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Performance Analytics</h1>
          <p className="text-slate-500 font-medium">Detailed breakdown of your recent exams</p>
        </div>
      </div>

      {/* Latest Result Overview */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center"><Target className="w-6 h-6 mr-2 text-blue-600"/> Latest Exam: {latestResult.testId?.title || 'Unknown Test'}</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
            <p className="text-sm font-bold text-slate-500 uppercase mb-2">Score</p>
            <p className="text-4xl font-black text-blue-600">{latestResult.score}</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
            <p className="text-sm font-bold text-slate-500 uppercase mb-2">Accuracy</p>
            <p className="text-4xl font-black text-emerald-600">{latestResult.accuracyPercentage}%</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
            <p className="text-sm font-bold text-slate-500 uppercase mb-2">Rank</p>
            <p className="text-4xl font-black text-purple-600">#{latestResult.rank || '--'}</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
            <p className="text-sm font-bold text-slate-500 uppercase mb-2">Percentile</p>
            <p className="text-4xl font-black text-amber-600">{latestResult.percentile || '--'}%</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h3 className="font-bold text-slate-700 mb-4 flex items-center"><BarChart3 className="w-5 h-5 mr-2 text-slate-500" /> Question Breakdown</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-emerald-50 text-emerald-700 rounded-xl font-bold">
                <span className="flex items-center"><CheckCircle className="w-5 h-5 mr-2"/> Correct</span>
                <span>{latestResult.correctAnswers}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-rose-50 text-rose-700 rounded-xl font-bold">
                <span className="flex items-center"><AlertTriangle className="w-5 h-5 mr-2"/> Incorrect</span>
                <span>{latestResult.wrongAnswers}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-100 text-slate-700 rounded-xl font-bold">
                <span className="flex items-center"><TrendingUp className="w-5 h-5 mr-2"/> Unattempted</span>
                <span>{latestResult.unattempted}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-3xl border border-indigo-100">
            <h3 className="font-bold text-indigo-900 mb-4 flex items-center"><BrainCircuit className="w-5 h-5 mr-2 text-indigo-600" /> AI Insights</h3>
            
            <div className="space-y-4">
              {latestResult.aiRecommendations?.map((rec: string, i: number) => (
                <div key={i} className="flex items-start bg-white p-4 rounded-xl shadow-sm border border-indigo-50">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-indigo-900 font-medium text-sm">{rec}</p>
                </div>
              ))}
              {(!latestResult.aiRecommendations || latestResult.aiRecommendations.length === 0) && (
                <p className="text-indigo-700 text-sm italic">AI is analyzing your performance. Take more tests to generate insights.</p>
              )}
            </div>
            
            <div className="mt-6 flex gap-4">
              {latestResult.weakAreas?.length > 0 && (
                <div className="flex-1">
                  <p className="text-xs font-bold text-indigo-400 uppercase mb-2">Weak Areas</p>
                  <div className="flex flex-wrap gap-2">
                    {latestResult.weakAreas.map((w: string) => <span key={w} className="px-2 py-1 bg-rose-100 text-rose-700 rounded text-xs font-bold">{w}</span>)}
                  </div>
                </div>
              )}
              {latestResult.strongAreas?.length > 0 && (
                <div className="flex-1">
                  <p className="text-xs font-bold text-indigo-400 uppercase mb-2">Strong Areas</p>
                  <div className="flex flex-wrap gap-2">
                    {latestResult.strongAreas.map((s: string) => <span key={s} className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-bold">{s}</span>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultAnalytics;
