import { useState, useEffect } from 'react';
import { Search, Trash2, Edit } from 'lucide-react';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/admin/students', {
        headers: { 'x-auth-token': localStorage.getItem('adminToken') || '' }
      });
      const data = await res.json();
      if (res.ok) setStudents(data);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await fetch(`/api/admin/students/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': localStorage.getItem('adminToken') || '' }
      });
      fetchStudents();
    } catch (err) { console.error(err); }
  };

  const filtered = students.filter((s: any) => 
    s.fullName.toLowerCase().includes(search.toLowerCase()) || 
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-bold text-slate-800">Student Database</h2>
        <div className="relative w-full md:w-64">
          <input 
            type="text" 
            placeholder="Search students..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm font-bold text-slate-600">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Program</th>
              <th className="p-4">Stream</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((student: any) => (
              <tr key={student.id || student._id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-4 font-semibold text-slate-800">{student.fullName}</td>
                <td className="p-4 text-slate-600">{student.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    student.programInfo_program === 'IIT' ? 'bg-blue-100 text-blue-700' :
                    student.programInfo_program === 'NEET' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-slate-200 text-slate-800'
                  }`}>
                    {student.programInfo_program}
                  </span>
                </td>
                <td className="p-4 text-slate-600 font-medium">{student.programInfo_stream}</td>
                <td className="p-4 flex gap-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(student.id || student._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">No students found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentManagement;
