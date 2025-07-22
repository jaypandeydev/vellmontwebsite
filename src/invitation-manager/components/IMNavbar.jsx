import React from 'react';
import { Link } from 'react-router-dom';
import { Home, PlusCircle, Settings } from 'lucide-react';

const IMNavbar = () => {
  return (
    <nav className="bg-pastel-pink shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/invitation-manager" className="text-2xl font-bold text-pastel-purple-dark">
          Invitation Manager
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/invitation-manager" className="text-pastel-purple-dark hover:text-pastel-green transition-colors flex items-center">
            <Home className="w-5 h-5 mr-1" /> Home
          </Link>
          <Link to="/invitation-manager/add" className="text-pastel-purple-dark hover:text-pastel-green transition-colors flex items-center">
            <PlusCircle className="w-5 h-5 mr-1" /> Add New
          </Link>
          <Link to="/" className="text-sm text-gray-600 hover:text-pastel-green transition-colors">
            Back to Vellmont
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default IMNavbar;