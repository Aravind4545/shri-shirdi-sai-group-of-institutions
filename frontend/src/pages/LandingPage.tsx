import GlobalFooter from '../components/GlobalFooter';

import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Programs from '../components/Programs';
import Features from '../components/Features';


const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <About />
        <Programs />
        <Features />
      </main>
      <GlobalFooter />
    </div>
);
};

export default LandingPage;



