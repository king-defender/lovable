import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Build Web Apps with 
            <span className="block mt-2">Natural Language</span>
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Describe your app idea in plain English and watch as Lovable's AI 
            generates beautiful, functional React components instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/editor"
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-purple-50 transition-colors duration-200"
            >
              Start Building
            </Link>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-purple-600 transition-colors duration-200">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
            Why Choose Lovable?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card bg-white p-8 rounded-lg shadow-lg">
              <div className="text-purple-600 text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-4">AI-Powered Generation</h3>
              <p className="text-gray-600">
                Transform natural language descriptions into production-ready React components 
                with our advanced AI engine.
              </p>
            </div>
            <div className="feature-card bg-white p-8 rounded-lg shadow-lg">
              <div className="text-purple-600 text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-4">Visual Editor</h3>
              <p className="text-gray-600">
                Fine-tune your generated components with our intuitive drag-and-drop 
                visual editor for pixel-perfect results.
              </p>
            </div>
            <div className="feature-card bg-white p-8 rounded-lg shadow-lg">
              <div className="text-purple-600 text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-4">One-Click Deploy</h3>
              <p className="text-gray-600">
                Deploy your web applications instantly to production with our 
                integrated hosting and CDN infrastructure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Ready to Build Your Dream App?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of developers who are already building with Lovable
          </p>
          <Link 
            to="/editor"
            className="bg-purple-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition-colors duration-200"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;