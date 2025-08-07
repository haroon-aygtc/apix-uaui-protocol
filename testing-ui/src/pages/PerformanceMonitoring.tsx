import React from 'react';
import { BarChart3, TrendingUp, Clock, Cpu } from 'lucide-react';

const PerformanceMonitoring: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Performance Monitoring</h1>
        <p className="text-gray-600 mt-1">
          Real-time performance metrics, analytics, and system monitoring
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Response Time</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">45ms</p>
              <p className="text-xs text-success-600 mt-1">↓ 12% from last hour</p>
            </div>
            <div className="p-3 rounded-lg bg-primary-500">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Throughput</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">1.2k/s</p>
              <p className="text-xs text-success-600 mt-1">↑ 8% from last hour</p>
            </div>
            <div className="p-3 rounded-lg bg-success-500">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Error Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">0.1%</p>
              <p className="text-xs text-success-600 mt-1">↓ 0.05% from last hour</p>
            </div>
            <div className="p-3 rounded-lg bg-warning-500">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">CPU Usage</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">23%</p>
              <p className="text-xs text-gray-500 mt-1">Normal range</p>
            </div>
            <div className="p-3 rounded-lg bg-gray-500">
              <Cpu className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Time Trend</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Chart will be rendered here</p>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Memory Usage</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Chart will be rendered here</p>
          </div>
        </div>
      </div>

      {/* Active Connections */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Connections</h3>
        <div className="text-center py-12 text-gray-500">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>No active connections to monitor</p>
          <p className="text-sm mt-1">Connect to WebSocket to see real-time data</p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitoring;
