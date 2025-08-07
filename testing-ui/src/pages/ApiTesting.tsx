import React from 'react';
import { Code, Play, Plus } from 'lucide-react';

const ApiTesting: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">API Testing</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive REST API endpoint testing and validation
          </p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>New Test Case</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Builder */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Code className="w-5 h-5" />
            <span>Request Builder</span>
          </h3>
          
          <div className="space-y-4">
            <div className="flex space-x-2">
              <select className="px-3 py-2 border border-gray-300 rounded-md">
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
              </select>
              <input 
                type="text" 
                placeholder="Enter API endpoint URL"
                className="flex-1 input-field"
                defaultValue="http://localhost:3000/api/v1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Headers</label>
              <textarea 
                className="w-full h-24 input-field font-mono text-sm"
                placeholder='{"Content-Type": "application/json"}'
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Request Body</label>
              <textarea 
                className="w-full h-32 input-field font-mono text-sm"
                placeholder="Enter request body (JSON)"
              />
            </div>
            
            <button className="btn-primary w-full flex items-center justify-center space-x-2">
              <Play className="w-4 h-4" />
              <span>Send Request</span>
            </button>
          </div>
        </div>

        {/* Response Viewer */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Response</h3>
          <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-auto">
            <p className="text-gray-500 text-center mt-20">
              Send a request to see the response here
            </p>
          </div>
        </div>
      </div>

      {/* Test Cases */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Cases</h3>
        <div className="text-center py-12 text-gray-500">
          <Code className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>No test cases created yet</p>
          <p className="text-sm mt-1">Create your first test case to get started</p>
        </div>
      </div>
    </div>
  );
};

export default ApiTesting;
