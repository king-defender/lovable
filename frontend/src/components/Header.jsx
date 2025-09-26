import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header text-white shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            Lovable
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link 
              to="/" 
              className="hover:text-purple-200 transition-colors duration-200"
            >
              Home
            </Link>
            <Link 
              to="/editor" 
              className="hover:text-purple-200 transition-colors duration-200"
            >
              Editor
            </Link>
            <Link 
              to="/projects" 
              className="hover:text-purple-200 transition-colors duration-200"
            >
              Projects
            </Link>
          </nav>
          <div className="flex space-x-4">
            <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors duration-200">
              Sign In
            </button>
            <button className="bg-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-600 transition-colors duration-200">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;