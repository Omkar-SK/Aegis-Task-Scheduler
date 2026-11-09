/**
 * Aegis Application Configuration & Defaults
 */

export const APP_CONFIG = {
  appName: 'Aegis',
  fullName: 'Aegis — Adaptive Multithreaded Task Scheduler',
  version: '1.0.0',
  course: 'Operating Systems Course Project',
  defaultPollingIntervalMs: 1000,
  defaultCoresCount: 8,
  defaultTimeQuantumMs: 25,
  maxPriorityLevel: 10,
  backend: {
    defaultUrl: 'http://localhost:8080/api',
    timeoutMs: 3000,
    healthCheckIntervalMs: 10000,
  },
};

export default APP_CONFIG;

