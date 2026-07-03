import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'IIT', path: '/iit' },
    { name: 'NEET', path: '/neet' },
    { name: 'UPSC', path: '/upsc' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className={`h-8 w-8 ${scrolled ? 'text-brand-blue' : 'text-brand-blue'}`} />
            <span className={`font-bold text-xl tracking-tight ${scrolled ? 'text-brand-dark' : 'text-brand-dark'}`}>
              Academic Companion
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-700 hover:text-brand-blue font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link to="/login">
              <button className="bg-brand-gold text-white px-6 py-2 rounded-full font-semibold hover:bg-yellow-600 transition-colors shadow-md">
                Login
              </button>
            </Link>
          </div>

          {/* Mobile Nav Toggle */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-brand-dark">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-gray-200 mt-3"
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4">
                <Link to="/login" className="block w-full">
                  <button className="w-full bg-brand-blue text-white px-4 py-2 rounded-md font-medium hover:bg-blue-800 transition-colors">
                    Login / Register
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
