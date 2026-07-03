import GlobalFooter from '../components/GlobalFooter';
import React, { useState, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, Camera, ScanFace } from 'lucide-react';
import Webcam from 'react-webcam';

const UniversalLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginPortal, setLoginPortal] = useState<'student' | 'college' | 'parent'>('student');
  const [loginMethod, setLoginMethod] = useState<'credentials' | 'face'>('credentials');
  
  const navigate = useNavigate();
  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    return imageSrc;
  }, [webcamRef]);

  const handleRouteSuccess = (data: any) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    const role = data.user.role;
    if (loginPortal === 'parent') {
      navigate('/parent/dashboard');
    } else if (role === 'HOD') {
      navigate('/hod/dashboard');
    } else if (role === 'Teacher') {
      navigate('/teacher/dashboard');
    } else if (role === 'Admin' || role === 'SuperAdmin') {
      localStorage.setItem('adminToken', data.token);
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        handleRouteSuccess(data);
      } else {
        setError(data.msg || data.message || 'Invalid Credentials');
      }
    } catch (err) {
      setError('Server connection error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFaceLogin = async () => {
    setError('');
    const imageBase64 = capture();
    if (!imageBase64) {
      setError('Please allow camera access and try again.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/faceAuth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64 })
      });
      const data = await res.json();
      
      if (res.ok) {
        handleRouteSuccess(data);
      } else {
        setError(data.msg || data.message || 'Face recognition failed.');
      }
    } catch (err) {
      setError('Server connection error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-2">
          <BookOpen className="h-10 w-10 text-brand-blue" />
          <span className="font-bold text-2xl tracking-tight text-slate-800">
            Academic Companion
          </span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Universal Portal Access
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 font-medium">
          Secure login for Students, Faculty, and Administration
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-2xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-100">
          
          {/* Main Portal Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
            <button
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${loginPortal === 'student' ? 'bg-white shadow-sm text-brand-blue' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => { setLoginPortal('student'); setLoginMethod('credentials'); }}
            >
              Student
            </button>
            <button
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${loginPortal === 'parent' ? 'bg-white shadow-sm text-brand-blue' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => { setLoginPortal('parent'); setLoginMethod('credentials'); }}
            >
              Parent
            </button>
            <button
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${loginPortal === 'college' ? 'bg-white shadow-sm text-brand-blue' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => setLoginPortal('college')}
            >
              College
            </button>
          </div>

          {/* Sub-tabs for College Login */}
          {loginPortal === 'college' && (
            <div className="flex justify-center gap-4 mb-6 border-b border-slate-100 pb-4">
              <button
                className={`text-sm font-bold px-4 py-1.5 rounded-full transition-all ${loginMethod === 'credentials' ? 'bg-slate-200 text-slate-800 shadow-inner' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
                onClick={() => setLoginMethod('credentials')}
              >
                Credentials
              </button>
              <button
                className={`text-sm font-bold px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${loginMethod === 'face' ? 'bg-slate-200 text-slate-800 shadow-inner' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
                onClick={() => setLoginMethod('face')}
              >
                <ScanFace className="w-3.5 h-3.5" /> Face Login
              </button>
            </div>
          )}

          {error && (
            <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm font-bold mb-6 border border-rose-100 text-center animate-pulse">
              {error}
            </div>
          )}

          {loginMethod === 'credentials' ? (
            <form className="space-y-6" onSubmit={handleCredentialsLogin}>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm font-medium transition-colors"
                    placeholder="name@domain.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm font-medium transition-colors"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-brand-blue focus:ring-brand-blue border-slate-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700 font-medium">
                    Remember me
                  </label>
                </div>
                <div className="text-sm font-semibold">
                  <a href="#" className="text-brand-blue hover:text-blue-800 transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md shadow-brand-blue/20 text-sm font-bold text-white bg-brand-blue hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? 'Authenticating...' : 'Secure Sign In'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6 flex flex-col items-center">
              <div className="w-full aspect-square bg-slate-100 rounded-2xl overflow-hidden relative border-2 border-dashed border-slate-300 flex items-center justify-center">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="absolute inset-0 w-full h-full object-cover"
                  videoConstraints={{
                    width: 400,
                    height: 400,
                    facingMode: "user"
                  }}
                />
                {/* Overlay box */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="w-48 h-48 border-2 border-brand-blue rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_0_9999px_rgba(255,255,255,0.7)] mix-blend-hard-light" />
                </div>
              </div>

              <p className="text-sm text-slate-500 font-medium text-center px-4">
                Position your face inside the circle. Our Liveness Detection will automatically verify.
              </p>

              <button
                type="button"
                onClick={handleFaceLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md shadow-emerald-500/20 text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Scanning Face...' : <><ScanFace className="w-5 h-5" /> Authenticate Face</>}
              </button>
            </div>
          )}

          <div className="mt-8 text-center text-sm text-slate-500 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-blue font-bold hover:text-blue-800 transition-colors">
              Register here
            </Link>
          </div>
        </div>
      </div>
      <GlobalFooter />
    </div>
);
};

export default UniversalLogin;



