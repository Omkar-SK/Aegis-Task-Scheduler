import React, { useState, useEffect } from 'react';
import { X, Send, AlertCircle, Cpu, Clock, Layers, Shield } from 'lucide-react';
import Button from '../common/Button';

export function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null, // null for Add Task, Task object for Edit Task
}) {
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    name: '',
    arrivalTime: 0,
    burstTimeMs: 50,
    deadline: 120,
    priority: 5,
    type: 'CPU-Bound',
    memoryKb: 16384,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        arrivalTime: initialData.arrivalTime !== undefined ? Number(initialData.arrivalTime) : 0,
        burstTimeMs: initialData.burstTimeMs !== undefined ? Number(initialData.burstTimeMs) : 50,
        deadline: initialData.deadline !== undefined ? Number(initialData.deadline) : 120,
        priority: initialData.priority !== undefined ? Number(initialData.priority) : 5,
        type: initialData.type || 'CPU-Bound',
        memoryKb: initialData.memoryKb || 16384,
      });
      setErrors({});
    } else {
      setFormData({
        name: '',
        arrivalTime: 0,
        burstTimeMs: 50,
        deadline: 120,
        priority: 5,
        type: 'CPU-Bound',
        memoryKb: 16384,
      });
      setErrors({});
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};

    if (!formData.name || !formData.name.trim()) {
      newErrors.name = 'Task name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Task name must be at least 2 characters';
    }

    const arrivalNum = Number(formData.arrivalTime);
    if (isNaN(arrivalNum) || arrivalNum < 0) {
      newErrors.arrivalTime = 'Arrival time must be 0 or a positive number (ms)';
    }

    const burstNum = Number(formData.burstTimeMs);
    if (isNaN(burstNum) || burstNum <= 0) {
      newErrors.burstTimeMs = 'Burst time must be greater than 0 ms';
    }

    const deadlineNum = Number(formData.deadline);
    if (isNaN(deadlineNum) || deadlineNum <= 0) {
      newErrors.deadline = 'Deadline must be a positive number (ms)';
    } else if (!isNaN(arrivalNum) && deadlineNum <= arrivalNum) {
      newErrors.deadline = 'Deadline must be greater than arrival time';
    }

    const priorityNum = Number(formData.priority);
    if (isNaN(priorityNum) || priorityNum < 1 || priorityNum > 10) {
      newErrors.priority = 'Priority must be an integer between 1 (Lowest) and 10 (Highest)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      name: formData.name.trim(),
      arrivalTime: Number(formData.arrivalTime),
      burstTimeMs: Number(formData.burstTimeMs),
      deadline: Number(formData.deadline),
      priority: Number(formData.priority),
      remainingTimeMs: isEditing ? (initialData.remainingTimeMs || Number(formData.burstTimeMs)) : Number(formData.burstTimeMs),
      memoryKb: Number(formData.memoryKb) || 16384,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-xl border border-aegis-border bg-aegis-card shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-aegis-border flex items-center justify-between bg-aegis-sidebar">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-aegis-card border border-aegis-border text-aegis-teal">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {isEditing ? `Edit Task [${initialData.id}]` : 'Create & Enqueue New Task'}
              </h3>
              <p className="text-xs text-aegis-muted">
                {isEditing ? 'Update Process Control Block attributes' : 'Define OS task parameters and execution constraints'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-aegis-muted hover:text-white rounded-lg hover:bg-aegis-card transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {/* Task Name */}
          <div>
            <label className="block text-xs font-semibold text-white mb-1">
              Task Identifier / Binary Name <span className="text-status-rose">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. matrix_multiply_avx2"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: null });
              }}
              className={`w-full px-3 py-2 bg-aegis-bg border rounded-lg text-sm text-white font-terminal placeholder:text-aegis-subtle focus:outline-none ${
                errors.name ? 'border-status-rose focus:border-status-rose' : 'border-aegis-border focus:border-aegis-teal'
              }`}
            />
            {errors.name && (
              <p className="text-[11px] text-status-rose mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Timing Grid: Arrival Time, Burst Time, Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Arrival Time */}
            <div>
              <label className="block text-xs font-semibold text-white mb-1">
                Arrival Time (ms) <span className="text-status-rose">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="5"
                value={formData.arrivalTime}
                onChange={(e) => {
                  setFormData({ ...formData, arrivalTime: e.target.value });
                  if (errors.arrivalTime) setErrors({ ...errors, arrivalTime: null });
                }}
                className={`w-full px-3 py-2 bg-aegis-bg border rounded-lg text-sm text-white font-terminal focus:outline-none ${
                  errors.arrivalTime ? 'border-status-rose' : 'border-aegis-border focus:border-aegis-teal'
                }`}
              />
              {errors.arrivalTime && (
                <p className="text-[10px] text-status-rose mt-1">{errors.arrivalTime}</p>
              )}
            </div>

            {/* Burst Time */}
            <div>
              <label className="block text-xs font-semibold text-white mb-1">
                Burst Time (ms) <span className="text-status-rose">*</span>
              </label>
              <input
                type="number"
                min="5"
                step="5"
                value={formData.burstTimeMs}
                onChange={(e) => {
                  setFormData({ ...formData, burstTimeMs: e.target.value });
                  if (errors.burstTimeMs) setErrors({ ...errors, burstTimeMs: null });
                }}
                className={`w-full px-3 py-2 bg-aegis-bg border rounded-lg text-sm text-white font-terminal focus:outline-none ${
                  errors.burstTimeMs ? 'border-status-rose' : 'border-aegis-border focus:border-aegis-teal'
                }`}
              />
              {errors.burstTimeMs && (
                <p className="text-[10px] text-status-rose mt-1">{errors.burstTimeMs}</p>
              )}
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-xs font-semibold text-white mb-1">
                Deadline (ms) <span className="text-status-rose">*</span>
              </label>
              <input
                type="number"
                min="10"
                step="10"
                value={formData.deadline}
                onChange={(e) => {
                  setFormData({ ...formData, deadline: e.target.value });
                  if (errors.deadline) setErrors({ ...errors, deadline: null });
                }}
                className={`w-full px-3 py-2 bg-aegis-bg border rounded-lg text-sm text-white font-terminal focus:outline-none ${
                  errors.deadline ? 'border-status-rose' : 'border-aegis-border focus:border-aegis-teal'
                }`}
              />
              {errors.deadline && (
                <p className="text-[10px] text-status-rose mt-1">{errors.deadline}</p>
              )}
            </div>
          </div>

          {/* Priority & Workload Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Priority */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-white">
                  Base Priority (1-10)
                </label>
                <span className="text-xs font-bold text-aegis-teal font-terminal">
                  Level {formData.priority}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full accent-aegis-teal cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-aegis-subtle font-terminal mt-0.5">
                <span>1 (Background)</span>
                <span>5 (Normal)</span>
                <span>10 (Realtime)</span>
              </div>
            </div>

            {/* Workload Profile */}
            <div>
              <label className="block text-xs font-semibold text-white mb-1">
                Workload Profile
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 bg-aegis-bg border border-aegis-border rounded-lg text-sm text-white font-terminal focus:outline-none focus:border-aegis-teal"
              >
                <option value="CPU-Bound">CPU-Bound (Compute Heavy)</option>
                <option value="I/O-Bound">I/O-Bound (Disk/Network)</option>
                <option value="Mixed">Mixed (Balanced I/O & Compute)</option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-aegis-border flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={Send}
            >
              {isEditing ? 'Save Changes' : 'Enqueue Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;

