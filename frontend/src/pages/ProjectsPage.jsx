import React from 'react';
import { Link } from 'react-router-dom';

const ProjectsPage = () => {
  // Mock project data
  const projects = [
    {
      id: 1,
      name: 'E-commerce Dashboard',
      description: 'Admin dashboard for managing products and orders',
      lastModified: '2 hours ago',
      status: 'active',
    },
    {
      id: 2,
      name: 'Task Management App',
      description: 'Collaborative task tracking application',
      lastModified: '1 day ago',
      status: 'deployed',
    },
    {
      id: 3,
      name: 'Portfolio Website',
      description: 'Personal portfolio with blog functionality',
      lastModified: '3 days ago',
      status: 'draft',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'deployed':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Projects</h1>
          <Link
            to="/editor"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200"
          >
            New Project
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📱</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Projects Yet</h2>
            <p className="text-gray-600 mb-8">
              Start building your first web application with Lovable's AI-powered editor.
            </p>
            <Link
              to="/editor"
              className="bg-purple-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition-colors duration-200"
            >
              Create Your First Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{project.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <p className="text-sm text-gray-500 mb-6">Last modified: {project.lastModified}</p>
                
                <div className="flex gap-2">
                  <Link
                    to={`/editor?project=${project.id}`}
                    className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg text-center font-medium hover:bg-purple-700 transition-colors duration-200"
                  >
                    Edit
                  </Link>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    Preview
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    ⋯
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">3</div>
            <div className="text-gray-600">Total Projects</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">12</div>
            <div className="text-gray-600">Components Generated</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">1</div>
            <div className="text-gray-600">Apps Deployed</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">24h</div>
            <div className="text-gray-600">Time Saved</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;