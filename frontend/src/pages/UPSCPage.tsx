import GlobalFooter from '../components/GlobalFooter';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Landmark, Users, TrendingUp, Presentation, MessageSquare, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';


const UPSCPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden bg-slate-900">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl mix-blend-screen" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl mix-blend-screen" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6"
            >
              UPSC <span className="text-amber-500">Program</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-slate-300 font-medium max-w-3xl mx-auto mb-10"
            >
              Building Future Civil Servants and Nation Leaders
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center gap-6"
            >
              <Link to="/upsc/register" className="px-8 py-4 font-bold text-slate-900 bg-amber-500 rounded-xl hover:bg-amber-400 transition-colors shadow-lg">
                Register Now
              </Link>
              <Link to="/upsc/login" className="px-8 py-4 font-bold text-white bg-transparent border-2 border-white rounded-xl hover:bg-white/10 transition-colors shadow-lg">
                Login
              </Link>
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">About UPSC</h2>
              <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full mb-8" />
              <p className="text-lg text-slate-600 max-w-4xl mx-auto">
                UPSC is meticulously designed for students aspiring to Civil Services, Government Jobs, Public Administration, Law, Economics, and Leadership Careers.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: 'Civil Services Foundation', icon: <Landmark className="text-blue-600 w-8 h-8" /> },
                { title: 'Leadership Development', icon: <Users className="text-amber-500 w-8 h-8" /> },
                { title: 'Public Administration', icon: <ShieldCheck className="text-blue-600 w-8 h-8" /> },
                { title: 'Economics & Governance', icon: <TrendingUp className="text-amber-500 w-8 h-8" /> },
                { title: 'Communication Skills', icon: <MessageSquare className="text-blue-600 w-8 h-8" /> },
                { title: 'Government Career Guidance', icon: <Presentation className="text-amber-500 w-8 h-8" /> }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center p-6 bg-slate-50 rounded-xl border border-slate-100 shadow-sm">
                  <div className="mr-4 bg-white p-3 rounded-lg shadow-sm">{item.icon}</div>
                  <span className="font-bold text-slate-800 text-lg">{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Civil Services Foundation & Streams */}
        <section className="py-20 bg-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Civil Services Foundation</h2>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-slate-600 mb-6 text-lg">
                  Our foundation program provides early exposure and structured preparation for top-tier government examinations.
                </p>
                <ul className="space-y-4">
                  {['UPSC Foundation', 'APPSC Foundation', 'TSPSC Foundation', 'Group Services Awareness', 'Current Affairs Preparation', 'Communication Skills'].map((item, i) => (
                    <li key={i} className="flex items-center text-lg font-medium text-slate-800">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-4">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Streams Offered</h2>
              <div className="space-y-6">
                <div className="bg-slate-900 text-white p-8 rounded-2xl relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/20 rounded-bl-full" />
                  <h3 className="text-3xl font-bold text-amber-500 mb-4">MEC</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center"><CheckCircle className="w-5 h-5 mr-3 text-amber-500"/> Mathematics</li>
                    <li className="flex items-center"><CheckCircle className="w-5 h-5 mr-3 text-amber-500"/> Economics</li>
                    <li className="flex items-center"><CheckCircle className="w-5 h-5 mr-3 text-amber-500"/> Commerce</li>
                  </ul>
                </div>

                <div className="bg-blue-900 text-white p-8 rounded-2xl relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-bl-full" />
                  <h3 className="text-3xl font-bold text-blue-300 mb-4">CEC</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center"><CheckCircle className="w-5 h-5 mr-3 text-blue-300"/> Civics</li>
                    <li className="flex items-center"><CheckCircle className="w-5 h-5 mr-3 text-blue-300"/> Economics</li>
                    <li className="flex items-center"><CheckCircle className="w-5 h-5 mr-3 text-blue-300"/> Commerce</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Program Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                'Current Affairs Sessions',
                'Debate Activities',
                'Leadership Workshops',
                'Communication Training',
                'Personality Development',
                'Mock Assessments',
                'Study Materials'
              ].map((feature, i) => (
                <div key={i} className="flex flex-col items-center p-8 bg-slate-50 rounded-2xl border border-slate-100 text-center hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                    <CheckCircle className="w-6 h-6 text-amber-600" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-lg">{feature}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <GlobalFooter />
    </div>
);
};

export default UPSCPage;



