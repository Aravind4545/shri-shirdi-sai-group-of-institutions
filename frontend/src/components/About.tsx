
import { motion } from 'framer-motion';
import { GraduationCap, Users, BookOpen, Target } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: <Users className="w-6 h-6 text-brand-gold" />,
      title: 'Experienced Faculty',
      description: 'Learn from highly qualified educators with decades of experience.'
    },
    {
      icon: <Target className="w-6 h-6 text-brand-blue" />,
      title: 'Competitive Exam Coaching',
      description: 'Specialized training for JEE, NEET, and Civil Services.'
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-brand-gold" />,
      title: 'Academic Excellence',
      description: 'Consistently producing top rankers across various competitive exams.'
    },
    {
      icon: <BookOpen className="w-6 h-6 text-brand-blue" />,
      title: 'Career Guidance',
      description: 'Comprehensive mentorship to help shape your future path.'
    }
  ];

  return (
    <section id="about" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-brand-dark mb-4"
          >
            About Sri Shirdi Sai Institutions
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-24 h-1 bg-brand-gold mx-auto rounded-full mb-8"
          />
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-600 max-w-3xl mx-auto"
          >
            At Sri Shirdi Sai Institutions, we believe in nurturing potential and shaping destinies. 
            With a strong commitment to holistic education, we provide an ecosystem where students 
            thrive academically and personally, preparing them to be the leaders of tomorrow.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index }}
              className="p-6 bg-brand-light rounded-2xl hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
