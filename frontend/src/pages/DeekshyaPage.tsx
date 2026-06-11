import GlobalFooter from '../components/GlobalFooter';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Activity, HeartPulse, ShieldPlus, Users, Award } from 'lucide-react';
import Navbar from '../components/Navbar';


const DeekshyaPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-emerald-50/30">
      <Navbar />

      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden bg-emerald-900">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl mix-blend-screen" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl mix-blend-screen" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6"
            >
              Deekshya <span className="text-emerald-400">Program</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-emerald-100 font-medium max-w-3xl mx-auto mb-10"
            >
              Your Journey Towards Becoming a Doctor Starts Here
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center gap-6"
            >
              <Link to="/deekshya/register" className="px-8 py-4 font-bold text-emerald-900 bg-emerald-400 rounded-xl hover:bg-emerald-300 transition-colors shadow-lg">
                Register Now
              </Link>
              <Link to="/deekshya/login" className="px-8 py-4 font-bold text-white bg-transparent border-2 border-white rounded-xl hover:bg-white/10 transition-colors shadow-lg">
                Login
              </Link>
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">About Deekshya</h2>
              <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full mb-8" />
              <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                Deekshya is our specialized medical entrance coaching program. Designed specifically for aspiring doctors, it provides an immersive, concept-driven learning environment tailored for NEET and State Medical Exams.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: 'NEET-Focused Coaching', icon: <HeartPulse className="text-emerald-600 w-8 h-8" /> },
                { title: 'Experienced Medical Faculty', icon: <Users className="text-teal-500 w-8 h-8" /> },
                { title: 'Daily Practice Sessions', icon: <Activity className="text-emerald-600 w-8 h-8" /> },
                { title: 'Mock Examinations', icon: <Award className="text-teal-500 w-8 h-8" /> },
                { title: 'Concept-Based Learning', icon: <ShieldPlus className="text-emerald-600 w-8 h-8" /> },
                { title: 'Career Guidance', icon: <CheckCircle className="text-teal-500 w-8 h-8" /> }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center p-6 bg-emerald-50 rounded-xl border border-emerald-100 shadow-sm">
                  <div className="mr-4 bg-white p-3 rounded-lg shadow-sm">{item.icon}</div>
                  <span className="font-bold text-gray-800 text-lg">{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Exams Covered Section */}
        <section className="py-20 bg-emerald-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Exams Covered</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {['NEET', 'AP EAMCET (BiPC)', 'TS EAMCET (BiPC)'].map((exam, idx) => (
                <div key={idx} className="bg-white p-8 rounded-2xl shadow-md text-center border border-emerald-100 hover:-translate-y-2 transition-transform duration-300">
                  <h3 className="text-2xl font-extrabold text-emerald-600">{exam}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Course Details & Features */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Course Details</h2>
              <div className="bg-emerald-900 text-white p-8 rounded-2xl mb-8">
                <h4 className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-2">Stream</h4>
                <p className="text-3xl font-bold mb-6">BiPC Only</p>
                
                <h4 className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-2">Core Subjects</h4>
                <ul className="space-y-3">
                  {['Botany', 'Zoology', 'Physics', 'Chemistry'].map((sub, i) => (
                    <li key={i} className="flex items-center text-lg">
                      <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" /> {sub}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Key Features</h2>
              <div className="space-y-6">
                {[
                  'Daily Tests focusing on speed and accuracy.',
                  'Weekly Grand Tests matching the NEET pattern.',
                  'Rank Prediction based on cumulative performance.',
                  'Detailed Performance Analysis across sub-topics.',
                  'High-yield Study Materials for quick revision.',
                  'Video Lectures from top medical educators.',
                  'Dedicated Doubt Clarification Sessions.'
                ].map((feature, i) => (
                  <div key={i} className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
                    <p className="ml-4 text-gray-700 text-lg">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <GlobalFooter />
    </div>
);
};

export default DeekshyaPage;



