import React from 'react';
import { 
  LayoutDashboard, 
  Globe, 
  Zap, 
  BarChart3, 
  BookOpen, 
  ChevronLeft,
  ChevronRight,
  Activity
} from 'lucide-react';
import { useTestingStore } from '@/stores/testingStore';
import { cn } from '@/utils/helpers';

const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'System overview and status'
  },
  {
    id: 'api-testing',
    label: 'API Testing',
    icon: Globe,
    description: 'REST API endpoint testing'
  },
  {
    id: 'websocket-testing',
    label: 'WebSocket Testing',
    icon: Zap,
    description: 'Real-time connection testing'
  },
  {
    id: 'performance',
    label: 'Performance',
    icon: BarChart3,
    description: 'Metrics and monitoring'
  },
  {
    id: 'documentation',
    label: 'Documentation',
    icon: BookOpen,
    description: 'APIX testing guidelines'
  }
];

const Sidebar: React.FC = () => {
  const { activeTab, sidebarCollapsed, setActiveTab, setSidebarCollapsed, isBackendOnline } = useTestingStore();

  return (
    <div className={cn(
      "fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-50",
      sidebarCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!sidebarCollapsed && (
          <div className="flex items-center space-x-2">
            <Activity className="w-8 h-8 text-primary-600" />
            <div>
              <h1 className="text-lg font-bold text-gray-900">APIX Testing</h1>
              <p className="text-xs text-gray-500">Professional Testing UI</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Status Indicator */}
      <div className="p-4 border-b border-gray-200">
        <div className={cn(
          "flex items-center space-x-2",
          sidebarCollapsed && "justify-center"
        )}>
          <div className={cn(
            "w-2 h-2 rounded-full",
            isBackendOnline ? "bg-success-500" : "bg-error-500"
          )} />
          {!sidebarCollapsed && (
            <span className={cn(
              "text-sm font-medium",
              isBackendOnline ? "text-success-700" : "text-error-700"
            )}>
              {isBackendOnline ? "Backend Online" : "Backend Offline"}
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200",
                    isActive 
                      ? "bg-primary-50 text-primary-700 border border-primary-200" 
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                    sidebarCollapsed && "justify-center px-2"
                  )}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon className={cn(
                    "w-5 h-5 flex-shrink-0",
                    isActive ? "text-primary-600" : "text-gray-500"
                  )} />
                  {!sidebarCollapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{item.label}</div>
                      <div className="text-xs text-gray-500 truncate">
                        {item.description}
                      </div>
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {!sidebarCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            <div>APIX Real-Time Backend</div>
            <div>Testing Platform v1.0.0</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
