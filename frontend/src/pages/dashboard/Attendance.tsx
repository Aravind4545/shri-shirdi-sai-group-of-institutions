import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { CalendarCheck, CheckCircle2, XCircle } from 'lucide-react';

const Attendance = () => {
  const { textColor } = useOutletContext<any>();
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    fetch('/api/dashboard/attendance', {
      headers: { 'x-auth-token': localStorage.getItem('token') || '' }
    })
      .then(res => res.json())
      .then(data => setAttendance(data))
      .catch(err => console.error(err));
  }, []);

  const total = attendance.length;
  const present = attendance.filter((a: any) => a.status === 'Present').length;
  const absent = total - present;
  const percentage = total > 0 ? Math.round((present / total) * 100) : 100;

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
        <CalendarCheck className="w-6 h-6 mr-2" /> Attendance Record
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 text-center">
          <p className="text-sm font-bold text-gray-500 uppercase mb-2">Total Classes</p>
          <p className="text-4xl font-black text-gray-800">{total}</p>
        </div>
        <div className="bg-emerald-50 p-6 rounded-3xl shadow-sm border border-emerald-100 text-center">
          <p className="text-sm font-bold text-emerald-600 uppercase mb-2">Present Days</p>
          <p className="text-4xl font-black text-emerald-600">{present}</p>
        </div>
        <div className="bg-red-50 p-6 rounded-3xl shadow-sm border border-red-100 text-center">
          <p className="text-sm font-bold text-red-500 uppercase mb-2">Absent Days</p>
          <p className="text-4xl font-black text-red-500">{absent}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 text-center mb-8">
        <p className="text-lg font-bold text-gray-600 mb-2">Overall Attendance Percentage</p>
        <div className={`text-6xl font-black ${percentage < 75 ? 'text-red-500' : textColor}`}>
          {percentage}%
        </div>
        {percentage < 75 && (
          <p className="text-red-500 font-medium mt-4">Warning: Your attendance is below the required 75% threshold.</p>
        )}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-800">Recent Logs</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {attendance.slice(0, 10).map((record: any) => (
            <div key={record._id} className="p-4 px-6 flex justify-between items-center">
              <span className="font-medium text-gray-700">{new Date(record.date).toLocaleDateString()}</span>
              {record.status === 'Present' ? (
                <span className="flex items-center text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full text-sm">
                  <CheckCircle2 className="w-4 h-4 mr-1" /> Present
                </span>
              ) : (
                <span className="flex items-center text-red-500 font-bold bg-red-50 px-3 py-1 rounded-full text-sm">
                  <XCircle className="w-4 h-4 mr-1" /> Absent
                </span>
              )}
            </div>
          ))}
          {attendance.length === 0 && (
            <div className="p-6 text-center text-gray-500">No logs found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
