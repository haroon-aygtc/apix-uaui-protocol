### API Helpers (testing-ui/src/utils/api.ts)
- apiClient: preconfigured Axios instance
- healthCheck(): GET '/'
- getStatus(): GET '/status'
- testApiEndpoint(endpoint, method='GET', data?, headers?): generic tester with timing/size
- getWebSocketUrl(): builds ws:// URL from env

Example:
```ts
import { healthCheck, getStatus, testApiEndpoint, getWebSocketUrl } from '@/utils/api';

const health = await healthCheck();
const status = await getStatus();
const result = await testApiEndpoint('/rbac/roles', 'GET');
const wsUrl = getWebSocketUrl();
```

### Helpers (testing-ui/src/utils/helpers.ts)
- cn(...classValues): merge Tailwind classes
- formatBytes(bytes, decimals=2)
- formatDuration(ms)
- formatRelativeTime(iso)
- generateId()
- isValidJSON(str)
- prettyPrintJSON(obj)
- getStatusColor(status)
- getMethodColor(method)
- debounce(fn, wait)
- copyToClipboard(text)
- downloadAsFile(content, filename, type='text/plain')

Example:
```ts
const id = generateId();
const size = formatBytes(153600); // "150 KB"
const ago = formatRelativeTime(new Date().toISOString());
const onSearch = debounce((q) => console.log(q), 300);
```

### Store (testing-ui/src/stores/testingStore.ts)
- useTestingStore(): Zustand store with state/actions
- State: backendStatus, isBackendOnline, testCases, activeTestCase, testResults, isRunningTests, wsConnected, wsMessages, activeConnections, performanceMetrics, activeTab, sidebarCollapsed
- Actions: setBackendStatus, setBackendOnline, addTestCase, updateTestCase, deleteTestCase, setActiveTestCase, addTestResult, updateTestResult, clearTestResults, setRunningTests, setWsConnected, addWsMessage, clearWsMessages, setActiveConnections, addPerformanceMetric, setActiveTab, setSidebarCollapsed

Example:
```ts
import { useTestingStore } from '@/stores/testingStore';

const add = useTestingStore((s) => s.addTestCase);
add({ id: 't1', name: 'Health', description: 'Health endpoint', type: 'api', endpoint: '/', method: 'GET' });
```

### Types (testing-ui/src/types/apix.ts)
- Core: ApiXConnection, ApiXEvent, ApiXChannel
- Enums: ClientType, ConnectionStatus, ChannelType
- API responses: HealthResponse, StatusResponse
- WebSocket: WebSocketMessage, SubscriptionRequest
- Testing: TestCase, TestResult, PerformanceMetrics

Type usage:
```ts
import type { ApiXEvent, WebSocketMessage } from '@/types/apix';
const msg: WebSocketMessage = { type: 'publish', channel: 'agent_events', payload: {} };
```