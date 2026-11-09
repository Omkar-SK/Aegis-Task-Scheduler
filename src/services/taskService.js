/**
 * Aegis Task Management Service
 * 
 * Provides unified, asynchronous CRUD operations for CPU tasks.
 * Interacts with C++ native backend or mock API adapter via api.js.
 */

import api from './api.js';

export const taskService = {
  /**
   * Fetch all tasks with optional search, status filtering, and sorting
   * 
   * @param {Object} [params]
   * @param {string} [params.search] - Search term matching ID or name
   * @param {string} [params.status] - 'all' | 'ready' | 'running' | 'completed' | 'preempted'
   * @param {string} [params.sortBy] - 'arrivalTime' | 'burstTime' | 'deadline' | 'priority' | 'id'
   * @param {'asc' | 'desc'} [params.order='asc']
   * @returns {Promise<{ data: Array<import('./contracts').TaskResponse>, count: number, source: string }>}
   */
  async getTasks(params = {}) {
    const res = await api.get('/api/tasks', params);
    return res;
  },

  /**
   * Submit a new task to the scheduling registry
   * 
   * @param {import('./contracts').TaskCreationPayload} taskData
   * @returns {Promise<{ data: import('./contracts').TaskResponse, message: string }>}
   */
  async createTask(taskData) {
    const payload = {
      name: taskData.name,
      arrivalTime: Number(taskData.arrivalTime) || 0,
      burstTime: Number(taskData.burstTime || taskData.burstTimeMs) || 10,
      deadline: Number(taskData.deadline) || ((Number(taskData.arrivalTime) || 0) + (Number(taskData.burstTime || taskData.burstTimeMs) || 10) * 2),
      priority: Number(taskData.priority) || 5,
      type: taskData.type || 'CPU-Bound',
      memoryKb: Number(taskData.memoryKb) || 16384,
      affinityMask: Number(taskData.affinityMask) || 0,
    };

    const res = await api.post('/api/tasks', payload);
    return res;
  },

  /**
   * Update an existing task
   * 
   * @param {string} taskId
   * @param {Partial<import('./contracts').TaskCreationPayload>} taskData
   * @returns {Promise<{ data: import('./contracts').TaskResponse, message: string }>}
   */
  async updateTask(taskId, taskData) {
    const res = await api.put(`/api/tasks/${taskId}`, taskData);
    return res;
  },

  /**
   * Delete a task by ID
   * 
   * @param {string} taskId
   * @returns {Promise<{ message: string, id: string }>}
   */
  async deleteTask(taskId) {
    const res = await api.delete(`/api/tasks/${taskId}`);
    return res;
  },

  /**
   * Batch import tasks from JSON
   * 
   * @param {Array<import('./contracts').TaskCreationPayload>} taskArray
   * @returns {Promise<{ importedCount: number, tasks: Array<any> }>}
   */
  async importTasks(taskArray) {
    if (!Array.isArray(taskArray)) {
      throw new Error('Import payload must be an array of task descriptors');
    }

    const created = [];
    for (const t of taskArray) {
      if (t.name && (t.burstTime || t.burstTimeMs)) {
        const res = await this.createTask(t);
        created.push(res.data);
      }
    }

    return {
      importedCount: created.length,
      tasks: created,
    };
  },

  /**
   * Export tasks as downloadable JSON artifact
   * 
   * @param {Array<import('./contracts').TaskResponse>} tasks
   */
  exportTasksJson(tasks) {
    const jsonStr = JSON.stringify(tasks, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aegis_tasks_export_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};

export default taskService;
