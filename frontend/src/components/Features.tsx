
import { motion } from 'framer-motion';
import { CheckCircle, Trophy, Building2, Phone, Mail, MapPin } from 'lucide-react';

const Features = () => {
  return (
    <>
      {/* Why Choose Us & Facilities */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Why Choose Us */}
            <div>
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-bold text-brand-dark mb-8 flex items-center"
              >
                <CheckCircle className="w-8 h-8 text-brand-gold mr-3" />
                Why Choose Us
              </motion.h2>
              <div className="space-y-6">
                {[
                  'Proven track record of top ranks in JEE and NEET.',
                  'Personalized mentoring and doubt-clearing sessions.',
                  'State-of-the-art digital classrooms and laboratories.',
                  'Comprehensive study material designed by experts.',
                  'Regular mock tests and performance analysis.'
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start"
                  >
                    <CheckCircle className="w-6 h-6 text-brand-blue flex-shrink-0 mt-1" />
                    <p className="ml-4 text-gray-700 text-lg">{item}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Success Stories */}
            <div>
              <motion.h2 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-bold text-brand-dark mb-8 flex items-center"
              >
                <Trophy className="w-8 h-8 text-brand-gold mr-3" />
                Success Stories
              </motion.h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { rank: 'AIR 15', exam: 'JEE Advanced', year: '2025' },
                  { rank: 'AIR 42', exam: 'NEET UG', year: '2025' },
                  { rank: 'State 1st', exam: 'AP EAMCET', year: '2024' },
                  { rank: 'AIR 112', exam: 'UPSC CSE', year: '2024' }
                ].map((story, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-brand-light p-6 rounded-2xl border border-gray-100 text-center"
                  >
                    <div className="text-3xl font-extrabold text-brand-blue mb-1">{story.rank}</div>
                    <div className="font-semibold text-gray-800">{story.exam}</div>
                    <div className="text-gray-500 text-sm">{story.year}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities & Contact */}
      <section className="py-24 bg-brand-dark text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Facilities */}
            <div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-bold mb-8 flex items-center"
              >
                <Building2 className="w-8 h-8 text-brand-gold mr-3" />
                Campus Facilities
              </motion.h2>
              <div className="grid grid-cols-2 gap-4">
                {['Modern Library', 'Digital Classrooms', 'Advanced Hostels', 'Sports Complex', 'Cafeteria', 'Transport'].map((facility, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/5"
                  >
                    <span className="font-medium">{facility}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-bold mb-8"
              >
                Contact Information
              </motion.h2>
              <div className="space-y-6 bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-brand-gold mr-4 flex-shrink-0" />
                  <p className="text-gray-300">123 Education Boulevard, Knowledge City,<br/>Andhra Pradesh, 520001, India</p>
                </div>
                <div className="flex items-center">
                  <Phone className="w-6 h-6 text-brand-gold mr-4 flex-shrink-0" />
                  <p className="text-gray-300">+91 98765 43210</p>
                </div>
                <div className="flex items-center">
                  <Mail className="w-6 h-6 text-brand-gold mr-4 flex-shrink-0" />
                  <p className="text-gray-300">admissions@srisasi.edu</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default Features;
