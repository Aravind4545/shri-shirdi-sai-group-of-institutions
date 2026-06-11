import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Flag, ChevronRight } from 'lucide-react';

const ExamInterface = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [testInfo, setTestInfo] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Start Exam API call
    const startExam = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/exam/start/${testId}`, {
          method: 'POST',
          headers: { 'x-auth-token': localStorage.getItem('token') || '' }
        });
        const data = await res.json();
        if (res.ok) {
          setSession(data.session);
          setTestInfo(data.test);
          setTimeLeft(data.test.durationMinutes * 60);
        }
      } catch (err) { console.error('Failed to start exam', err); }
    };
    startExam();

    // Anti-Cheating: Tab Switching Detection
    const handleVisibilityChange = () => {
      if (document.hidden) logViolation('TabSwitch', 'User switched to another tab or app');
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Enter full screen for focus (Optional/simulated)
    return () => { document.removeEventListener('visibilitychange', handleVisibilityChange); };
  }, [testId]);

  useEffect(() => {
    if (timeLeft <= 0 && session) {
      if (timeLeft === 0 && !submitting) submitExam();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const logViolation = async (type: string, details: string) => {
    if (!session) return;
    try {
      await fetch(`http://localhost:5001/api/exam/violation/${session._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': localStorage.getItem('token') || '' },
        body: JSON.stringify({ type, details })
      });
    } catch (err) {}
  };

  const saveProgress = async (qId: string, options: string[], status: string) => {
    if (!session) return;
    try {
      await fetch(`http://localhost:5001/api/exam/progress/${session._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': localStorage.getItem('token') || '' },
        body: JSON.stringify({ questionId: qId, selectedOptions: options, status, timeSpentSeconds: 10 }) // mock time spent
      });
      // Local state update
      const updatedResponses = [...session.responses];
      const idx = updatedResponses.findIndex((r: any) => r.questionId === qId);
      if (idx > -1) {
        updatedResponses[idx].selectedOptions = options;
        updatedResponses[idx].status = status;
        setSession({ ...session, responses: updatedResponses });
      }
    } catch (err) {}
  };

  const submitExam = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5001/api/exam/submit/${session._id}`, {
        method: 'POST',
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      if (res.ok) navigate('/dashboard/analytics'); // Redirect to analytics
    } catch (err) { console.error('Submission failed'); setSubmitting(false); }
  };

  if (!testInfo || !session) return <div className="h-screen flex items-center justify-center bg-slate-900 text-white font-bold">Initializing Exam Environment...</div>;

  const currentQ = testInfo.questions[currentQuestionIndex];
  const currentResponse = session.responses.find((r: any) => r.questionId === currentQ._id);

  const handleOptionSelect = (opt: string) => {
    let newOptions = [opt];
    if (currentQ.type === 'MultipleCorrect') {
      const isSelected = currentResponse?.selectedOptions.includes(opt);
      newOptions = isSelected 
        ? currentResponse.selectedOptions.filter((o: string) => o !== opt)
        : [...(currentResponse?.selectedOptions || []), opt];
    }
    saveProgress(currentQ._id, newOptions, 'Attempted');
  };

  const handleMarkReview = () => {
    saveProgress(currentQ._id, currentResponse?.selectedOptions || [], 'MarkedForReview');
    if (currentQuestionIndex < testInfo.questions.length - 1) setCurrentQuestionIndex(prev => prev + 1);
  };

  const handleSaveNext = () => {
    if (!currentResponse || currentResponse.status === 'NotAttempted') {
      if (currentResponse?.selectedOptions?.length > 0) saveProgress(currentQ._id, currentResponse.selectedOptions, 'Attempted');
    }
    if (currentQuestionIndex < testInfo.questions.length - 1) setCurrentQuestionIndex(prev => prev + 1);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans select-none">
      {/* Header */}
      <header className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div>
          <h1 className="text-xl font-black">{testInfo.title}</h1>
          <p className="text-slate-400 text-sm font-semibold">{testInfo.subject} | {testInfo.program}</p>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center text-rose-500 font-mono font-bold text-xl bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
            <Clock className="w-5 h-5 mr-2 text-rose-500" />
            {formatTime(timeLeft)}
          </div>
          <button onClick={submitExam} disabled={submitting} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-bold transition-colors">
            {submitting ? 'Submitting...' : 'Submit Exam'}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Question Area */}
        <div className="flex-1 p-8 overflow-y-auto bg-white m-4 rounded-3xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-800">Question {currentQuestionIndex + 1}</h2>
            <div className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              +{currentQ.marks} Marks / -{currentQ.negativeMarks} Negative
            </div>
          </div>
          
          <div className="flex-1">
            <p className="text-lg text-slate-800 font-medium mb-8 whitespace-pre-wrap">{currentQ.text}</p>
            
            <div className="space-y-4 max-w-2xl">
              {currentQ.options.map((opt: string, idx: number) => {
                const isSelected = currentResponse?.selectedOptions?.includes(opt);
                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(opt)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium flex items-center ${
                      isSelected 
                        ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-sm' 
                        : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'border-blue-600' : 'border-slate-300'
                    }`}>
                      {isSelected && <div className="w-3 h-3 bg-blue-600 rounded-full"></div>}
                    </div>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
            <button 
              onClick={() => saveProgress(currentQ._id, [], 'NotAttempted')}
              className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Clear Response
            </button>
            <div className="space-x-4 flex">
              <button onClick={handleMarkReview} className="px-6 py-3 font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors flex items-center">
                <Flag className="w-5 h-5 mr-2" /> Mark & Next
              </button>
              <button onClick={handleSaveNext} className="px-8 py-3 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center shadow-md shadow-blue-500/20">
                Save & Next <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>

        {/* Palette Area */}
        <div className="w-80 bg-white m-4 ml-0 rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <h3 className="font-bold text-slate-800 mb-4 border-b pb-4">Question Palette</h3>
          
          <div className="grid grid-cols-5 gap-3 mb-8">
            {testInfo.questions.map((q: any, idx: number) => {
              const r = session.responses.find((res: any) => res.questionId === q._id);
              let statusColor = 'bg-slate-100 text-slate-500 border-slate-200';
              if (r?.status === 'Attempted') statusColor = 'bg-emerald-500 text-white border-emerald-600 shadow-sm';
              else if (r?.status === 'MarkedForReview') statusColor = 'bg-amber-500 text-white border-amber-600 shadow-sm';
              
              const isCurrent = idx === currentQuestionIndex;
              
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-10 h-10 rounded-full font-bold flex items-center justify-center border-2 transition-all ${statusColor} ${
                    isCurrent ? 'ring-4 ring-blue-500/30' : 'hover:opacity-80'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="mt-auto space-y-3 pt-6 border-t border-slate-100 text-sm font-semibold">
            <div className="flex items-center"><div className="w-6 h-6 rounded-full bg-emerald-500 border border-emerald-600 mr-3 shadow-sm"></div> <span className="text-slate-600">Attempted</span></div>
            <div className="flex items-center"><div className="w-6 h-6 rounded-full bg-amber-500 border border-amber-600 mr-3 shadow-sm"></div> <span className="text-slate-600">Marked for Review</span></div>
            <div className="flex items-center"><div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-300 mr-3"></div> <span className="text-slate-600">Not Attempted</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamInterface;
