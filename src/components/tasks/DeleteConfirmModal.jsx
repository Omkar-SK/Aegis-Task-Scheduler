import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import Button from '../common/Button';

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, task }) {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-xl border border-status-rose/40 bg-aegis-card p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-status-rose/10 border border-status-rose/30 text-status-rose shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-white tracking-tight">
              Destroy Process Control Block?
            </h3>
            <p className="text-xs text-aegis-muted mt-1 leading-relaxed">
              Are you sure you want to terminate and remove task <strong className="text-white font-terminal">{task.id}</strong> (<span className="text-aegis-teal">{task.name}</span>) from the scheduler queue?
            </p>
            <div className="mt-3 p-2.5 rounded-lg bg-aegis-bg border border-aegis-border font-terminal text-[11px] text-aegis-subtle">
              <span>Status: <strong className="text-white uppercase">{task.state}</strong></span>
              <span className="mx-2">|</span>
              <span>Burst: {task.burstTimeMs}ms</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-aegis-border">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={() => {
              onConfirm(task.id);
              onClose();
            }}
          >
            Confirm Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;

