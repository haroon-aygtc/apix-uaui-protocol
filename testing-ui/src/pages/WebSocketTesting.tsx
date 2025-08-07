import React from 'react';
import { Zap, Play, Square } from 'lucide-react';

const WebSocketTesting: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">WebSocket Testing</h1>
          <p className="text-gray-600 mt-1">
            Real-time WebSocket connection testing and event monitoring
          </p>
        </div>
        <div className="flex space-x-2">
          <button className="btn-success flex items-center space-x-2">
            <Play className="w-4 h-4" />
            <span>Connect</span>
          </button>
          <button className="btn-error flex items-center space-x-2">
            <Square className="w-4 h-4" />
            <span>Disconnect</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connection Settings */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>Connection Settings</span>
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">WebSocket URL</label>
              <input 
                type="text" 
                className="w-full input-field"
                defaultValue="ws://localhost:3001/ws"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Authentication Token</label>
              <input 
                type="text" 
                className="w-full input-field"
                placeholder="Enter JWT token"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Client Type</label>
              <select className="w-full input-field">
                <option>WEB_APP</option>
                <option>MOBILE_APP</option>
                <option>SDK_WIDGET</option>
                <option>API_CLIENT</option>
              </select>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Connection Status</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-error-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Disconnected</span>
            </div>
            <div className="text-sm text-gray-500">
              <div>Connection ID: N/A</div>
              <div>Session ID: N/A</div>
              <div>Connected At: N/A</div>
              <div>Last Heartbeat: N/A</div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Console */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Message Console</h3>
        <div className="bg-gray-900 text-gray-100 rounded-lg p-4 h-64 overflow-auto font-mono text-sm">
          <div className="text-gray-500">WebSocket console - messages will appear here</div>
        </div>
        
        <div className="mt-4 flex space-x-2">
          <input 
            type="text" 
            className="flex-1 input-field"
            placeholder="Enter message to send"
          />
          <button className="btn-primary">Send</button>
        </div>
      </div>
    </div>
  );
};

export default WebSocketTesting;
