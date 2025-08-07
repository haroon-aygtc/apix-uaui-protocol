import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  TestCase, 
  TestResult, 
  PerformanceMetrics, 
  StatusResponse,
  ApiXConnection,
  WebSocketMessage 
} from '@/types/apix';

interface TestingState {
  // Backend Status
  backendStatus: StatusResponse | null;
  isBackendOnline: boolean;
  
  // Test Cases
  testCases: TestCase[];
  activeTestCase: TestCase | null;
  
  // Test Results
  testResults: TestResult[];
  isRunningTests: boolean;
  
  // WebSocket
  wsConnected: boolean;
  wsMessages: WebSocketMessage[];
  activeConnections: ApiXConnection[];
  
  // Performance
  performanceMetrics: PerformanceMetrics[];
  
  // UI State
  activeTab: string;
  sidebarCollapsed: boolean;
  
  // Actions
  setBackendStatus: (status: StatusResponse) => void;
  setBackendOnline: (online: boolean) => void;
  addTestCase: (testCase: TestCase) => void;
  updateTestCase: (id: string, updates: Partial<TestCase>) => void;
  deleteTestCase: (id: string) => void;
  setActiveTestCase: (testCase: TestCase | null) => void;
  addTestResult: (result: TestResult) => void;
  updateTestResult: (id: string, updates: Partial<TestResult>) => void;
  clearTestResults: () => void;
  setRunningTests: (running: boolean) => void;
  setWsConnected: (connected: boolean) => void;
  addWsMessage: (message: WebSocketMessage) => void;
  clearWsMessages: () => void;
  setActiveConnections: (connections: ApiXConnection[]) => void;
  addPerformanceMetric: (metric: PerformanceMetrics) => void;
  setActiveTab: (tab: string) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useTestingStore = create<TestingState>()(
  devtools(
    (set) => ({
      // Initial State
      backendStatus: null,
      isBackendOnline: false,
      testCases: [],
      activeTestCase: null,
      testResults: [],
      isRunningTests: false,
      wsConnected: false,
      wsMessages: [],
      activeConnections: [],
      performanceMetrics: [],
      activeTab: 'dashboard',
      sidebarCollapsed: false,

      // Actions
      setBackendStatus: (status) => set({ backendStatus: status }),
      
      setBackendOnline: (online) => set({ isBackendOnline: online }),
      
      addTestCase: (testCase) => 
        set((state) => ({ testCases: [...state.testCases, testCase] })),
      
      updateTestCase: (id, updates) =>
        set((state) => ({
          testCases: state.testCases.map((tc) =>
            tc.id === id ? { ...tc, ...updates } : tc
          ),
        })),
      
      deleteTestCase: (id) =>
        set((state) => ({
          testCases: state.testCases.filter((tc) => tc.id !== id),
        })),
      
      setActiveTestCase: (testCase) => set({ activeTestCase: testCase }),
      
      addTestResult: (result) =>
        set((state) => ({ testResults: [result, ...state.testResults] })),
      
      updateTestResult: (id, updates) =>
        set((state) => ({
          testResults: state.testResults.map((tr) =>
            tr.id === id ? { ...tr, ...updates } : tr
          ),
        })),
      
      clearTestResults: () => set({ testResults: [] }),
      
      setRunningTests: (running) => set({ isRunningTests: running }),
      
      setWsConnected: (connected) => set({ wsConnected: connected }),
      
      addWsMessage: (message) =>
        set((state) => ({ 
          wsMessages: [message, ...state.wsMessages].slice(0, 1000) // Keep last 1000 messages
        })),
      
      clearWsMessages: () => set({ wsMessages: [] }),
      
      setActiveConnections: (connections) => set({ activeConnections: connections }),
      
      addPerformanceMetric: (metric) =>
        set((state) => ({
          performanceMetrics: [metric, ...state.performanceMetrics].slice(0, 100) // Keep last 100 metrics
        })),
      
      setActiveTab: (tab) => set({ activeTab: tab }),
      
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
    }),
    {
      name: 'apix-testing-store',
    }
  )
);
