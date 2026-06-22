import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TeacherLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('https://shri-shirdi-sai-group-of-institutions.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        if (data.user?.role === 'HOD') {
          navigate('/hod/dashboard');
        } else {
          navigate('/teacher/dashboard');
        }
      } else {
        setError(data.msg || 'Invalid Credentials');
      }
    } catch (err) {
      setError('Server Error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tight text-slate-800">SSSI <span className="text-emerald-500">Teacher</span></h1>
          <p className="text-slate-500 font-medium mt-2 text-sm">Secure Portal Login</p>
        </div>
        
        {error && <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm font-bold mb-6 border border-rose-100 text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium" 
              required 
            />
          </div>
          <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-500/20">
            Sign In to Portal
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeacherLogin;
