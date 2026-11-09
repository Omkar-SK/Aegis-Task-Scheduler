import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Activity,
  Radio,
  Sparkles,
  Play,
  Pause,
  RefreshCw,
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import CpuStatusSection from '../../components/monitoring/CpuStatusSection';
import ThreadMonitorSection from '../../components/monitoring/ThreadMonitorSection';
import ReadyQueueSection from '../../components/monitoring/ReadyQueueSection';
import TaskMonitorSection from '../../components/monitoring/TaskMonitorSection';
import PriorityMonitorSection from '../../components/monitoring/PriorityMonitorSection';
import ExecutionEventLogSection from '../../components/monitoring/ExecutionEventLogSection';
import useLiveEventStream from '../../hooks/useLiveEventStream';
import { cn } from '../../utils/classNames';

export function LiveMonitoringPage() {
  const { metrics, cores, tasks, history, sourceMode } = useOutletContext();
  const [samplingRateMs, setSamplingRateMs] = useState(1000);
  const [loadSpikeActive, setLoadSpikeActive] = useState(false);

  // Hook managing live execution event streams and future WebSocket telemetry
  const {
    events,
    isStreaming,
    streamMode,
    wsConnected,
    simTimeMs,
    pauseStream,
    resumeStream,
    clearEvents,
    connectWebSocket,
  } = useLiveEventStream({
    autoStart: true,
    intervalMs: samplingRateMs,
  });

  const handleToggleStreaming = () => {
    if (isStreaming) {
      pauseStream();
    } else {
      resumeStream();
    }
  };

  // Trigger synthetic load spike
  const handleSyntheticLoadSpike = () => {
    setLoadSpikeActive(true);
    setTimeout(() => {
      setLoadSpikeActive(false);
    }, 3000);
  };

  // Compute dynamic task subsets
  const runningTasks = tasks.filter((t) => t.state === 'running');
  const readyTasks = tasks.filter((t) => t.state === 'ready');
  const primaryRunningTask = runningTasks[0] || null;

  // Determine if backend is native C++
  const isNativeBackend = sourceMode === 'CXX_CORE' || wsConnected;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Page Header with Real-Time Controls */}
      <PageHeader
        title="Live Monitoring & Telemetry"
        breadcrumbs={[{ label: 'Aegis', to: '/' }, { label: 'Live Monitoring' }]}
        subtitle="Real-time scheduler state, POSIX worker thread pool, ready queue latencies, and streaming execution event trace."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {/* Sampling Rate Selector */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-aegis-card border border-aegis-border text-xs font-terminal">
              <span className="text-aegis-muted">Sampling:</span>
              {[250, 500, 1000].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setSamplingRateMs(rate)}
                  className={cn(
                    'px-2 py-0.5 rounded text-[11px] font-semibold transition-colors',
                    samplingRateMs === rate
                      ? 'bg-aegis-teal text-aegis-bg font-bold'
                      : 'text-aegis-subtle hover:text-white'
                  )}
                >
                  {rate}ms
                </button>
              ))}
            </div>

            {/* Synthetic Load Spike */}
            <button
              onClick={handleSyntheticLoadSpike}
              disabled={loadSpikeActive}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-terminal font-semibold transition-all border shadow-sm active:scale-95',
                loadSpikeActive
                  ? 'bg-status-amber/20 text-status-amber border-status-amber/40 animate-pulse'
                  : 'bg-aegis-card hover:bg-aegis-sidebar text-white border-aegis-border'
              )}
            >
              <Sparkles className="w-3.5 h-3.5 text-status-amber" />
              <span>{loadSpikeActive ? 'Load Spiking...' : 'Inject Load Spike'}</span>
            </button>

            {/* Stream Active Toggle */}
            <button
              onClick={handleToggleStreaming}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-terminal font-semibold transition-all border shadow-sm',
                isStreaming
                  ? 'bg-aegis-teal/10 text-aegis-teal border-aegis-teal/30 hover:bg-aegis-teal/20'
                  : 'bg-status-amber/10 text-status-amber border-status-amber/30 hover:bg-status-amber/20'
              )}
            >
              {isStreaming ? (
                <>
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>Stream Active</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Stream Paused</span>
                </>
              )}
            </button>
          </div>
        }
      />

      {/* 1. CPU STATUS SECTION */}
      <CpuStatusSection
        metrics={
          loadSpikeActive
            ? { ...metrics, overallCpuLoad: Math.min(98, (metrics?.overallCpuLoad || 68) + 25) }
            : metrics
        }
        runningTask={primaryRunningTask}
        simTimeMs={simTimeMs}
        schedulerStatus={isStreaming ? 'RUNNING' : 'PAUSED'}
        activeAlgorithm="Aegis Adaptive Scheduling"
      />

      {/* 2. THREAD MONITOR SECTION */}
      <ThreadMonitorSection
        isNativeBackend={isNativeBackend}
      />

      {/* 3. READY QUEUE SECTION */}
      <ReadyQueueSection
        readyTasks={readyTasks}
      />

      {/* 4. TASK MONITOR SECTION */}
      <TaskMonitorSection
        tasks={tasks}
      />

      {/* 5. PRIORITY MONITOR SECTION */}
      <PriorityMonitorSection
        tasks={tasks.filter((t) => t.state === 'ready' || t.state === 'running')}
        currentTime={simTimeMs}
      />

      {/* 6. EXECUTION EVENT LOG SECTION */}
      <ExecutionEventLogSection
        events={events}
        isStreaming={isStreaming}
        streamMode={streamMode}
        wsConnected={wsConnected}
        onToggleStreaming={handleToggleStreaming}
        onClearEvents={clearEvents}
        onConnectWebSocket={connectWebSocket}
      />
    </div>
  );
}

export default LiveMonitoringPage;
