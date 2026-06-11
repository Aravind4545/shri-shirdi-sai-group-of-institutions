import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Award, Target, Calendar } from 'lucide-react';

const Results = () => {
  const { themeColor, textColor } = useOutletContext<any>();
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5001/api/dashboard/results', {
      headers: { 'x-auth-token': localStorage.getItem('token') || '' }
    })
      .then(res => res.json())
      .then(data => {
        const fallback = [
          { _id: 'r1', testId: { title: 'Mid Term Physics Exam', totalMarks: 100, subject: 'Physics' }, score: 85, grade: 'A', remarks: 'Excellent', submittedAt: new Date().toISOString(), rank: 4 },
          { _id: 'r2', testId: { title: 'Calculus Quiz', totalMarks: 50, subject: 'Mathematics' }, score: 35, grade: 'B', remarks: 'Good', submittedAt: new Date(Date.now() - 86400000).toISOString(), rank: 12 }
        ];
        setResults(data && data.length > 0 ? data : fallback);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">My Performance</h2>

      {results.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-200">
          <p className="text-gray-500 font-medium">No results found. Start taking tests to see your performance!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {results.map((result: any) => (
            <div key={result._id} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-200">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b border-gray-100 pb-4 mb-6">
                <div>
                  <h3 className="font-extrabold text-xl text-gray-900 mb-1">{result.testId?.title || 'Unknown Test'}</h3>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" /> {new Date(result.submittedAt).toLocaleString()}
                  </p>
                </div>
                <div className={`mt-4 md:mt-0 px-4 py-2 rounded-lg bg-gray-50 border border-gray-100 text-sm font-bold text-gray-600`}>
                  Subject: {result.testId?.subject || 'N/A'}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <Target className={`w-8 h-8 mx-auto mb-2 text-gray-400`} />
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Max Marks</p>
                  <p className="text-xl font-black text-gray-800">{result.testId?.totalMarks || '--'}</p>
                </div>
                <div className={`p-4 rounded-2xl ${themeColor} shadow-md`}>
                  <Award className="w-8 h-8 mx-auto mb-2 text-white" />
                  <p className="text-xs text-white font-bold uppercase mb-1">Score Obtained</p>
                  <p className="text-2xl font-black text-white">{result.score}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1 mt-6">Percentage</p>
                  <p className="text-xl font-black text-gray-800">
                    {result.testId?.totalMarks ? Math.round((result.score / result.testId.totalMarks) * 100) : 0}%
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1 mt-6">Rank</p>
                  <p className="text-xl font-black text-gray-800">{result.rank || 'N/A'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Results;
