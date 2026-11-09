/**
 * Aegis Services Module
 * 
 * Central entry point for API, Scheduler, Task, and WebSocket services.
 */

export { api, default as defaultApi } from './api';
export { schedulerService } from './schedulerService';
export { taskService } from './taskService';
export { websocketService, WS_STATUS } from './websocketService';
export { mockApiAdapter } from './mockApiAdapter';
export * from './contracts';

