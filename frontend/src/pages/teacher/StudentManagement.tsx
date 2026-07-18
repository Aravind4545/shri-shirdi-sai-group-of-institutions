import { useState, useEffect } from 'react';
import { Users, Search, Filter } from 'lucide-react';

const StudentManagement = () => {
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/teacher/students', {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      if (res.ok) setStudents(await res.json());
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center"><Users className="w-6 h-6 mr-2 text-emerald-600" /> My Students</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Viewing students assigned to your program.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
            <input type="text" placeholder="Search by name or ID..." className="pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 w-64" />
          </div>
          <button className="flex items-center px-4 py-2 bg-white border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-600 font-bold text-sm border-b border-slate-200">
            <tr>
              <th className="p-4">Student ID / Name</th>
              <th className="p-4">Program</th>
              <th className="p-4">Stream</th>
              <th className="p-4">Mobile</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, idx) => (
              <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <p className="font-bold text-slate-800">{student.fullName}</p>
                  <p className="text-xs text-slate-500 font-mono mt-1">{student.id?.substring(0, 8).toUpperCase()}</p>
                </td>
                <td className="p-4">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-bold text-xs rounded-full">{student.programInfo?.program || 'N/A'}</span>
                </td>
                <td className="p-4 text-sm font-bold text-slate-600">{student.programInfo?.stream || 'N/A'}</td>
                <td className="p-4 text-sm font-medium text-slate-500">{student.mobileNumber}</td>
                <td className="p-4 text-center">
                  <button className="text-sm font-bold text-emerald-600 hover:text-emerald-800">View Profile</button>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500 italic">No students found for your program.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentManagement;
