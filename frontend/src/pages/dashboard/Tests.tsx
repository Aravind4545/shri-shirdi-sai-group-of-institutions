import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Clock, Book, PlayCircle } from 'lucide-react';

import { Link } from 'react-router-dom';

const Tests = () => {
  const { themeColor } = useOutletContext<any>();
  const [tests, setTests] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5001/api/dashboard/tests', {
      headers: { 'x-auth-token': localStorage.getItem('token') || '' }
    })
      .then(res => res.json())
      .then(data => {
        const fallback = [
          { _id: 't1', title: 'Mid Term Physics Exam', subject: 'Physics', date: new Date().toISOString(), totalMarks: 100 },
          { _id: 't2', title: 'Calculus Quiz', subject: 'Mathematics', date: new Date().toISOString(), totalMarks: 50 }
        ];
        setTests(data && data.length > 0 ? data : fallback);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Available Tests</h2>
      
      {tests.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-200">
          <p className="text-gray-500 font-medium">No active tests right now.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tests.map((test: any) => (
            <div key={test._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center justify-between hover:shadow-md transition-shadow">
              <div className="mb-4 md:mb-0">
                <h3 className="font-bold text-lg text-gray-900 mb-2">{test.title}</h3>
                <div className="flex justify-between items-center text-sm mb-6">
              <span className="flex items-center text-slate-600"><Book className="w-4 h-4 mr-2" /> {test.subject}</span>
              <span className="flex items-center text-slate-600"><Clock className="w-4 h-4 mr-2" /> {test.durationMinutes} Mins</span>
            </div>
            <Link to={`/exam/${test._id}`} className={`w-full py-3 rounded-xl font-bold flex items-center justify-center transition-colors shadow-md text-white bg-${themeColor}-600 hover:bg-${themeColor}-700`}>
              <PlayCircle className="w-5 h-5 mr-2" /> Start Test Now
            </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tests;
