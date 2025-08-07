import React from 'react';
import {
  Activity,
  Server,
  Zap,
  Database,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { useTestingStore } from '@/stores/testingStore';
import { formatBytes, formatDuration, cn } from '@/utils/helpers';

const Dashboard: React.FC = () => {
  const { 
    backendStatus, 
    isBackendOnline, 
    testResults, 
    wsConnected,

    activeConnections 
  } = useTestingStore();

  const recentTests = testResults.slice(0, 5);
  const passedTests = testResults.filter(r => r.status === 'passed').length;
  const failedTests = testResults.filter(r => r.status === 'failed').length;
  const totalTests = testResults.length;

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    description?: string;
    trend?: string;
  }> = ({ title, value, icon: Icon, color, description, trend }) => (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <TrendingUp className="w-4 h-4 text-success-600 mr-1" />
          <span className="text-sm text-success-600">{trend}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Real-time monitoring and overview of APIX Backend system
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={cn(
            "px-3 py-1 rounded-full text-sm font-medium",
            isBackendOnline 
              ? "bg-success-100 text-success-800" 
              : "bg-error-100 text-error-800"
          )}>
            {isBackendOnline ? "System Online" : "System Offline"}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Backend Status"
          value={isBackendOnline ? "Online" : "Offline"}
          icon={Server}
          color={isBackendOnline ? "bg-success-500" : "bg-error-500"}
          description={backendStatus ? `Uptime: ${Math.floor(backendStatus.uptime / 60)}m` : undefined}
        />
        
        <StatCard
          title="WebSocket"
          value={wsConnected ? "Connected" : "Disconnected"}
          icon={Zap}
          color={wsConnected ? "bg-primary-500" : "bg-gray-500"}
          description={`${activeConnections.length} active connections`}
        />
        
        <StatCard
          title="Test Results"
          value={`${passedTests}/${totalTests}`}
          icon={CheckCircle}
          color="bg-success-500"
          description={`${failedTests} failed tests`}
        />
        
        <StatCard
          title="Memory Usage"
          value={backendStatus ? formatBytes(backendStatus.memory.heapUsed) : "N/A"}
          icon={Database}
          color="bg-warning-500"
          description={backendStatus ? `of ${formatBytes(backendStatus.memory.heapTotal)}` : undefined}
        />
      </div>

      {/* System Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Backend Components Status */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            System Components
          </h3>
          {backendStatus ? (
            <div className="space-y-3">
              {Object.entries(backendStatus.components).map(([component, status]) => (
                <div key={component} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      status === 'operational' ? "bg-success-500" : "bg-error-500"
                    )} />
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {component.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full font-medium",
                    status === 'operational' 
                      ? "bg-success-100 text-success-800"
                      : "bg-error-100 text-error-800"
                  )}>
                    {status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Server className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Backend status unavailable</p>
            </div>
          )}
        </div>

        {/* Recent Test Results */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Test Results
          </h3>
          {recentTests.length > 0 ? (
            <div className="space-y-3">
              {recentTests.map((test) => (
                <div key={test.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {test.status === 'passed' ? (
                      <CheckCircle className="w-4 h-4 text-success-600" />
                    ) : test.status === 'failed' ? (
                      <XCircle className="w-4 h-4 text-error-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-warning-600" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Test Case #{test.testCaseId.slice(-6)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {test.duration ? formatDuration(test.duration) : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full font-medium",
                    test.status === 'passed' 
                      ? "bg-success-100 text-success-800"
                      : test.status === 'failed'
                      ? "bg-error-100 text-error-800"
                      : "bg-warning-100 text-warning-800"
                  )}>
                    {test.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No test results yet</p>
              <p className="text-xs mt-1">Run some tests to see results here</p>
            </div>
          )}
        </div>
      </div>

      {/* System Information */}
      {backendStatus && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            System Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">Service Details</h4>
              <div className="space-y-1 text-sm">
                <div>Service: {backendStatus.service}</div>
                <div>Version: {backendStatus.version}</div>
                <div>Environment: {backendStatus.environment}</div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">Memory Usage</h4>
              <div className="space-y-1 text-sm">
                <div>RSS: {formatBytes(backendStatus.memory.rss)}</div>
                <div>Heap Used: {formatBytes(backendStatus.memory.heapUsed)}</div>
                <div>Heap Total: {formatBytes(backendStatus.memory.heapTotal)}</div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">Runtime</h4>
              <div className="space-y-1 text-sm">
                <div>Uptime: {formatDuration(backendStatus.uptime * 1000)}</div>
                <div>External: {formatBytes(backendStatus.memory.external)}</div>
                <div>Array Buffers: {formatBytes(backendStatus.memory.arrayBuffers)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
