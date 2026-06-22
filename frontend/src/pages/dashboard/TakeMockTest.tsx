import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, AlertTriangle, ArrowRight, ArrowLeft, CheckCircle, Target } from 'lucide-react';

const TakeMockTest = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [test, setTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // { questionId: selectedOption }
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null); // in seconds
  const [submitting, setSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<any>(null);

  useEffect(() => {
    fetchTest();
  }, [id]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || submittedResult) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev && prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev ? prev - 1 : 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submittedResult]);

  const fetchTest = async () => {
    try {
      const res = await fetch(`https://shri-shirdi-sai-group-of-institutions.onrender.com/api/mocktests/${id}/take`, {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      if (res.ok) {
        const data = await res.json();
        setTest(data);
        if (data.durationMinutes) {
          setTimeLeft(data.durationMinutes * 60);
        }
      } else {
        alert("Could not load test or you do not have permission.");
        navigate('/dashboard/mocktests');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (questionId: string, option: string) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const handleSubmit = async () => {
    if (!test || submitting) return;
    
    if (!submittedResult && Object.keys(answers).length < test.questions.length) {
      if (!window.confirm("You have unattempted questions. Are you sure you want to submit?")) {
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = {
        answers: Object.entries(answers).map(([qId, opt]) => ({ questionId: qId, selectedOption: opt }))
      };

      const res = await fetch(`https://shri-shirdi-sai-group-of-institutions.onrender.com/api/mocktests/${id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || ''
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const result = await res.json();
        setSubmittedResult(result);
      } else {
        alert("Failed to submit test.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting test.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 font-bold text-slate-500">Loading your test engine...</div>;
  if (!test) return <div className="p-8 font-bold text-red-500">Test not found.</div>;

  if (submittedResult) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-xl max-w-2xl w-full text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 mb-2">Test Submitted Successfully!</h1>
          <p className="text-slate-500 font-medium mb-8">Your results have been recorded and sent to your teachers.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-left">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase">Final Score</p>
              <p className="text-3xl font-black text-indigo-600">{submittedResult.score}</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
              <p className="text-xs font-bold text-emerald-700 uppercase">Correct</p>
              <p className="text-2xl font-black text-emerald-600">{submittedResult.correctAnswers}</p>
            </div>
            <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100">
              <p className="text-xs font-bold text-rose-700 uppercase">Incorrect</p>
              <p className="text-2xl font-black text-rose-600">{submittedResult.incorrectAnswers}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
              <p className="text-xs font-bold text-amber-700 uppercase">Unattempted</p>
              <p className="text-2xl font-black text-amber-600">{submittedResult.unattempted}</p>
            </div>
          </div>

          {submittedResult.topicAnalysis && submittedResult.topicAnalysis.length > 0 && (
            <div className="mb-10 text-left">
              <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-500" />
                Topic Analysis
              </h2>
              <div className="space-y-4">
                {submittedResult.topicAnalysis.map((ta: any, idx: number) => {
                  const accuracy = Math.round((ta.correct / ta.total) * 100) || 0;
                  return (
                    <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-bold text-slate-700">
                          <span className="text-indigo-600 mr-2">{ta.subject}</span>
                          {ta.topic}
                        </div>
                        <div className="font-black text-slate-800">{accuracy}%</div>
                      </div>
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden flex">
                        <div style={{ width: `${accuracy}%` }} className="h-full bg-emerald-500"></div>
                        <div style={{ width: `${(ta.incorrect / ta.total) * 100}%` }} className="h-full bg-rose-500"></div>
                      </div>
                      <div className="flex gap-4 mt-2 text-xs font-bold text-slate-500">
                        <span>Total: {ta.total}</span>
                        <span className="text-emerald-600">Correct: {ta.correct}</span>
                        <span className="text-rose-600">Incorrect: {ta.incorrect}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          <button 
            onClick={() => navigate('/dashboard/mocktests')}
            className="px-8 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = test.questions[currentQuestionIdx];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Test Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div>
          <h1 className="text-lg font-black text-slate-800">{test.title}</h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{test.targetExam}</p>
        </div>
        <div className="flex items-center gap-6">
          {timeLeft !== null && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-black text-lg ${timeLeft < 300 ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-slate-100 text-slate-700'}`}>
              <Clock className="w-5 h-5" />
              {formatTime(timeLeft)}
            </div>
          )}
          <button 
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow-md hover:bg-emerald-700 transition-colors"
          >
            {submitting ? 'Submitting...' : 'Submit Test'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm mb-6">
              <div className="flex items-start justify-between mb-6">
                <span className="text-lg font-black text-indigo-600 bg-indigo-50 px-4 py-1 rounded-full">
                  Question {currentQuestionIdx + 1} <span className="text-indigo-300">/ {test.questions.length}</span>
                </span>
                <div className="flex gap-4 text-sm font-bold">
                  <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded">+{currentQuestion.marks || 4} Marks</span>
                  <span className="text-rose-600 bg-rose-50 px-2 py-1 rounded">-{currentQuestion.negativeMarks || 1} Marks</span>
                </div>
              </div>
              
              <p className="text-xl font-medium text-slate-800 mb-8 whitespace-pre-wrap leading-relaxed">
                {currentQuestion.questionText}
              </p>
              
              <div className="space-y-4">
                {currentQuestion.options.map((option: string, idx: number) => {
                  const isSelected = answers[currentQuestion._id] === option;
                  return (
                    <div 
                      key={idx}
                      onClick={() => handleOptionSelect(currentQuestion._id, option)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
                        isSelected 
                          ? 'border-indigo-600 bg-indigo-50 shadow-md' 
                          : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                        isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className={`font-medium text-lg ${isSelected ? 'text-indigo-900 font-bold' : 'text-slate-700'}`}>
                        {option}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIdx === 0}
                className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" /> Previous
              </button>
              
              <button
                onClick={() => setCurrentQuestionIdx(prev => Math.min(test.questions.length - 1, prev + 1))}
                disabled={currentQuestionIdx === test.questions.length - 1}
                className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                Next <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Question Palette */}
        <div className="w-full md:w-80 bg-white border-l border-slate-200 p-6 overflow-y-auto flex-shrink-0">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Question Palette</h3>
          
          <div className="grid grid-cols-4 gap-3">
            {test.questions.map((q: any, idx: number) => {
              const isAttempted = !!answers[q._id];
              const isCurrent = idx === currentQuestionIdx;
              
              let btnClass = "w-12 h-12 rounded-xl font-bold text-sm transition-colors flex items-center justify-center border-2 ";
              
              if (isCurrent) {
                btnClass += "border-slate-800 bg-slate-800 text-white shadow-lg scale-110";
              } else if (isAttempted) {
                btnClass += "border-indigo-600 bg-indigo-50 text-indigo-700";
              } else {
                btnClass += "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50";
              }

              return (
                <button
                  key={q._id}
                  onClick={() => setCurrentQuestionIdx(idx)}
                  className={btnClass}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 space-y-3">
            <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
              <div className="w-4 h-4 rounded-md border-2 border-indigo-600 bg-indigo-50"></div>
              Attempted ({Object.keys(answers).length})
            </div>
            <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
              <div className="w-4 h-4 rounded-md border-2 border-slate-200 bg-white"></div>
              Unattempted ({test.questions.length - Object.keys(answers).length})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeMockTest;
