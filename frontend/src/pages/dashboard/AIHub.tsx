import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { BrainCircuit, BookOpen, Target, Sparkles, AlertTriangle, Presentation } from 'lucide-react';

const AIHub = () => {
  
  const [studyPlan, setStudyPlan] = useState<any>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchPrediction(),
      fetchPlan(),
      fetchRecommendations()
    ]).finally(() => setInitialLoading(false));
  }, []);

  const fetchRecommendations = async () => {
    try {
      const res = await fetch('/api/ai/recommendations', {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      if (res.ok) setRecommendations(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchPrediction = async () => {
    try {
      const res = await fetch('/api/ai/predict-rank', {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      if (res.ok) setPrediction(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchPlan = async () => {
    try {
      const res = await fetch('/api/ai/my-plan', {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      if (res.ok) setStudyPlan(await res.json());
    } catch (err) { console.error(err); }
  };

  const generatePlan = async () => {
    setLoadingPlan(true);
    const generationToast = toast.loading('AI is analyzing your profile and generating a personalized plan...');
    try {
      // Simulate program fetching and generating plan
      const res = await fetch('/api/ai/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': localStorage.getItem('token') || '' },
        body: JSON.stringify({ program: 'IIT', planType: 'Daily' })
      });
      if (res.ok) {
        setStudyPlan(await res.json());
        toast.success('Your personalized AI plan is ready!', { id: generationToast });
      } else {
        toast.error('Failed to generate plan', { id: generationToast });
      }
    } catch (err) {
      console.error(err);
      toast.error('AI generation encountered an error', { id: generationToast });
    }
    setLoadingPlan(false);
  };

  if (initialLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="skeleton-loader h-12 w-1/4 mb-4"></div>
        <div className="skeleton-loader h-48 w-full rounded-3xl"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="skeleton-loader h-64 rounded-3xl"></div>
          <div className="skeleton-loader h-64 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center bg-gradient-to-r from-indigo-900 to-indigo-700 p-8 rounded-3xl shadow-lg text-white">
        <div>
          <h1 className="text-3xl font-black mb-2 flex items-center"><BrainCircuit className="w-8 h-8 mr-3 text-indigo-300" /> AI Learning Hub</h1>
          <p className="text-indigo-200 font-medium max-w-2xl">Your personalized AI ecosystem. Generate study plans, view performance predictions, and access tailored recommendations based on your activity.</p>
        </div>
        <Sparkles className="w-24 h-24 text-white/10 hidden md:block" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Predictions & Analytics */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 flex items-center mb-6"><Target className="w-5 h-5 mr-2 text-rose-500" /> Exam Prediction Model</h3>
            
            {!prediction ? (
              <p className="text-sm text-slate-500 italic">Not enough data to predict rank.</p>
            ) : (
              <div className="space-y-6">
                <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase">Predicted Rank</p>
                  <p className="text-4xl font-black text-indigo-600 font-mono mt-1">{prediction.predictedRank.toLocaleString()}</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <p className="text-xs font-bold text-emerald-700">Success Prob.</p>
                    <p className="text-2xl font-black text-emerald-700">{prediction.successProbability}%</p>
                  </div>
                  <div className="flex-1 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <p className="text-xs font-bold text-blue-700">Percentile</p>
                    <p className="text-2xl font-black text-blue-700">{prediction.predictedPercentile}</p>
                  </div>
                </div>
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-amber-800 leading-relaxed">{prediction.insightNotes}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 flex items-center mb-4"><Presentation className="w-5 h-5 mr-2 text-purple-500" /> UPSC Features</h3>
            <p className="text-sm text-slate-500 mb-4">Are you a Civil Services aspirant? Use the AI Mock Interview system to assess your communication skills.</p>
            <button className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors shadow-sm">Start Mock Interview</button>
          </div>

          {/* AI Recommendations */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 flex items-center mb-4"><Target className="w-5 h-5 mr-2 text-emerald-500" /> AI Recommendations</h3>
            {!recommendations ? (
              <p className="text-sm text-slate-500 italic">Analyzing performance data...</p>
            ) : (
              <div className="space-y-4">
                {recommendations.recommendations.map((rec: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="mt-1">
                      {rec.priority === 'High' ? <AlertTriangle className="w-4 h-4 text-rose-500" /> : <Sparkles className="w-4 h-4 text-indigo-400" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{rec.actionText}</p>
                      <p className="text-xs text-slate-500">{rec.type} &bull; Priority: {rec.priority}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Dynamic Study Planner */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center"><BookOpen className="w-5 h-5 mr-2 text-indigo-600" /> Dynamic Study Planner</h3>
              <p className="text-sm text-slate-500 mt-1">AI-generated tasks based on your weak areas.</p>
            </div>
            <button 
              onClick={generatePlan}
              disabled={loadingPlan}
              className={`bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md transition-colors flex items-center disabled:opacity-50`}
            >
              {loadingPlan ? 'Generating...' : <><Sparkles className="w-4 h-4 mr-2"/> Generate New Plan</>}
            </button>
          </div>

          <div className="p-6 flex-1 bg-slate-50/50">
            {!studyPlan ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 p-12">
                <BrainCircuit className="w-16 h-16 mb-4 text-slate-300" />
                <p className="font-semibold text-slate-600">No active study plan</p>
                <p className="text-sm mt-2 text-center max-w-sm">Click the generate button above to let the AI analyze your metrics and build a personalized schedule.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-2 mb-6">
                  {studyPlan.targetExams.map((exam: string) => (
                    <span key={exam} className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">{exam}</span>
                  ))}
                  <span className="px-3 py-1 bg-slate-200 text-slate-600 text-xs font-bold rounded-full">{studyPlan.planType} Plan</span>
                </div>

                {studyPlan.tasks.map((task: any, idx: number) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-indigo-300 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-sm ${
                        task.taskType === 'Revision' ? 'bg-amber-500' :
                        task.taskType === 'Practice' ? 'bg-blue-500' : 'bg-rose-500'
                      }`}>
                        {task.taskType.substring(0, 3).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-lg">{task.subject}</h4>
                        <p className="text-slate-500 text-sm font-medium">{task.topic}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-slate-700">{task.estimatedMinutes} Mins</p>
                      <button className="mt-2 text-xs font-bold text-indigo-600 hover:text-indigo-800">Mark Complete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AIHub;
