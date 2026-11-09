import React, { useRef, useState } from 'react';
import { Download, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import Button from '../common/Button';

export function TaskImportExport({ tasks = [], onImportSuccess }) {
  const fileInputRef = useRef(null);
  const [importMessage, setImportMessage] = useState(null);

  // Export tasks as JSON
  const handleExport = () => {
    const jsonStr = JSON.stringify(tasks, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aegis_tasks_workload_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import tasks from JSON
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (!Array.isArray(parsed)) {
          throw new Error('Imported JSON root must be an array of task objects.');
        }

        // Validate each item
        const validTasks = parsed.map((item, idx) => {
          if (!item.name) {
            throw new Error(`Task at index ${idx} is missing a "name" property.`);
          }
          return {
            id: item.id || `T-${2000 + idx}`,
            name: String(item.name).trim(),
            arrivalTime: Number(item.arrivalTime ?? 0),
            burstTimeMs: Number(item.burstTimeMs ?? 50),
            deadline: Number(item.deadline ?? 150),
            priority: Math.min(10, Math.max(1, Number(item.priority ?? 5))),
            state: item.state || 'ready',
            type: item.type || 'CPU-Bound',
            remainingTimeMs: Number(item.remainingTimeMs ?? item.burstTimeMs ?? 50),
            memoryKb: Number(item.memoryKb ?? 16384),
            waitTimeMs: Number(item.waitTimeMs ?? 0),
          };
        });

        onImportSuccess(validTasks);
        setImportMessage({ type: 'success', text: `Successfully imported ${validTasks.length} tasks!` });
        setTimeout(() => setImportMessage(null), 4000);
      } catch (err) {
        setImportMessage({ type: 'error', text: `Import failed: ${err.message}` });
        setTimeout(() => setImportMessage(null), 5000);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

      <Button
        variant="outline"
        size="sm"
        icon={Upload}
        onClick={() => fileInputRef.current?.click()}
      >
        Import JSON
      </Button>

      <Button
        variant="secondary"
        size="sm"
        icon={Download}
        onClick={handleExport}
      >
        Export JSON
      </Button>

      {importMessage && (
        <div
          className={`fixed bottom-12 right-6 z-50 px-4 py-2.5 rounded-xl border text-xs font-terminal shadow-2xl flex items-center gap-2 animate-fade-in ${
            importMessage.type === 'success'
              ? 'bg-aegis-card border-status-emerald text-status-emerald'
              : 'bg-aegis-card border-status-rose text-status-rose'
          }`}
        >
          {importMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{importMessage.text}</span>
        </div>
      )}
    </div>
  );
}

export default TaskImportExport;

