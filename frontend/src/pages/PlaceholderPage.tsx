
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

import { ArrowLeft } from 'lucide-react';

const PlaceholderPage = ({ title }: { title?: string }) => {
  const { id } = useParams<{ id: string }>();
  const pageTitle = title || (id ? id.charAt(0).toUpperCase() + id.slice(1) : 'Program');

  return (
    <div className="min-h-screen flex flex-col bg-brand-light">
      <Navbar />
      <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-12 rounded-3xl shadow-xl max-w-2xl w-full text-center border border-gray-100">
          <h1 className="text-4xl font-extrabold text-brand-dark mb-6">{pageTitle} Program</h1>
          <p className="text-lg text-gray-600 mb-8">
            This page is currently under development. The detailed curriculum, faculty information, and admission details for the {pageTitle} program will be available soon.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-brand-blue hover:bg-blue-800 transition-colors"
          >
            <ArrowLeft className="mr-2 -ml-1 h-5 w-5" aria-hidden="true" />
            Back to Home
          </Link>
        </div>
      </main>
    </div>
);
};

export default PlaceholderPage;


