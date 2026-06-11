import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ShieldCheck, UserX, ScanFace, X, Camera, Upload, Edit, Trash2, UserPlus, FileImage } from 'lucide-react';
import Webcam from 'react-webcam';

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [isFaceModalOpen, setIsFaceModalOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  
  // Selected state
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  
  // Face Registration State
  const [registeringFace, setRegisteringFace] = useState(false);
  const [faceError, setFaceError] = useState('');
  const [faceSuccess, setFaceSuccess] = useState('');
  const [faceMode, setFaceMode] = useState<'camera' | 'upload'>('camera');
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Teacher Form State
  const [formData, setFormData] = useState({
    fullName: '',
    employeeId: '',
    email: '',
    mobileNumber: '',
    password: '',
    subject: '',
    assignedProgram: 'All',
    status: 'Active'
  });
  const [formError, setFormError] = useState('');

  const fetchTeachers = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/teachers');
      const data = await res.json();
      setTeachers(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // --- Teacher Form Logic ---
  const handleOpenTeacherModal = (teacher: any = null) => {
    setFormError('');
    if (teacher) {
      setSelectedTeacher(teacher);
      setFormData({
        fullName: teacher.fullName || '',
        employeeId: teacher.employeeId || '',
        email: teacher.email || '',
        mobileNumber: teacher.mobileNumber || '',
        password: '', // Leave blank when editing
        subject: teacher.subject || '',
        assignedProgram: teacher.assignedProgram || 'All',
        status: teacher.status || 'Active'
      });
    } else {
      setSelectedTeacher(null);
      setFormData({
        fullName: '',
        employeeId: '',
        email: '',
        mobileNumber: '',
        password: '',
        subject: '',
        assignedProgram: 'Lakshya',
        status: 'Active'
      });
    }
    setIsTeacherModalOpen(true);
  };

  const handleSaveTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    try {
      const isEdit = !!selectedTeacher;
      const url = isEdit ? `http://localhost:5001/api/teachers/${selectedTeacher._id}` : `http://localhost:5001/api/teachers`;
      const method = isEdit ? 'PUT' : 'POST';
      
      const payload = { ...formData };
      if (isEdit && !payload.password) {
        delete (payload as any).password;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        fetchTeachers();
        setIsTeacherModalOpen(false);
      } else {
        const data = await res.json();
        setFormError(data.msg || 'Error saving teacher');
      }
    } catch (err) {
      setFormError('Server error');
    }
  };

  const handleDeleteTeacher = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this teacher?')) return;
    try {
      await fetch(`http://localhost:5001/api/teachers/${id}`, { method: 'DELETE' });
      fetchTeachers();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTeacherStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      await fetch(`http://localhost:5001/api/teachers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchTeachers();
    } catch (err) {
      console.error(err);
    }
  };

  // --- Face Registration Logic ---
  const openFaceModal = (teacher: any) => {
    setSelectedTeacher(teacher);
    setIsFaceModalOpen(true);
    setFaceError('');
    setFaceSuccess('');
  };

  const closeFaceModal = () => {
    setIsFaceModalOpen(false);
    setSelectedTeacher(null);
  };

  const registerFaceAPI = async (imageBase64: string) => {
    setRegisteringFace(true);
    setFaceError('');
    try {
      // Use the email specifically for face auth mapping
      const res = await fetch('http://localhost:5001/api/faceAuth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: selectedTeacher.email,
          imageBase64: imageBase64
        })
      });
      const data = await res.json();

      if (res.ok) {
        setFaceSuccess('Face successfully registered and embedding saved.');
        fetchTeachers(); 
        setTimeout(() => closeFaceModal(), 2000);
      } else {
        setFaceError(data.msg || 'Registration failed');
      }
    } catch (err) {
      setFaceError('Server error during face registration.');
    } finally {
      setRegisteringFace(false);
    }
  };

  const handleCaptureCamera = useCallback(() => {
    const imageBase64 = webcamRef.current?.getScreenshot();
    if (!imageBase64) {
      setFaceError('Failed to capture image from camera');
      return;
    }
    registerFaceAPI(imageBase64);
  }, [webcamRef, selectedTeacher]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      registerFaceAPI(base64String.split(',')[1]); // Provide raw base64 to the backend, wait, registerFaceAPI sends it as is. 
      // The backend expects base64 without data uri header, or handles it. The python service usually handles base64 with or without header.
      // But let's send exactly what webcam sends. react-webcam sends data:image/jpeg;base64,... 
    };
    reader.readAsDataURL(file);
  };

  // Modify file upload handler to send exact base64 dataURI
  const handleFileUploadDataURI = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      registerFaceAPI(base64String); 
    };
    reader.readAsDataURL(file);
  };

  if (loading) return <div>Loading Teachers...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Teacher Management</h2>
        <button 
          onClick={() => handleOpenTeacherModal()}
          className="bg-brand-blue text-white px-5 py-2.5 rounded-xl font-bold shadow-md hover:bg-blue-800 flex items-center gap-2 transition-colors"
        >
          <UserPlus className="w-5 h-5" /> Add New Teacher
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
                <th className="p-4 font-bold">Teacher Details</th>
                <th className="p-4 font-bold">Assignment</th>
                <th className="p-4 font-bold">Security Status</th>
                <th className="p-4 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map(teacher => (
                <tr key={teacher._id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${teacher.status === 'Inactive' ? 'opacity-60' : ''}`}>
                  <td className="p-4">
                    <div className="font-bold text-slate-800">{teacher.fullName}</div>
                    <div className="text-xs text-slate-500">{teacher.email}</div>
                    <div className="text-xs font-mono text-slate-400 mt-1">ID: {teacher.employeeId || teacher.teacherId}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-bold text-brand-blue">{teacher.assignedProgram}</div>
                    <div className="text-xs text-slate-600">{teacher.subject || 'No Subject'}</div>
                  </td>
                  <td className="p-4 space-y-2">
                    {/* Face Security */}
                    <div>
                      {teacher.faceLoginEnabled ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold">
                          <ShieldCheck className="w-3.5 h-3.5" /> Face Login OK
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-100 text-rose-700 rounded-lg text-xs font-bold">
                          <UserX className="w-3.5 h-3.5" /> Face Disabled
                        </span>
                      )}
                    </div>
                    {/* Account Status */}
                    <div>
                      {teacher.status === 'Active' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">
                          Account Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold">
                          Account Suspended
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      <button 
                        onClick={() => openFaceModal(teacher)}
                        className="text-xs font-bold text-slate-700 hover:text-brand-blue flex items-center gap-1 bg-slate-100 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors border border-slate-200"
                        title="Manage Face Biometrics"
                      >
                        <ScanFace className="w-4 h-4" /> Manage Face
                      </button>
                      
                      <button 
                        onClick={() => handleOpenTeacherModal(teacher)}
                        className="text-xs font-bold text-slate-700 hover:text-amber-600 flex items-center gap-1 bg-slate-100 hover:bg-amber-50 px-3 py-2 rounded-lg transition-colors border border-slate-200"
                      >
                        <Edit className="w-4 h-4" /> Edit
                      </button>

                      <button 
                        onClick={() => toggleTeacherStatus(teacher._id, teacher.status)}
                        className={`text-xs font-bold flex items-center gap-1 px-3 py-2 rounded-lg transition-colors border ${teacher.status === 'Active' ? 'text-rose-600 bg-rose-50 hover:bg-rose-100 border-rose-200' : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border-emerald-200'}`}
                      >
                        {teacher.status === 'Active' ? 'Suspend' : 'Activate'}
                      </button>

                      <button 
                        onClick={() => handleDeleteTeacher(teacher._id)}
                        className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center justify-center bg-rose-50 px-3 py-2 rounded-lg transition-colors border border-rose-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Teacher Create/Edit Modal --- */}
      {isTeacherModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <UserPlus className="w-6 h-6 text-brand-blue" />
                {selectedTeacher ? 'Edit Teacher Details' : 'Register New Teacher'}
              </h3>
              <button onClick={() => setIsTeacherModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {formError && <div className="mb-4 p-3 bg-rose-50 text-rose-600 text-sm font-bold rounded-xl border border-rose-100">{formError}</div>}
              
              <form id="teacherForm" onSubmit={handleSaveTeacher} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Teacher Full Name *</label>
                  <input required type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Employee ID *</label>
                  <input required type="text" value={formData.employeeId} onChange={e => setFormData({...formData, employeeId: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Email Address *</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Mobile Number *</label>
                  <input required type="text" value={formData.mobileNumber} onChange={e => setFormData({...formData, mobileNumber: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Password {selectedTeacher && '(Leave blank to keep)'}</label>
                  <input type="password" required={!selectedTeacher} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Subject</label>
                  <input type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Assigned Program</label>
                  <select value={formData.assignedProgram} onChange={e => setFormData({...formData, assignedProgram: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none bg-white">
                    <option value="Lakshya">Lakshya</option>
                    <option value="Deekshya">Deekshya</option>
                    <option value="DAFNE">DAFNE</option>
                    <option value="All">All Programs</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Account Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none bg-white">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0 flex justify-end gap-3">
              <button onClick={() => setIsTeacherModalOpen(false)} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors">
                Cancel
              </button>
              <button form="teacherForm" type="submit" className="px-6 py-2.5 bg-brand-blue text-white font-bold rounded-xl shadow-md hover:bg-blue-800 transition-colors">
                {selectedTeacher ? 'Save Changes' : 'Create Teacher'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Face Registration Modal --- */}
      {isFaceModalOpen && selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <ScanFace className="w-6 h-6 text-brand-blue" />
                Register Face: {selectedTeacher.fullName}
              </h3>
              <button onClick={closeFaceModal} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Mode Switcher */}
            <div className="p-4 flex justify-center bg-slate-100">
              <div className="bg-white p-1 rounded-xl shadow-sm inline-flex">
                <button 
                  onClick={() => setFaceMode('camera')}
                  className={`px-4 py-2 text-sm font-bold rounded-lg flex items-center gap-2 transition-colors ${faceMode === 'camera' ? 'bg-brand-blue text-white shadow' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Camera className="w-4 h-4" /> Use Webcam
                </button>
                <button 
                  onClick={() => setFaceMode('upload')}
                  className={`px-4 py-2 text-sm font-bold rounded-lg flex items-center gap-2 transition-colors ${faceMode === 'upload' ? 'bg-brand-blue text-white shadow' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Upload className="w-4 h-4" /> Upload Image
                </button>
              </div>
            </div>

            <div className="p-6 flex flex-col items-center">
              {faceError && <div className="w-full p-3 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold mb-4 border border-rose-100">{faceError}</div>}
              {faceSuccess && <div className="w-full p-3 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold mb-4 border border-emerald-100">{faceSuccess}</div>}

              {faceMode === 'camera' ? (
                <>
                  <div className="w-64 h-64 bg-slate-100 rounded-full overflow-hidden border-4 border-brand-blue relative shadow-inner mb-6">
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="absolute inset-0 w-full h-full object-cover"
                      videoConstraints={{ width: 400, height: 400, facingMode: "user" }}
                    />
                  </div>
                  <button
                    onClick={handleCaptureCamera}
                    disabled={registeringFace}
                    className="w-full py-3 bg-brand-blue hover:bg-blue-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {registeringFace ? 'Extracting Embedding...' : <><Camera className="w-5 h-5" /> Capture & Process</>}
                  </button>
                </>
              ) : (
                <>
                  <div className="w-64 h-64 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center mb-6 text-slate-500">
                    <FileImage className="w-16 h-16 text-slate-300 mb-2" />
                    <span className="text-sm font-medium">Select a clear portrait photo</span>
                  </div>
                  
                  <input 
                    type="file" 
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileUploadDataURI}
                    className="hidden"
                  />

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={registeringFace}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {registeringFace ? 'Extracting Embedding...' : <><Upload className="w-5 h-5" /> Choose File & Register</>}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherManagement;
