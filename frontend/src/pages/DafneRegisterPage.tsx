import GlobalFooter from '../components/GlobalFooter';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';


const DafneRegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    dateOfBirth: '',
    academicInfo: {
      intermediateYear: '',
      collegeName: '',
      state: ''
    },
    stream: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('academic_')) {
      const field = name.split('_')[1];
      setFormData(prev => ({
        ...prev,
        academicInfo: { ...prev.academicInfo, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.mobileNumber.length < 10) {
      setError('Enter a valid mobile number');
      return false;
    }
    if (!formData.stream) {
      setError('Please select a stream (MEC or CEC)');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          mobileNumber: formData.mobileNumber,
          email: formData.email,
          password: formData.password,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
          academicInfo: formData.academicInfo,
          programInfo: {
            program: 'DAFNE',
            stream: formData.stream,
            exams: []
          }
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.msg || data.message || data.errors?.[0]?.msg || 'Registration failed');
      }
      setSuccess(data.msg || 'Registration successful! Your account is pending admin approval. You will be able to log in once approved.');
      setFormData({
        fullName: '',
        mobileNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
        dateOfBirth: '',
        academicInfo: { intermediateYear: '', collegeName: '', state: '' },
        exams: []
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl w-full max-w-4xl border border-slate-200">
          <div className="mb-8">
            <Link to="/dafne" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium mb-6">
              <ArrowLeft className="mr-2 w-5 h-5" /> Back to DAFNE Program
            </Link>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Student Registration</h1>
            <p className="text-slate-500">Program: <span className="font-bold text-amber-600">DAFNE</span></p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-6 bg-green-50 border border-green-200 text-green-800 rounded-xl flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <h3 className="text-lg font-bold">Registration Submitted!</h3>
                <p className="mt-1">{success}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div>
              <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2 mb-6">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Mobile Number *</label>
                  <input required type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Gender *</label>
                    <select required name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none transition-all">
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Date of Birth *</label>
                    <input required type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Password *</label>
                  <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Confirm Password *</label>
                  <input required type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none transition-all" />
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div>
              <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2 mb-6">Academic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Intermediate Year *</label>
                  <select required name="academic_intermediateYear" value={formData.academicInfo.intermediateYear} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none transition-all">
                    <option value="">Select</option>
                    <option value="1st Year">1st Year (Class 11)</option>
                    <option value="2nd Year">2nd Year (Class 12)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">College Name *</label>
                  <input required type="text" name="academic_collegeName" value={formData.academicInfo.collegeName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">State *</label>
                  <input required type="text" name="academic_state" value={formData.academicInfo.state} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none transition-all" />
                </div>
              </div>
            </div>

            {/* Stream Selection */}
            <div>
              <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2 mb-6">Stream Selection</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
                <div 
                  onClick={() => setFormData(prev => ({ ...prev, stream: 'MEC' }))}
                  className={`cursor-pointer border-2 rounded-xl p-4 flex items-center transition-all ${formData.stream === 'MEC' ? 'border-amber-500 bg-amber-50' : 'border-slate-200 hover:border-amber-300 hover:bg-slate-50'}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${formData.stream === 'MEC' ? 'border-amber-500 bg-amber-500' : 'border-slate-300'}`}>
                    {formData.stream === 'MEC' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span className={`font-semibold ${formData.stream === 'MEC' ? 'text-slate-900' : 'text-slate-600'}`}>MEC</span>
                </div>
                
                <div 
                  onClick={() => setFormData(prev => ({ ...prev, stream: 'CEC' }))}
                  className={`cursor-pointer border-2 rounded-xl p-4 flex items-center transition-all ${formData.stream === 'CEC' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${formData.stream === 'CEC' ? 'border-blue-500 bg-blue-500' : 'border-slate-300'}`}>
                    {formData.stream === 'CEC' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span className={`font-semibold ${formData.stream === 'CEC' ? 'text-slate-900' : 'text-slate-600'}`}>CEC</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between">
              <p className="text-slate-500 text-sm mb-4 md:mb-0">Already have an account? <Link to="/dafne/login" className="text-blue-600 font-bold hover:underline">Log in</Link></p>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full md:w-auto px-10 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg disabled:opacity-50"
              >
                {loading ? 'Registering...' : 'Submit Registration'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <GlobalFooter />
    </div>
);
};

export default DafneRegisterPage;



