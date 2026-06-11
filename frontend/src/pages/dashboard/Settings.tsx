import { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, Shield, BellRing, LogOut, Bot, Sparkles } from 'lucide-react';

const Settings = () => {
  const { user, themeColor, fetchProfile } = useOutletContext<any>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    mobileNumber: user.mobileNumber,
    password: ''
  });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  // AASHVEE Companion Settings State
  const [companionData, setCompanionData] = useState({
    style: user.companionSettings?.style || 'Tech Visionary',
    companionName: user.companionSettings?.companionName || 'Jarvis',
    studentNickname: user.companionSettings?.studentNickname || 'Superstar'
  });
  const [companionStatus, setCompanionStatus] = useState({ type: '', msg: '' });
  const [companionLoading, setCompanionLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCompanionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCompanionData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });

    try {
      const res = await fetch('http://localhost:5001/api/user/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || '' 
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', msg: 'Profile updated successfully.' });
        setFormData(prev => ({ ...prev, password: '' })); // clear password field
        if (fetchProfile) {
          fetchProfile();
        }
      } else {
        throw new Error(data.message || data.errors?.[0]?.msg || 'Update failed');
      }
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCompanionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    companionStatus.msg = '';
    setCompanionLoading(true);
    setCompanionStatus({ type: '', msg: '' });

    try {
      const res = await fetch('http://localhost:5001/api/companion/config', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || '' 
        },
        body: JSON.stringify(companionData)
      });
      const data = await res.json();
      if (res.ok) {
        setCompanionStatus({ type: 'success', msg: 'Companion settings updated successfully.' });
        if (fetchProfile) {
          fetchProfile();
        }
      } else {
        throw new Error(data.message || 'Update failed');
      }
    } catch (err: any) {
      setCompanionStatus({ type: 'error', msg: err.message });
    } finally {
      setCompanionLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
        <SettingsIcon className="w-6 h-6 mr-2" /> Account Settings
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">Update Profile</h3>
            
            {status.msg && (
              <div className={`mb-6 p-4 rounded-xl text-sm ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                {status.msg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  name="fullName" 
                  value={formData.fullName} 
                  onChange={handleChange} 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-blue outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number</label>
                <input 
                  type="tel" 
                  name="mobileNumber" 
                  value={formData.mobileNumber} 
                  onChange={handleChange} 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-blue outline-none transition-all" 
                />
              </div>
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-800 flex items-center mb-4"><Shield className="w-4 h-4 mr-1 text-gray-400" /> Change Password (Optional)</h4>
                <input 
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  placeholder="Leave blank to keep current password"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-blue outline-none transition-all" 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-md ${themeColor} hover:opacity-90 transition-opacity disabled:opacity-50`}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* AASHVEE Companion Settings (Students Only) */}
          {user.role === 'Student' && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 mt-6">
              <div className="flex items-center gap-3 mb-6 border-b pb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">AASHVEE Academic Companion</h3>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">AI Assistant Settings</p>
                </div>
              </div>

              {companionStatus.msg && (
                <div className={`mb-6 p-4 rounded-xl text-sm ${companionStatus.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                  {companionStatus.msg}
                </div>
              )}

              <form onSubmit={handleCompanionSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Companion Name</label>
                    <input 
                      type="text" 
                      name="companionName" 
                      value={companionData.companionName} 
                      onChange={handleCompanionChange} 
                      required
                      placeholder="e.g. Jarvis"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-blue outline-none transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Your Nickname</label>
                    <input 
                      type="text" 
                      name="studentNickname" 
                      value={companionData.studentNickname} 
                      onChange={handleCompanionChange} 
                      required
                      placeholder="e.g. Superstar"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-blue outline-none transition-all" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Companion Persona / Style</label>
                  <select
                    name="style"
                    value={companionData.style}
                    onChange={handleCompanionChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-blue outline-none transition-all bg-white"
                  >
                    <option value="Tech Visionary">Tech Visionary (Intelligent, Analytical, Futuristic)</option>
                    <option value="Anime Warrior">Anime Warrior (Motivational, Challenge-oriented)</option>
                    <option value="Pop Star Energy">Pop Star Energy (Positive, Friendly, Encouraging)</option>
                    <option value="Elite Achiever">Elite Achiever (Competitive, High-performance)</option>
                    <option value="Strategic Genius">Strategic Genius (Logical, Planning-oriented)</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  disabled={companionLoading}
                  className={`w-full py-4 rounded-xl font-bold text-white shadow-md ${themeColor} hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2`}
                >
                  <Sparkles className="w-5 h-5" />
                  {companionLoading ? 'Saving Companion Settings...' : 'Update Companion Settings'}
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
            <h3 className="text-md font-bold text-gray-800 mb-4 flex items-center">
              <BellRing className="w-5 h-5 mr-2 text-gray-400" /> Notifications
            </h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium text-gray-700">Email Alerts</span>
                <input type="checkbox" defaultChecked className="form-checkbox h-5 w-5 text-brand-blue" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium text-gray-700">SMS Alerts</span>
                <input type="checkbox" defaultChecked className="form-checkbox h-5 w-5 text-brand-blue" />
              </label>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-red-100">
            <h3 className="text-md font-bold text-red-600 mb-2">Danger Zone</h3>
            <p className="text-sm text-gray-500 mb-4">Log out securely from this device.</p>
            <button onClick={handleLogout} className="w-full py-3 rounded-xl font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors flex justify-center items-center">
              <LogOut className="w-5 h-5 mr-2" /> Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
