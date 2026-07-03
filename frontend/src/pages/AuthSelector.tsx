import GlobalFooter from '../components/GlobalFooter';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Stethoscope, BookOpen, User, ShieldCheck } from 'lucide-react';

const AuthSelector = () => {
  const location = useLocation();
  const isRegister = location.pathname.includes('register');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          {isRegister ? 'Select Your Program to Register' : 'Select Your Portal to Login'}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Welcome to Academic Companion
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-3xl sm:px-10 border border-slate-100">
          <div className="grid grid-cols-1 gap-4">
            
            <Link to={isRegister ? '/iit/register' : '/iit/login'} className="relative block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-brand-blue hover:ring-1 hover:ring-brand-blue focus:outline-none transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-xl text-brand-blue">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">IIT (IIT/Engineering)</p>
                  <p className="text-sm text-slate-500">Student Portal</p>
                </div>
              </div>
            </Link>

            <Link to={isRegister ? '/neet/register' : '/neet/login'} className="relative block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-emerald-500 hover:ring-1 hover:ring-emerald-500 focus:outline-none transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">NEET (Medical/NEET)</p>
                  <p className="text-sm text-slate-500">Student Portal</p>
                </div>
              </div>
            </Link>

            <Link to={isRegister ? '/upsc/register' : '/upsc/login'} className="relative block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-slate-800 hover:ring-1 hover:ring-slate-800 focus:outline-none transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-100 rounded-xl text-slate-800">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">UPSC (Civil Services)</p>
                  <p className="text-sm text-slate-500">Student Portal</p>
                </div>
              </div>
            </Link>

            {!isRegister && (
              <div className="pt-4 mt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                <Link to="/teacher/login" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors font-bold text-sm">
                  <User className="w-5 h-5 mb-1" />
                  Teacher Portal
                </Link>
                <Link to="/admin/login" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 mb-1" />
                  Admin Portal
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
      <GlobalFooter />
    </div>
);
};

export default AuthSelector;



