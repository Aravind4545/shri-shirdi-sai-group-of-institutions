
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, Activity, Landmark } from 'lucide-react';

const Programs = () => {
  const programs = [
    {
      id: 'iit',
      title: 'IIT',
      target: 'IIT & Engineering Aspirants',
      description: 'Specialized coaching for JEE Main, JEE Advanced, AP EAMCET, and TS EAMCET.',
      path: '/iit',
      icon: <Calculator className="w-8 h-8 text-white" />,
      color: 'from-blue-500 to-brand-blue'
    },
    {
      id: 'neet',
      title: 'NEET',
      target: 'Medical Aspirants',
      description: 'Focused coaching for NEET and Medical Entrance Examinations.',
      path: '/neet',
      icon: <Activity className="w-8 h-8 text-white" />,
      color: 'from-emerald-400 to-emerald-600'
    },
    {
      id: 'upsc',
      title: 'UPSC',
      target: 'Civil Services Aspirants',
      description: 'Foundation programs for future Civil Servants and Government Officers.',
      path: '/upsc',
      icon: <Landmark className="w-8 h-8 text-white" />,
      color: 'from-brand-gold to-yellow-600'
    }
  ];

  return (
    <section id="programs" className="py-24 bg-brand-light relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-brand-dark mb-4"
          >
            Our Premium Programs
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-24 h-1 bg-brand-blue mx-auto rounded-full mb-8"
          />
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Choose the right path for your career. Our specialized programs are designed to provide focused, high-quality education to help you achieve your goals.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden border border-gray-100 flex flex-col h-full"
            >
              <div className={`p-8 bg-gradient-to-br ${program.color} relative overflow-hidden`}>
                <div className="absolute -right-4 -top-4 opacity-20">
                  {program.icon}
                </div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 border border-white/30">
                    {program.icon}
                  </div>
                  <h3 className="text-3xl font-extrabold text-white mb-2">{program.title}</h3>
                  <p className="text-white/90 font-medium">{program.target}</p>
                </div>
              </div>
              
              <div className="p-8 flex-grow flex flex-col justify-between">
                <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                  {program.description}
                </p>
                <Link
                  to={program.path}
                  className="group inline-flex items-center justify-center w-full px-6 py-3 font-semibold text-brand-dark bg-gray-50 border border-gray-200 rounded-xl hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-all duration-300"
                >
                  Explore {program.title}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Programs;
