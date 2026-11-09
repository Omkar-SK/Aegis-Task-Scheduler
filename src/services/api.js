/**
 * Aegis Centralized API Gateway Layer
 * 
 * Routes requests to either:
 * - Native C++ Backend Daemon (via REST HTTP: Crow / Boost.Beast / Pistache / oatpp)
 * - Or Pluggable Mock API Adapter when daemon is offline or in simulated demo mode.
 */

import mockApiAdapter from './mockApiAdapter.js';

const DEFAULT_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080/api';
const DEFAULT_TIMEOUT_MS = 2500;

class ApiGateway {
  constructor() {
    this.baseUrl = localStorage.getItem('aegis_cxx_backend_url') || DEFAULT_BASE_URL;
    this.mode = 'AUTO'; // 'AUTO' | 'MOCK' | 'NATIVE'
    this.isBackendOnline = false;
    this.lastLatencyMs = null;
    this.healthCheckPromise = null;
  }

  setBaseUrl(url) {
    this.baseUrl = url;
    localStorage.setItem('aegis_cxx_backend_url', url);
  }

  setMode(mode) {
    this.mode = mode;
  }

  /**
   * Ping backend to check if C++ native daemon is active
   */
  async checkHealth() {
    if (this.mode === 'MOCK') {
      this.isBackendOnline = false;
      return { online: false, mode: 'MOCK', message: 'Manual mock mode selected' };
    }

    const startTime = performance.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);

      const res = await fetch(`${this.baseUrl}/health`, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      clearTimeout(timeoutId);

      const endTime = performance.now();
      this.lastLatencyMs = Math.round(endTime - startTime);
      this.isBackendOnline = res.ok;

      return {
        online: res.ok,
        latencyMs: this.lastLatencyMs,
        mode: res.ok ? 'NATIVE' : 'MOCK',
        message: res.ok
          ? `Connected to C++ Aegis Daemon (${this.lastLatencyMs} ms)`
          : 'C++ Daemon offline; fallback to mock adapter',
      };
    } catch {
      this.isBackendOnline = false;
      this.lastLatencyMs = null;
      return {
        online: false,
        latencyMs: null,
        mode: 'MOCK',
        message: 'C++ Daemon offline; local mock adapter active',
      };
    }
  }

  /**
   * Internal request router
   */
  async request(method, endpoint, body = null, params = null) {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    // 1. If in NATIVE mode or AUTO mode with active backend, attempt real HTTP fetch
    if (this.mode === 'NATIVE' || (this.mode === 'AUTO' && this.isBackendOnline)) {
      try {
        let url = `${this.baseUrl}${cleanEndpoint}`;
        if (params && Object.keys(params).length > 0) {
          const qs = new URLSearchParams(params).toString();
          url += `?${qs}`;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

        const response = await fetch(url, {
          method,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-Client': 'Aegis-Frontend-v1',
          },
          body: body ? JSON.stringify(body) : undefined,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`C++ Daemon HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return {
          status: response.status,
          data,
          source: 'CXX_BACKEND',
        };
      } catch (err) {
        // Fallback to mock adapter if in AUTO mode
        if (this.mode === 'AUTO') {
          console.warn(`Backend request to ${cleanEndpoint} failed, routing to mock adapter:`, err.message);
          this.isBackendOnline = false;
        } else {
          throw err;
        }
      }
    }

    // 2. Mock API Adapter Routing
    return await this.routeToMockAdapter(method, cleanEndpoint, body, params);
  }

  /**
   * Route request to simulated mock adapter
   */
  async routeToMockAdapter(method, endpoint, body, params) {
    // GET /api/tasks
    if (method === 'GET' && endpoint === '/api/tasks') {
      return await mockApiAdapter.getTasks(params || {});
    }

    // POST /api/tasks
    if (method === 'POST' && endpoint === '/api/tasks') {
      return await mockApiAdapter.createTask(body);
    }

    // PUT /api/tasks/:id
    const putTaskMatch = endpoint.match(/^\/api\/tasks\/([^/]+)$/);
    if (method === 'PUT' && putTaskMatch) {
      const id = putTaskMatch[1];
      return await mockApiAdapter.updateTask(id, body);
    }

    // DELETE /api/tasks/:id
    const deleteTaskMatch = endpoint.match(/^\/api\/tasks\/([^/]+)$/);
    if (method === 'DELETE' && deleteTaskMatch) {
      const id = deleteTaskMatch[1];
      return await mockApiAdapter.deleteTask(id);
    }

    // POST /api/scheduler/run
    if (method === 'POST' && endpoint === '/api/scheduler/run') {
      return await mockApiAdapter.runScheduler(body || {});
    }

    // POST /api/scheduler/pause
    if (method === 'POST' && endpoint === '/api/scheduler/pause') {
      return await mockApiAdapter.pauseScheduler();
    }

    // POST /api/scheduler/resume
    if (method === 'POST' && endpoint === '/api/scheduler/resume') {
      return await mockApiAdapter.resumeScheduler();
    }

    // POST /api/scheduler/reset
    if (method === 'POST' && endpoint === '/api/scheduler/reset') {
      return await mockApiAdapter.resetScheduler();
    }

    // POST /api/scheduler/compare
    if (method === 'POST' && endpoint === '/api/scheduler/compare') {
      return await mockApiAdapter.compareAlgorithms(body || {});
    }

    // GET /api/scheduler/results/:runId
    const resultsMatch = endpoint.match(/^\/api\/scheduler\/results\/([^/]+)$/);
    if (method === 'GET' && resultsMatch) {
      const runId = resultsMatch[1];
      return await mockApiAdapter.getRunResults(runId);
    }

    // Default 404
    throw new Error(`Endpoint ${method} ${endpoint} not handled by API Gateway`);
  }

  get(endpoint, params) {
    return this.request('GET', endpoint, null, params);
  }

  post(endpoint, body) {
    return this.request('POST', endpoint, body);
  }

  put(endpoint, body) {
    return this.request('PUT', endpoint, body);
  }

  delete(endpoint) {
    return this.request('DELETE', endpoint);
  }
}

export const api = new ApiGateway();
export default api;
