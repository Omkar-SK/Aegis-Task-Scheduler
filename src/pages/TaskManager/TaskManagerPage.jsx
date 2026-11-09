import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Layers,
  Plus,
  Play,
  Clock,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import MetricCard from '../../components/common/MetricCard';
import Button from '../../components/common/Button';
import TaskModal from '../../components/tasks/TaskModal';
import DeleteConfirmModal from '../../components/tasks/DeleteConfirmModal';
import TaskFilters from '../../components/tasks/TaskFilters';
import TaskTable from '../../components/tasks/TaskTable';
import WorkloadPresets from '../../components/tasks/WorkloadPresets';
import TaskImportExport from '../../components/tasks/TaskImportExport';
import ConnectionStatusBar from '../../components/common/ConnectionStatusBar';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/StateDisplay';
import taskService from '../../services/taskService';
import { WORKLOAD_PRESETS } from '../../data/workloadPresets';

export function TaskManagerPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [activePresetId, setActivePresetId] = useState('BALANCED');

  // Search, Filter & Sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('arrivalTime');
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' | 'desc'

  // Load tasks via TaskService
  const loadTasksFromService = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await taskService.getTasks();
      setTasks(res.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setError(err.message || 'Failed to communicate with task service');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasksFromService();
  }, [loadTasksFromService]);

  // Task Counts by Status
  const statusCounts = useMemo(() => {
    return {
      running: tasks.filter((t) => t.state === 'running').length,
      ready: tasks.filter((t) => t.state === 'ready').length,
      waiting: tasks.filter((t) => t.state === 'waiting' || t.state === 'preempted').length,
      completed: tasks.filter((t) => t.state === 'completed').length,
    };
  }, [tasks]);

  // Filtered & Sorted Tasks
  const processedTasks = useMemo(() => {
    let result = [...tasks];

    // Status filter
    if (statusFilter !== 'ALL') {
      result = result.filter((t) => t.state?.toUpperCase() === statusFilter);
    }

    // Search query (by ID or name)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.id.toLowerCase().includes(query)
      );
    }

    // Sorting
    result.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (!isNaN(Number(valA)) && !isNaN(Number(valB))) {
        valA = Number(valA);
        valB = Number(valB);
      } else {
        valA = String(valA || '').toLowerCase();
        valB = String(valB || '').toLowerCase();
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [tasks, statusFilter, searchQuery, sortBy, sortDirection]);

  // CRUD Handlers via taskService
  const handleCreateOrUpdateTask = async (taskData) => {
    try {
      if (editingTask) {
        const res = await taskService.updateTask(editingTask.id, taskData);
        setTasks((prev) =>
          prev.map((t) => (t.id === editingTask.id ? res.data : t))
        );
        setEditingTask(null);
      } else {
        const res = await taskService.createTask(taskData);
        if (res.data) {
          setTasks((prev) => [res.data, ...prev]);
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(`Error saving task: ${err.message}`);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      setDeletingTask(null);
    } catch (err) {
      alert(`Error deleting task: ${err.message}`);
    }
  };

  const handleOpenAddModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleToggleSortDirection = () => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  // Workload Preset Injection
  const handleSelectPreset = async (presetId) => {
    setActivePresetId(presetId);
    const preset = WORKLOAD_PRESETS[presetId];
    if (preset) {
      try {
        setLoading(true);
        // Replace current tasks with preset tasks
        const res = await taskService.importTasks(preset.tasks);
        setTasks(res.tasks);
        setLoading(false);
      } catch (err) {
        console.error('Failed to inject preset tasks', err);
        setTasks([...preset.tasks]);
        setLoading(false);
      }
    }
  };

  // Import / Export Handlers
  const handleImportTasks = async (importedTasks) => {
    try {
      setLoading(true);
      const res = await taskService.importTasks(importedTasks);
      setTasks(res.tasks);
      setLoading(false);
    } catch (err) {
      alert(`Import error: ${err.message}`);
      setLoading(false);
    }
  };

  const handleExportTasks = () => {
    taskService.exportTasksJson(tasks);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 font-sans">
      {/* Page Header with Connection Status */}
      <PageHeader
        title="Task Manager"
        breadcrumbs={[{ label: 'Aegis', to: '/' }, { label: 'Task Manager' }]}
        subtitle="Manage, configure, and inspect task descriptors submitted to the scheduling engine pipeline."
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <ConnectionStatusBar />

            <TaskImportExport
              tasks={tasks}
              onImportTasks={handleImportTasks}
              onExportTasks={handleExportTasks}
            />

            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={handleOpenAddModal}
            >
              Add Task
            </Button>
          </div>
        }
      />

      {/* Task Status Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Ready Queue"
          value={statusCounts.ready}
          subtitle="Waiting for CPU slice"
          icon={Layers}
          accentColor="indigo"
        />
        <MetricCard
          title="Currently Running"
          value={statusCounts.running}
          subtitle="Executing on CPU Cores"
          icon={Play}
          accentColor="teal"
        />
        <MetricCard
          title="Blocked (I/O)"
          value={statusCounts.waiting}
          subtitle="Awaiting asynchronous DMA/network"
          icon={Clock}
          accentColor="amber"
        />
        <MetricCard
          title="Completed"
          value={statusCounts.completed}
          subtitle="Terminated gracefully"
          icon={CheckCircle2}
          accentColor="emerald"
        />
      </div>

      {/* Predefined Workload Presets */}
      <WorkloadPresets
        onSelectPreset={handleSelectPreset}
        activePresetId={activePresetId}
      />

      {/* Filters, Search & Sort */}
      <div className="p-4 rounded-xl border border-aegis-border bg-aegis-card shadow-card-subtle">
        <TaskFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          sortDirection={sortDirection}
          onToggleSortDirection={handleToggleSortDirection}
          statusCounts={statusCounts}
          totalCount={tasks.length}
        />
      </div>

      {/* Content Area with Loading, Error, Empty & Table States */}
      {loading ? (
        <LoadingState message="Fetching task descriptors via TaskService..." />
      ) : error ? (
        <ErrorState
          title="Task Registry Sync Failed"
          message={error}
          onRetry={loadTasksFromService}
        />
      ) : processedTasks.length === 0 ? (
        <EmptyState
          title="No Tasks Found"
          description={
            searchQuery || statusFilter !== 'ALL'
              ? 'No tasks match the active filter or search query.'
              : 'The task registry is currently empty. Add a task or load a workload preset.'
          }
          actionLabel="Add Task"
          onAction={handleOpenAddModal}
        />
      ) : (
        <TaskTable
          tasks={processedTasks}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSortChange={setSortBy}
          onEditTask={handleOpenEditModal}
          onDeleteTask={setDeletingTask}
        />
      )}

      {/* Add / Edit Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleCreateOrUpdateTask}
        initialData={editingTask}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDeleteTask}
        task={deletingTask}
      />
    </div>
  );
}

export default TaskManagerPage;
