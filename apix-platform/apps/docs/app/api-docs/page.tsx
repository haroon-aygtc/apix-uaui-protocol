import Link from 'next/link';

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  APIX Platform
                </h1>
              </Link>
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  <Link href="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Overview
                  </Link>
                  <Link href="/implementation-status" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Implementation Status
                  </Link>
                  <Link href="/api-docs" className="text-white bg-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                    API Documentation
                  </Link>
                  <Link href="/testing" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Testing Interface
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <a 
                href="http://localhost:3001/api/docs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md text-blue-300 bg-transparent hover:bg-blue-900/50 transition-colors"
              >
                Live Swagger Docs
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">API Documentation</h1>
          <p className="text-xl text-gray-300">
            Comprehensive API reference for the APIX Real-Time Platform
          </p>
          <div className="mt-4 flex items-center space-x-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Base URL: http://localhost:3001/api/v1
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              WebSocket: ws://localhost:3001
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <a href="#authentication" className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 hover:border-blue-600 transition-colors">
            <h3 className="font-semibold text-blue-400 mb-2">🔐 Authentication</h3>
            <p className="text-sm text-gray-400">JWT-based auth system</p>
          </a>
          <a href="#websocket" className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 hover:border-purple-600 transition-colors">
            <h3 className="font-semibold text-purple-400 mb-2">🔌 WebSocket</h3>
            <p className="text-sm text-gray-400">Real-time connections</p>
          </a>
          <a href="#monitoring" className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 hover:border-orange-600 transition-colors">
            <h3 className="font-semibold text-orange-400 mb-2">📊 Monitoring</h3>
            <p className="text-sm text-gray-400">Analytics & metrics</p>
          </a>
          <a href="#audit" className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 hover:border-green-600 transition-colors">
            <h3 className="font-semibold text-green-400 mb-2">📝 Audit</h3>
            <p className="text-sm text-gray-400">Logging & compliance</p>
          </a>
        </div>

        {/* Authentication API */}
        <div id="authentication" className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">🔐 Authentication API</h2>
          <p className="text-gray-300 mb-6">
            JWT-based authentication system with multi-tenant support and organization-scoped access control.
          </p>
          
          <div className="space-y-6">
            {/* Login */}
            <div className="border border-gray-700 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <span className="bg-green-600 text-white px-3 py-1 rounded text-sm font-mono mr-3">POST</span>
                <span className="font-mono text-gray-300">/api/v1/auth/login</span>
              </div>
              <p className="text-gray-400 mb-4">Authenticate user and receive JWT token</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Request Body</h4>
                  <pre className="bg-gray-800 rounded p-3 text-sm overflow-x-auto">
{`{
  "email": "user@example.com",
  "password": "password123"
}`}
                  </pre>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Response</h4>
                  <pre className="bg-gray-800 rounded p-3 text-sm overflow-x-auto">
{`{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "organizationId": "org_456"
  }
}`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Register */}
            <div className="border border-gray-700 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <span className="bg-green-600 text-white px-3 py-1 rounded text-sm font-mono mr-3">POST</span>
                <span className="font-mono text-gray-300">/api/v1/auth/register</span>
              </div>
              <p className="text-gray-400 mb-4">Create new user account</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Request Body</h4>
                  <pre className="bg-gray-800 rounded p-3 text-sm overflow-x-auto">
{`{
  "email": "newuser@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "organizationId": "org_456"
}`}
                  </pre>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Response</h4>
                  <pre className="bg-gray-800 rounded p-3 text-sm overflow-x-auto">
{`{
  "message": "User created successfully",
  "user": {
    "id": "user_789",
    "email": "newuser@example.com",
    "organizationId": "org_456"
  }
}`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Profile */}
            <div className="border border-gray-700 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-mono mr-3">GET</span>
                <span className="font-mono text-gray-300">/api/v1/auth/profile</span>
                <span className="ml-3 text-xs bg-yellow-900/50 text-yellow-300 px-2 py-1 rounded">Requires Auth</span>
              </div>
              <p className="text-gray-400 mb-4">Get current user profile information</p>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Response</h4>
                <pre className="bg-gray-800 rounded p-3 text-sm overflow-x-auto">
{`{
  "id": "user_123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "organizationId": "org_456",
  "isActive": true,
  "lastLoginAt": "2025-08-06T01:30:00Z"
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* WebSocket API */}
        <div id="websocket" className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">🔌 WebSocket API</h2>
          <p className="text-gray-300 mb-6">
            Real-time WebSocket communication for event streaming and live updates.
          </p>
          
          <div className="space-y-6">
            {/* Connection */}
            <div className="border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-400 mb-4">Connection</h3>
              <div className="bg-gray-800 rounded p-4 mb-4">
                <code className="text-green-400">ws://localhost:3001?token=YOUR_JWT_TOKEN</code>
              </div>
              <p className="text-gray-400">
                Connect to the WebSocket server using your JWT token for authentication.
              </p>
            </div>

            {/* Subscribe */}
            <div className="border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-400 mb-4">Subscribe to Channel</h3>
              <pre className="bg-gray-800 rounded p-4 text-sm overflow-x-auto">
{`{
  "type": "subscribe",
  "channel": "agent_events",
  "metadata": {
    "organizationId": "org_456"
  }
}`}
              </pre>
            </div>

            {/* Publish */}
            <div className="border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-400 mb-4">Publish Event</h3>
              <pre className="bg-gray-800 rounded p-4 text-sm overflow-x-auto">
{`{
  "type": "publish",
  "channel": "agent_events",
  "payload": {
    "eventType": "agent_started",
    "agentId": "agent_123",
    "timestamp": "2025-08-06T01:30:00Z"
  }
}`}
              </pre>
            </div>

            {/* Event Types */}
            <div className="border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-400 mb-4">Channel Types</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Available Channels</h4>
                  <ul className="space-y-1 text-sm text-gray-400">
                    <li>• <code>agent_events</code> - AI agent lifecycle events</li>
                    <li>• <code>tool_events</code> - Tool execution events</li>
                    <li>• <code>workflow_events</code> - Workflow state changes</li>
                    <li>• <code>system_events</code> - System notifications</li>
                    <li>• <code>private_user</code> - User-specific events</li>
                    <li>• <code>organization</code> - Org-wide broadcasts</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Event Structure</h4>
                  <pre className="bg-gray-800 rounded p-3 text-xs overflow-x-auto">
{`{
  "id": "event_123",
  "type": "agent_started",
  "channel": "agent_events",
  "payload": { ... },
  "timestamp": "2025-08-06T01:30:00Z",
  "organizationId": "org_456"
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monitoring API */}
        <div id="monitoring" className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">📊 Monitoring API</h2>
          <p className="text-gray-300 mb-6">
            Analytics, metrics, and performance monitoring endpoints.
          </p>
          
          <div className="space-y-4">
            <div className="border border-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-mono mr-3">GET</span>
                <span className="font-mono text-gray-300">/api/v1/monitoring/latency/stats</span>
              </div>
              <p className="text-gray-400 text-sm">Get latency statistics and performance metrics</p>
            </div>
            
            <div className="border border-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-mono mr-3">GET</span>
                <span className="font-mono text-gray-300">/api/v1/monitoring/latency/dashboard</span>
              </div>
              <p className="text-gray-400 text-sm">Get comprehensive dashboard data for monitoring</p>
            </div>
            
            <div className="border border-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-mono mr-3">GET</span>
                <span className="font-mono text-gray-300">/api/v1/monitoring/latency/alerts</span>
              </div>
              <p className="text-gray-400 text-sm">Get active alerts and performance warnings</p>
            </div>
          </div>
        </div>

        {/* Audit API */}
        <div id="audit" className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6">📝 Audit API</h2>
          <p className="text-gray-300 mb-6">
            Audit logging, compliance reporting, and security event tracking.
          </p>
          
          <div className="space-y-4">
            <div className="border border-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-mono mr-3">GET</span>
                <span className="font-mono text-gray-300">/api/v1/audit/logs</span>
              </div>
              <p className="text-gray-400 text-sm">Retrieve audit logs with filtering and pagination</p>
            </div>
            
            <div className="border border-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <span className="bg-green-600 text-white px-3 py-1 rounded text-sm font-mono mr-3">POST</span>
                <span className="font-mono text-gray-300">/api/v1/audit/log-event</span>
              </div>
              <p className="text-gray-400 text-sm">Log a custom audit event for compliance tracking</p>
            </div>
            
            <div className="border border-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-mono mr-3">GET</span>
                <span className="font-mono text-gray-300">/api/v1/audit/compliance-report</span>
              </div>
              <p className="text-gray-400 text-sm">Generate compliance reports for regulatory requirements</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
