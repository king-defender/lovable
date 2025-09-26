import React, { useState } from 'react';

const EditorPage = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      // TODO: Integrate with AI API
      setTimeout(() => {
        setGeneratedCode(`// Generated from: "${prompt}"
import React from 'react';

const GeneratedComponent = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Generated Component</h2>
      <p className="text-gray-600">
        This component was generated from your description:
        "${prompt}"
      </p>
    </div>
  );
};

export default GeneratedComponent;`);
        setIsGenerating(false);
      }, 2000);
    } catch (error) {
      console.error('Generation failed:', error);
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">AI Editor</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Prompt Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Describe Your Component</h2>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the component you want to create. For example: 'Create a contact form with name, email, and message fields with validation'"
              className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="mt-4 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isGenerating ? 'Generating...' : 'Generate Component'}
            </button>
          </div>

          {/* Visual Preview */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Live Preview</h2>
            <div className="visual-editor rounded-lg p-4 min-h-[200px] flex items-center justify-center">
              {generatedCode ? (
                <div className="w-full">
                  {/* Preview would render the actual component here */}
                  <div className="p-6 bg-white rounded-lg shadow-lg border">
                    <h2 className="text-2xl font-bold mb-4">Generated Component</h2>
                    <p className="text-gray-600">
                      This component was generated from your description: "{prompt}"
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Component preview will appear here</p>
              )}
            </div>
          </div>

          {/* Code Output */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Generated Code</h2>
            <div className="code-preview rounded-lg p-4 min-h-[300px] overflow-auto">
              {generatedCode ? (
                <pre className="text-sm">
                  <code>{generatedCode}</code>
                </pre>
              ) : (
                <p className="text-gray-400">Generated code will appear here...</p>
              )}
            </div>
            {generatedCode && (
              <div className="mt-4 flex gap-2">
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
                  Copy Code
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  Save Component
                </button>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200">
                  Deploy
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;