import { useState, useEffect } from 'react';
import { CalendarCheck, Save, Users, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

const TeacherAttendance = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, string>>({}); // studentId -> status
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchStudentsAndAttendance();
  }, [selectedDate]);

  const fetchStudentsAndAttendance = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Fetch assigned students
      const stdRes = await fetch('https://shri-shirdi-sai-group-of-institutions.onrender.com/api/teacher/students', {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      const stdData = await stdRes.json();
      
      if (stdRes.ok) {
        const fallback = [
          { _id: 's1', fullName: 'Rahul Verma', rollNumber: 'R001', gender: 'Male' },
          { _id: 's2', fullName: 'Priya Sharma', rollNumber: 'R002', gender: 'Female' }
        ];
        setStudents(stdData && stdData.length > 0 ? stdData : fallback);
      } else {
        throw new Error(stdData.msg || 'Failed to load students');
      }

      // Fetch attendance for the specific date
      const attRes = await fetch(`https://shri-shirdi-sai-group-of-institutions.onrender.com/api/teacher/attendance?date=${selectedDate}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      const attData = await attRes.json();

      if (attRes.ok) {
        const recordsMap: Record<string, string> = {};
        // Map student ID to their status
        attData.forEach((record: any) => {
          recordsMap[record.studentId] = record.status;
        });
        setAttendanceRecords(recordsMap);
      } else {
        throw new Error(attData.msg || 'Failed to load attendance');
      }

    } catch (err: any) {
      setError(err.message || 'Server error connecting to backend');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    // Prepare array of records to save
    // We only save records that have been toggled or loaded
    const recordsToSave = Object.keys(attendanceRecords).map(studentId => ({
      studentId,
      status: attendanceRecords[studentId]
    }));

    if (recordsToSave.length === 0) {
      setError("No attendance records have been marked.");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch('https://shri-shirdi-sai-group-of-institutions.onrender.com/api/teacher/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || ''
        },
        body: JSON.stringify({
          date: selectedDate,
          records: recordsToSave
        })
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess('Attendance saved successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.msg || 'Failed to save attendance');
      }
    } catch (err) {
      setError('Server error saving attendance');
    } finally {
      setSaving(false);
    }
  };

  if (loading && students.length === 0) {
    return <div className="text-center p-10 font-bold text-slate-500 animate-pulse">Loading Students & Attendance...</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-emerald-600" />
            Class Attendance
          </h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Mark and review daily attendance for your assigned students</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-rose-50 text-rose-600 p-4 rounded-xl text-sm font-bold border border-rose-100">
          <AlertCircle className="w-5 h-5" /> {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm font-bold border border-emerald-200">
          <CheckCircle2 className="w-5 h-5" /> {success}
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
            <CalendarCheck className="w-5 h-5 text-emerald-600" />
            <input 
              type="date" 
              className="bg-transparent border-none text-base font-bold text-slate-700 focus:outline-none focus:ring-0 cursor-pointer"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <button 
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50"
          >
            {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10 font-bold text-slate-400">Refreshing data...</div>
        ) : students.length === 0 ? (
          <div className="text-center py-10 font-bold text-slate-500">No students assigned to your program.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student) => {
              const status = attendanceRecords[student._id];
              return (
                <div key={student._id} className={`p-4 rounded-xl border-2 transition-all ${status === 'Present' ? 'border-emerald-200 bg-emerald-50/30' : status === 'Absent' ? 'border-rose-200 bg-rose-50/30' : 'border-slate-100 bg-white'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-slate-800 line-clamp-1">{student.fullName}</h3>
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{student.programInfo?.program}</span>
                  </div>
                  
                  <div className="flex grid grid-cols-2 gap-2 mt-4">
                    <button 
                      onClick={() => handleStatusChange(student._id, 'Present')}
                      className={`flex justify-center items-center gap-1.5 py-2 rounded-lg font-bold text-sm transition-colors ${
                        status === 'Present' 
                        ? 'bg-emerald-600 text-white shadow-sm' 
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" /> Present
                    </button>
                    <button 
                      onClick={() => handleStatusChange(student._id, 'Absent')}
                      className={`flex justify-center items-center gap-1.5 py-2 rounded-lg font-bold text-sm transition-colors ${
                        status === 'Absent' 
                        ? 'bg-rose-500 text-white shadow-sm' 
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      <XCircle className="w-4 h-4" /> Absent
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherAttendance;
