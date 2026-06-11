import GlobalFooter from '../components/GlobalFooter';

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, BookOpen, Target, PenTool, Users, Award } from 'lucide-react';
import Navbar from '../components/Navbar';


const LakshyaPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-brand-light">
      <Navbar />

      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden bg-brand-dark">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/30 rounded-full blur-3xl mix-blend-screen" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-gold/20 rounded-full blur-3xl mix-blend-screen" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6"
            >
              Lakshya <span className="text-brand-gold">Program</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-300 font-medium max-w-3xl mx-auto mb-10"
            >
              Your Pathway to IITs and Top Engineering Colleges
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center gap-6"
            >
              <Link to="/lakshya/register" className="px-8 py-4 font-bold text-brand-dark bg-brand-gold rounded-xl hover:bg-yellow-500 transition-colors shadow-lg">
                Register Now
              </Link>
              <Link to="/lakshya/login" className="px-8 py-4 font-bold text-white bg-transparent border-2 border-white rounded-xl hover:bg-white/10 transition-colors shadow-lg">
                Login
              </Link>
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-brand-dark mb-4">About Lakshya</h2>
              <div className="w-24 h-1 bg-brand-blue mx-auto rounded-full mb-8" />
              <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                Lakshya is our flagship engineering program tailored for aspirants aiming to conquer JEE Main, JEE Advanced, and state-level engineering entrance exams. We provide a rigorous, meticulously planned academic ecosystem.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: 'IIT-Focused Coaching', icon: <Target className="text-brand-blue w-8 h-8" /> },
                { title: 'Expert Faculty', icon: <Users className="text-brand-gold w-8 h-8" /> },
                { title: 'Daily Practice Tests', icon: <PenTool className="text-brand-blue w-8 h-8" /> },
                { title: 'Mock Examinations', icon: <Award className="text-brand-gold w-8 h-8" /> },
                { title: 'Doubt Clarification', icon: <CheckCircle className="text-brand-blue w-8 h-8" /> },
                { title: 'Career Guidance', icon: <BookOpen className="text-brand-gold w-8 h-8" /> }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center p-6 bg-brand-light rounded-xl border border-gray-100 shadow-sm">
                  <div className="mr-4 bg-white p-3 rounded-lg shadow-sm">{item.icon}</div>
                  <span className="font-bold text-gray-800 text-lg">{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Exams Covered Section */}
        <section className="py-20 bg-brand-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-brand-dark mb-12">Exams Covered</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {['JEE Main', 'JEE Advanced', 'AP EAMCET', 'TS EAMCET'].map((exam, idx) => (
                <div key={idx} className="bg-white p-8 rounded-2xl shadow-md text-center border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
                  <h3 className="text-2xl font-extrabold text-brand-blue">{exam}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Course Details & Features */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold text-brand-dark mb-8">Course Details</h2>
              <div className="bg-brand-dark text-white p-8 rounded-2xl mb-8">
                <h4 className="text-brand-gold font-bold uppercase tracking-widest text-sm mb-2">Stream</h4>
                <p className="text-3xl font-bold mb-6">MPC (Maths, Physics, Chemistry) Only</p>
                
                <h4 className="text-brand-gold font-bold uppercase tracking-widest text-sm mb-2">Core Subjects</h4>
                <ul className="space-y-3">
                  {['Mathematics (Algebra, Calculus, Trigonometry)', 'Physics (Mechanics, Electrodynamics)', 'Chemistry (Physical, Organic, Inorganic)'].map((sub, i) => (
                    <li key={i} className="flex items-center text-lg">
                      <CheckCircle className="w-5 h-5 text-brand-gold mr-3" /> {sub}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-brand-dark mb-8">Key Features</h2>
              <div className="space-y-6">
                {[
                  'Daily Assignments to reinforce concepts.',
                  'Weekly Mock Tests simulating actual exam environment.',
                  'Detailed Rank Analysis after every examination.',
                  'Comprehensive Performance Tracking accessible to parents.',
                  'Exclusive Study Materials crafted by IITians.',
                  'Access to recorded Video Lectures for revision.'
                ].map((feature, i) => (
                  <div key={i} className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-brand-blue flex-shrink-0 mt-1" />
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

export default LakshyaPage;



