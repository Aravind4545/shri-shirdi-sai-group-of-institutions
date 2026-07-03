import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, Zap, Shield, Target, GraduationCap, ChevronRight, Check } from 'lucide-react';

const AASHVEECompanion = () => {
  const [user, setUser] = useState<any>(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Onboarding State
  const [step, setStep] = useState(1);
  const [style, setStyle] = useState('Tech Visionary');
  const [companionName, setCompanionName] = useState('Jarvis');
  const [studentNickname, setStudentNickname] = useState('Superstar');

  const styles = [
    { name: 'Tech Visionary', icon: <Bot className="w-8 h-8 text-blue-500" />, desc: 'Intelligent, Analytical, Futuristic' },
    { name: 'Anime Warrior', icon: <Zap className="w-8 h-8 text-amber-500" />, desc: 'Motivational, Challenge-oriented' },
    { name: 'Pop Star Energy', icon: <Sparkles className="w-8 h-8 text-pink-500" />, desc: 'Positive, Friendly, Encouraging' },
    { name: 'Elite Achiever', icon: <TrophyIcon className="w-8 h-8 text-yellow-500" />, desc: 'Competitive, High-performance' },
    { name: 'Strategic Genius', icon: <Shield className="w-8 h-8 text-indigo-500" />, desc: 'Logical, Planning-oriented' }
  ];

  useEffect(() => {
    // Fetch companion status
    fetchCompanionConfig();
  }, []);

  const fetchCompanionConfig = async () => {
    try {
      const res = await fetch('/api/companion/config', {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setIsConfigured(data.user?.companionSettings?.isConfigured || false);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    try {
      const res = await fetch('/api/companion/config', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || '' 
        },
        body: JSON.stringify({ style, companionName, studentNickname })
      });
      if (res.ok) {
        setIsConfigured(true);
        fetchCompanionConfig(); // refresh to get new interaction
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="animate-pulse bg-slate-100 h-64 rounded-3xl"></div>;

  if (!isConfigured) {
    return (
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-1 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-[1.4rem] relative z-10 text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">AASHVEE</h2>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Academic Companion Setup</p>
            </div>
          </div>

          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4">
              <h3 className="text-xl font-bold mb-4">Choose Your Companion Style</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {styles.map(s => (
                  <button 
                    key={s.name}
                    onClick={() => setStyle(s.name)}
                    className={`flex items-start gap-4 p-4 rounded-2xl border transition-all text-left ${style === s.name ? 'bg-indigo-500/20 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'}`}
                  >
                    {s.icon}
                    <div>
                      <h4 className={`font-bold ${style === s.name ? 'text-white' : 'text-slate-200'}`}>{s.name}</h4>
                      <p className="text-xs text-slate-400 mt-1">{s.desc}</p>
                    </div>
                    {style === s.name && <Check className="w-5 h-5 text-indigo-400 ml-auto" />}
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(2)} className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-bold py-3 px-8 rounded-xl flex items-center justify-center gap-2 w-full transition-all shadow-lg">
                Continue <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4">
              <h3 className="text-xl font-bold mb-6">Personalize Your Companion</h3>
              
              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">What should I call you?</label>
                  <p className="text-xs text-slate-500 mb-3">Your nickname (e.g., Superstar, Captain, Champion, Legend)</p>
                  <input 
                    type="text" 
                    value={studentNickname} 
                    onChange={e => setStudentNickname(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">What will you name me?</label>
                  <p className="text-xs text-slate-500 mb-3">Your companion's name (e.g., Jarvis, Nova, Atlas, Ryu)</p>
                  <input 
                    type="text" 
                    value={companionName} 
                    onChange={e => setCompanionName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-xl transition-all">
                  Back
                </button>
                <button onClick={handleSaveConfig} className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-3 px-8 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                  Activate Companion <Zap className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return <ActiveCompanion settings={user?.companionSettings} />;
};

const ActiveCompanion = ({ settings }: { settings: any }) => {
  const [dailyInteraction, setDailyInteraction] = useState<any>(null);

  useEffect(() => {
    fetchInteraction();
  }, []);

  const fetchInteraction = async () => {
    try {
      const res = await fetch('/api/companion/daily-interaction', {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      if (res.ok) setDailyInteraction(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const getGreetingTheme = () => {
    switch(settings.style) {
      case 'Tech Visionary': return 'bg-gradient-to-br from-blue-900 to-slate-900 border-blue-800 text-blue-100';
      case 'Anime Warrior': return 'bg-gradient-to-br from-red-900 to-orange-900 border-red-800 text-orange-100';
      case 'Pop Star Energy': return 'bg-gradient-to-br from-pink-900 to-purple-900 border-pink-800 text-pink-100';
      case 'Elite Achiever': return 'bg-gradient-to-br from-amber-900 to-yellow-900 border-amber-800 text-amber-100';
      case 'Strategic Genius': return 'bg-gradient-to-br from-indigo-900 to-slate-900 border-indigo-800 text-indigo-100';
      default: return 'bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 text-slate-100';
    }
  };

  if (!dailyInteraction) return <div className="h-64 rounded-3xl bg-slate-100 animate-pulse"></div>;

  return (
    <div className={`p-6 md:p-8 rounded-3xl shadow-xl border ${getGreetingTheme()} relative overflow-hidden`}>
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <Bot className="w-48 h-48" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="px-3 py-1 bg-white/10 rounded-full border border-white/20 flex items-center gap-2 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-white/80">{settings.companionName} Online</span>
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight text-white">
          {dailyInteraction.greeting} {settings.studentNickname} 👋
        </h2>
        
        <p className="text-lg md:text-xl font-medium text-white/80 mb-8 max-w-2xl leading-relaxed">
          {dailyInteraction.insight}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black/20 backdrop-blur-md rounded-2xl p-5 border border-white/10">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/60 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" /> Today's Focus
            </h3>
            <ul className="space-y-2">
              {dailyInteraction.tasks.map((task: string, i: number) => (
                <li key={i} className="flex items-start gap-2 font-medium text-white/90">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-white/50"></div>
                  {task}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-black/20 backdrop-blur-md rounded-2xl p-5 border border-white/10">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/60 mb-3 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" /> Priority Recommendation
            </h3>
            <div className="font-bold text-white mb-1">{dailyInteraction.priorityTopic}</div>
            <p className="text-sm text-white/70 mb-3">{dailyInteraction.recommendationContext}</p>
            <div className="inline-block px-3 py-1 bg-white/10 rounded-lg border border-white/10 text-xs font-bold text-white">
              Est. Time: {dailyInteraction.estimatedTime}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component
const TrophyIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7c0 3.31 2.69 6 6 6s6-2.69 6-6V2Z" />
  </svg>
);

export default AASHVEECompanion;
