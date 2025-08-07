import React from 'react';
import { 
  RefreshCw, 
  Settings, 
  Download, 
  Upload,
  Clock,
  Server,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useTestingStore } from '@/stores/testingStore';
import { formatRelativeTime, formatBytes } from '@/utils/helpers';
import { cn } from '@/utils/helpers';

const Header: React.FC = () => {
  const { 
    backendStatus, 
    isBackendOnline, 
    testResults, 
    wsConnected,
    activeTab 
  } = useTestingStore();

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'api-testing': return 'API Testing';
      case 'websocket-testing': return 'WebSocket Testing';
      case 'performance': return 'Performance Monitoring';
      case 'documentation': return 'Documentation';
      default: return 'APIX Testing';
    }
  };

  const getTabDescription = () => {
    switch (activeTab) {
      case 'dashboard': return 'System overview and real-time status monitoring';
      case 'api-testing': return 'Comprehensive REST API endpoint testing and validation';
      case 'websocket-testing': return 'Real-time WebSocket connection testing and event monitoring';
      case 'performance': return 'Performance metrics, analytics, and system monitoring';
      case 'documentation': return 'APIX protocol documentation and testing guidelines';
      default: return 'Professional testing interface for APIX Real-Time Backend';
    }
  };

  const passedTests = testResults.filter(r => r.status === 'passed').length;
  const failedTests = testResults.filter(r => r.status === 'failed').length;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section - Page Info */}
        <div className="flex-1">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{getTabTitle()}</h1>
              <p className="text-sm text-gray-600 mt-1">{getTabDescription()}</p>
            </div>
          </div>
        </div>

        {/* Center Section - Quick Stats */}
        <div className="flex items-center space-x-6">
          {/* Backend Status */}
          <div className="flex items-center space-x-2">
            <Server className={cn(
              "w-4 h-4",
              isBackendOnline ? "text-success-600" : "text-error-600"
            )} />
            <span className={cn(
              "text-sm font-medium",
              isBackendOnline ? "text-success-700" : "text-error-700"
            )}>
              {isBackendOnline ? "Online" : "Offline"}
            </span>
          </div>

          {/* WebSocket Status */}
          <div className="flex items-center space-x-2">
            {wsConnected ? (
              <Wifi className="w-4 h-4 text-success-600" />
            ) : (
              <WifiOff className="w-4 h-4 text-error-600" />
            )}
            <span className={cn(
              "text-sm font-medium",
              wsConnected ? "text-success-700" : "text-error-700"
            )}>
              WebSocket
            </span>
          </div>

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                <span className="text-sm text-gray-600">{passedTests} passed</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-error-500 rounded-full"></div>
                <span className="text-sm text-gray-600">{failedTests} failed</span>
              </div>
            </div>
          )}

          {/* Uptime */}
          {backendStatus && (
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Uptime: {Math.floor(backendStatus.uptime / 60)}m
              </span>
            </div>
          )}
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-3">
          {/* Memory Usage */}
          {backendStatus && (
            <div className="text-xs text-gray-500">
              Memory: {formatBytes(backendStatus.memory.heapUsed)}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              title="Import Test Cases"
            >
              <Upload className="w-4 h-4" />
            </button>
            
            <button
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              title="Export Results"
            >
              <Download className="w-4 h-4" />
            </button>
            
            <button
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            
            <button
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      {backendStatus && (
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-6">
            <span>Environment: {backendStatus.environment}</span>
            <span>Version: {backendStatus.version}</span>
            <span>Last Updated: {formatRelativeTime(backendStatus.timestamp)}</span>
          </div>
          <div className="flex items-center space-x-4">
            {Object.entries(backendStatus.components).map(([key, status]) => (
              <div key={key} className="flex items-center space-x-1">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  status === 'operational' ? "bg-success-500" : "bg-error-500"
                )} />
                <span className="capitalize">{key}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
