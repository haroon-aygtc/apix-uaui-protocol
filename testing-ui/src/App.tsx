import { useEffect } from 'react';
import { useTestingStore } from '@/stores/testingStore';
import { healthCheck, getStatus } from '@/utils/api';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Dashboard from '@/pages/Dashboard';
import ApiTesting from '@/pages/ApiTesting';
import WebSocketTesting from '@/pages/WebSocketTesting';
import PerformanceMonitoring from '@/pages/PerformanceMonitoring';
import Documentation from '@/pages/Documentation';

function App() {
  const { 
    activeTab, 
    sidebarCollapsed, 
    setBackendStatus, 
    setBackendOnline,
    addPerformanceMetric 
  } = useTestingStore();

  // Check backend status on mount and periodically
  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const [, status] = await Promise.all([
          healthCheck(),
          getStatus()
        ]);
        
        setBackendStatus(status);
        setBackendOnline(true);
        
        // Add performance metric
        addPerformanceMetric({
          timestamp: new Date().toISOString(),
          responseTime: 0, // Will be calculated in actual implementation
          throughput: 0,
          errorRate: 0,
          activeConnections: 0,
          memoryUsage: status.memory.heapUsed,
          cpuUsage: 0,
        });
      } catch (error) {
        console.error('Backend health check failed:', error);
        setBackendOnline(false);
      }
    };

    // Initial check
    checkBackendStatus();

    // Check every 30 seconds
    const interval = setInterval(checkBackendStatus, 30000);

    return () => clearInterval(interval);
  }, [setBackendStatus, setBackendOnline, addPerformanceMetric]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'api-testing':
        return <ApiTesting />;
      case 'websocket-testing':
        return <WebSocketTesting />;
      case 'performance':
        return <PerformanceMonitoring />;
      case 'documentation':
        return <Documentation />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <Header />
        <main className="flex-1 overflow-auto p-6">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
}

export default App;
