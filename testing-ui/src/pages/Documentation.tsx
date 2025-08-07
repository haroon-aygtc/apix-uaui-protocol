import React, { useState } from 'react';
import { 
  BookOpen, 
  Code, 
  Zap, 
  Shield, 
  BarChart3, 
  CheckCircle,
  AlertTriangle,
  Info,

  Copy
} from 'lucide-react';
import { copyToClipboard, cn } from '@/utils/helpers';

const Documentation: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = async (code: string, id: string) => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const sections = [
    { id: 'overview', title: 'Overview', icon: BookOpen },
    { id: 'api-testing', title: 'API Testing', icon: Code },
    { id: 'websocket-testing', title: 'WebSocket Testing', icon: Zap },
    { id: 'security', title: 'Security Testing', icon: Shield },
    { id: 'performance', title: 'Performance Testing', icon: BarChart3 },
    { id: 'best-practices', title: 'Best Practices', icon: CheckCircle },
  ];

  const CodeBlock: React.FC<{ code: string; language: string; id: string }> = ({ code, language, id }) => (
    <div className="relative">
      <div className="flex items-center justify-between bg-gray-800 text-gray-200 px-4 py-2 rounded-t-lg">
        <span className="text-sm font-medium">{language}</span>
        <button
          onClick={() => handleCopyCode(code, id)}
          className="flex items-center space-x-1 text-xs hover:text-white transition-colors"
        >
          <Copy className="w-3 h-3" />
          <span>{copiedCode === id ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-b-lg overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );

  const InfoBox: React.FC<{ type: 'info' | 'warning' | 'success'; children: React.ReactNode }> = ({ type, children }) => {
    const styles = {
      info: 'bg-blue-50 border-blue-200 text-blue-800',
      warning: 'bg-warning-50 border-warning-200 text-warning-800',
      success: 'bg-success-50 border-success-200 text-success-800',
    };

    const icons = {
      info: Info,
      warning: AlertTriangle,
      success: CheckCircle,
    };

    const Icon = icons[type];

    return (
      <div className={cn('border rounded-lg p-4 flex items-start space-x-3', styles[type])}>
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="text-sm">{children}</div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">APIX Testing Platform Overview</h2>
              <p className="text-gray-600 mb-6">
                The APIX Testing Platform is a comprehensive, professional-grade testing interface designed for 
                the APIX Real-Time Backend system. It provides extensive testing capabilities for REST APIs, 
                WebSocket connections, performance monitoring, and security validation.
              </p>
            </div>

            <InfoBox type="info">
              <div>
                <strong>Purpose:</strong> This platform enables developers and QA teams to thoroughly test 
                the APIX Real-Time Backend's functionality, performance, and reliability in a structured, 
                professional environment.
              </div>
            </InfoBox>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card p-4">
                  <Code className="w-6 h-6 text-primary-600 mb-2" />
                  <h4 className="font-medium text-gray-900 mb-1">API Testing</h4>
                  <p className="text-sm text-gray-600">
                    Comprehensive REST API endpoint testing with request/response validation
                  </p>
                </div>
                <div className="card p-4">
                  <Zap className="w-6 h-6 text-primary-600 mb-2" />
                  <h4 className="font-medium text-gray-900 mb-1">WebSocket Testing</h4>
                  <p className="text-sm text-gray-600">
                    Real-time connection testing and event monitoring
                  </p>
                </div>
                <div className="card p-4">
                  <BarChart3 className="w-6 h-6 text-primary-600 mb-2" />
                  <h4 className="font-medium text-gray-900 mb-1">Performance Monitoring</h4>
                  <p className="text-sm text-gray-600">
                    Real-time metrics, analytics, and performance tracking
                  </p>
                </div>
                <div className="card p-4">
                  <Shield className="w-6 h-6 text-primary-600 mb-2" />
                  <h4 className="font-medium text-gray-900 mb-1">Security Testing</h4>
                  <p className="text-sm text-gray-600">
                    Authentication, authorization, and security validation
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">System Architecture</h3>
              <p className="text-gray-600 mb-4">
                The APIX Real-Time Backend follows a modular architecture with the following core components:
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>ApiXGateway:</strong> Primary WebSocket gateway managing connection lifecycle</li>
                <li>• <strong>EventRouter:</strong> Central real-time event bus for message routing</li>
                <li>• <strong>SubscriptionManager:</strong> Channel-based subscriptions with permission enforcement</li>
                <li>• <strong>MessageQueueManager:</strong> Redis-backed message queue with durability</li>
                <li>• <strong>ConnectionManager:</strong> Connection state tracking and heartbeat management</li>
                <li>• <strong>RetryManager:</strong> Exponential backoff strategy for guaranteed delivery</li>
                <li>• <strong>LatencyTracker:</strong> Performance monitoring and QoS optimization</li>
                <li>• <strong>AuditLogger:</strong> Comprehensive activity logging for compliance</li>
              </ul>
            </div>
          </div>
        );

      case 'api-testing':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">API Testing Guidelines</h2>
              <p className="text-gray-600 mb-6">
                Comprehensive guidelines for testing REST API endpoints in the APIX Real-Time Backend.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Available Endpoints</h3>
              <div className="space-y-4">
                <div className="card p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">GET</span>
                    <code className="text-sm font-mono">/api/v1</code>
                  </div>
                  <p className="text-sm text-gray-600">Health check endpoint - Returns basic service status</p>
                </div>
                <div className="card p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">GET</span>
                    <code className="text-sm font-mono">/api/v1/status</code>
                  </div>
                  <p className="text-sm text-gray-600">Detailed status endpoint - Returns comprehensive system metrics</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Example API Test</h3>
              <CodeBlock
                id="api-test-example"
                language="JavaScript"
                code={`// Example API test using fetch
const testHealthEndpoint = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/v1');
    const data = await response.json();
    
    // Validate response structure
    console.assert(response.status === 200, 'Expected status 200');
    console.assert(data.message, 'Expected message field');
    console.assert(data.timestamp, 'Expected timestamp field');
    console.assert(data.version, 'Expected version field');
    
    console.log('Health check passed:', data);
  } catch (error) {
    console.error('Health check failed:', error);
  }
};

testHealthEndpoint();`}
              />
            </div>

            <InfoBox type="warning">
              <div>
                <strong>Testing Best Practices:</strong>
                <ul className="mt-2 space-y-1">
                  <li>• Always validate response status codes</li>
                  <li>• Check response structure and required fields</li>
                  <li>• Test error scenarios and edge cases</li>
                  <li>• Measure response times for performance validation</li>
                </ul>
              </div>
            </InfoBox>
          </div>
        );

      case 'websocket-testing':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">WebSocket Testing Guidelines</h2>
              <p className="text-gray-600 mb-6">
                Guidelines for testing real-time WebSocket connections and event handling.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Connection Testing</h3>
              <CodeBlock
                id="websocket-connection"
                language="JavaScript"
                code={`// WebSocket connection test
const testWebSocketConnection = () => {
  const ws = new WebSocket('ws://localhost:3001/ws');
  
  ws.onopen = (event) => {
    console.log('WebSocket connected:', event);
    
    // Send authentication message
    ws.send(JSON.stringify({
      type: 'auth',
      token: 'your-jwt-token',
      clientType: 'WEB_APP'
    }));
  };
  
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log('Received message:', message);
  };
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  
  ws.onclose = (event) => {
    console.log('WebSocket closed:', event.code, event.reason);
  };
  
  return ws;
};`}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Event Types</h3>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Connection Events</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• connection.established</li>
                      <li>• connection.error</li>
                      <li>• connection.disconnected</li>
                      <li>• heartbeat.ping</li>
                      <li>• heartbeat.pong</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">System Events</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• tool_call_start</li>
                      <li>• tool_call_result</li>
                      <li>• agent_status_update</li>
                      <li>• workflow_state_change</li>
                      <li>• system_notification</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <InfoBox type="success">
              <div>
                <strong>WebSocket Testing Checklist:</strong>
                <ul className="mt-2 space-y-1">
                  <li>✓ Connection establishment and authentication</li>
                  <li>✓ Message sending and receiving</li>
                  <li>✓ Heartbeat mechanism</li>
                  <li>✓ Reconnection handling</li>
                  <li>✓ Error handling and cleanup</li>
                </ul>
              </div>
            </InfoBox>
          </div>
        );

      case 'best-practices':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Testing Best Practices</h2>
              <p className="text-gray-600 mb-6">
                Professional guidelines and best practices for comprehensive APIX testing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Organization</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Group tests by functionality</li>
                  <li>• Use descriptive test names</li>
                  <li>• Maintain test documentation</li>
                  <li>• Version control test cases</li>
                  <li>• Regular test maintenance</li>
                </ul>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Testing</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Monitor response times</li>
                  <li>• Test under load conditions</li>
                  <li>• Validate memory usage</li>
                  <li>• Check connection limits</li>
                  <li>• Measure throughput</li>
                </ul>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Testing</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Validate authentication</li>
                  <li>• Test authorization levels</li>
                  <li>• Check input validation</li>
                  <li>• Verify rate limiting</li>
                  <li>• Test error handling</li>
                </ul>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Automation</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Automate regression tests</li>
                  <li>• Continuous integration</li>
                  <li>• Scheduled test runs</li>
                  <li>• Automated reporting</li>
                  <li>• Alert mechanisms</li>
                </ul>
              </div>
            </div>

            <InfoBox type="info">
              <div>
                <strong>Professional Testing Standards:</strong> Follow industry-standard testing practices 
                including comprehensive test coverage, proper error handling, performance benchmarking, 
                and security validation to ensure production-ready quality.
              </div>
            </InfoBox>
          </div>
        );

      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Documentation</h2>
        <nav className="space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors",
                  activeSection === section.id
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{section.title}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-8 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default Documentation;
