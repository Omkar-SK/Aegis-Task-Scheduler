import { useState, useEffect, useRef, useCallback } from 'react';

// Initial realistic event sequence
const INITIAL_EVENTS = [
  {
    id: 'evt-1001',
    timestamp: '10:14:01.120',
    type: 'TASK_STARTED',
    taskId: 'T-1042',
    taskName: 'matrix_multiply_avx2',
    threadId: 'TH-00',
    coreId: 0,
    message: 'Task T-1042 dispatched to Worker TH-00 on Core 0 (Quantum: 20ms)',
    metadata: { burstRemaining: 34, priority: 9.2 },
  },
  {
    id: 'evt-1002',
    timestamp: '10:14:01.350',
    type: 'PRIORITY_UPDATED',
    taskId: 'T-1055',
    taskName: 'radix_tree_index_rebalance',
    threadId: 'TH-SCHED',
    coreId: -1,
    message: 'Aegis heuristic recalculation: T-1055 priority boosted to 9.6 (Deadline urgency: 0.88)',
    metadata: { urgency: 0.88, waitScore: 0.65, cpuScore: 0.2 },
  },
  {
    id: 'evt-1003',
    timestamp: '10:14:01.680',
    type: 'CONTEXT_SWITCH',
    taskId: 'T-1049',
    taskName: 'crypto_sha256_batch',
    threadId: 'TH-01',
    coreId: 1,
    message: 'Preemption context switch on Core 1: Save TH-01 PCB registers (Overhead: 1.0ms)',
    metadata: { oldTask: 'T-1048', newTask: 'T-1049' },
  },
  {
    id: 'evt-1004',
    timestamp: '10:14:02.040',
    type: 'TASK_PREEMPTED',
    taskId: 'T-1058',
    taskName: 'neural_infer_quantized',
    threadId: 'TH-04',
    coreId: 4,
    message: 'Quantum expired for T-1058 after 20ms execution; moved to tail of Ready Queue',
    metadata: { remainingTime: 40, sliceUsed: 20 },
  },
  {
    id: 'evt-1005',
    timestamp: '10:14:02.410',
    type: 'TASK_COMPLETED',
    taskId: 'T-1039',
    taskName: 'json_schema_validator',
    threadId: 'TH-05',
    coreId: 5,
    message: 'Task T-1039 completed execution in 48ms (Turnaround: 56ms, Met SLA Deadline)',
    metadata: { turnaroundMs: 56, waitMs: 8 },
  },
  {
    id: 'evt-1006',
    timestamp: '10:14:02.950',
    type: 'DEADLINE_MISSED',
    taskId: 'T-1031',
    taskName: 'realtime_sensor_fusion',
    threadId: 'TH-03',
    coreId: 3,
    message: 'CRITICAL: T-1031 breached SLA deadline at 180ms (+12ms overshoot)',
    metadata: { deadline: 180, completion: 192 },
  },
];

const EVENT_POOL = [
  {
    type: 'TASK_STARTED',
    templates: [
      { taskId: 'T-1042', name: 'matrix_multiply_avx2', thread: 'TH-00', core: 0, msg: 'Task T-1042 dispatched to Worker TH-00 on Core 0' },
      { taskId: 'T-1049', name: 'crypto_sha256_batch', thread: 'TH-01', core: 1, msg: 'Task T-1049 dispatched to Worker TH-01 on Core 1' },
      { taskId: 'T-1055', name: 'radix_tree_index_rebalance', thread: 'TH-03', core: 3, msg: 'High priority task T-1055 dispatched to Worker TH-03' },
      { taskId: 'T-1061', name: 'tls_handshake_session', thread: 'TH-06', core: 6, msg: 'Interactive task T-1061 dispatched to Worker TH-06' },
    ],
  },
  {
    type: 'TASK_COMPLETED',
    templates: [
      { taskId: 'T-1042', name: 'matrix_multiply_avx2', thread: 'TH-00', core: 0, msg: 'Task T-1042 burst finished; deallocating thread registers' },
      { taskId: 'T-1053', name: 'page_cache_flush_daemon', thread: 'TH-02', core: 2, msg: 'Task T-1053 I/O burst completed; ready for disk commit' },
      { taskId: 'T-1063', name: 'sqlite_wal_checkpoint', thread: 'TH-07', core: 7, msg: 'Task T-1063 completed in 32ms; turnaround optimal' },
    ],
  },
  {
    type: 'TASK_PREEMPTED',
    templates: [
      { taskId: 'T-1049', name: 'crypto_sha256_batch', thread: 'TH-01', core: 1, msg: 'T-1049 preempted by higher priority task; placed in ready queue' },
      { taskId: 'T-1058', name: 'neural_infer_quantized', thread: 'TH-04', core: 4, msg: 'Time slice quantum expired for T-1058 (re-enqueued at tail)' },
    ],
  },
  {
    type: 'CONTEXT_SWITCH',
    templates: [
      { taskId: 'T-SCHED', name: 'dispatcher', thread: 'TH-SCHED', core: -1, msg: 'Kernel Context Switch on Core 0: TH-00 swapped PCB state (1.0ms)' },
      { taskId: 'T-SCHED', name: 'dispatcher', thread: 'TH-SCHED', core: -1, msg: 'Work-stealing migration: TH-05 stole top task from TH-01 deque' },
    ],
  },
  {
    type: 'PRIORITY_UPDATED',
    templates: [
      { taskId: 'T-1055', name: 'radix_tree_index_rebalance', thread: 'TH-SCHED', core: -1, msg: 'Aegis heuristic: T-1055 priority aged +1.2 due to wait score' },
      { taskId: 'T-1065', name: 'garbage_collector_mark', thread: 'TH-SCHED', core: -1, msg: 'Dynamic boost: T-1065 urgency factor rose to 0.94' },
      { taskId: 'T-1053', name: 'page_cache_flush_daemon', thread: 'TH-SCHED', core: -1, msg: 'Aegis priority updated to 6.8 (I/O credit applied)' },
    ],
  },
  {
    type: 'DEADLINE_MISSED',
    templates: [
      { taskId: 'T-1031', name: 'realtime_sensor_fusion', thread: 'TH-03', core: 3, msg: 'SLA alert: T-1031 deadline exceeded by 8ms' },
    ],
  },
];

/**
 * Custom hook to manage the live execution event stream
 * Prepares the application for WebSocket connection from the native C++ backend.
 */
export function useLiveEventStream({
  wsUrl = 'ws://localhost:8080/ws/scheduler',
  autoStart = true,
  intervalMs = 1200,
} = {}) {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [isStreaming, setIsStreaming] = useState(autoStart);
  const [streamMode, setStreamMode] = useState('MOCK'); // 'MOCK' | 'WEBSOCKET'
  const [wsConnected, setWsConnected] = useState(false);
  const [simTimeMs, setSimTimeMs] = useState(2450);

  const wsRef = useRef(null);
  const timerRef = useRef(null);

  // Helper to format timestamp
  const getNowFormatted = () => {
    const d = new Date();
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    const s = String(d.getSeconds()).padStart(2, '0');
    const ms = String(d.getMilliseconds()).padStart(3, '0');
    return `${h}:${m}:${s}.${ms}`;
  };

  // Add a single event
  const addEvent = useCallback((eventObj) => {
    setEvents((prev) => [
      {
        id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: getNowFormatted(),
        ...eventObj,
      },
      ...prev.slice(0, 99), // retain last 100 events
    ]);
  }, []);

  // WebSocket connection attempt (for future C++ backend integration)
  const connectWebSocket = useCallback(() => {
    try {
      if (wsRef.current) {
        wsRef.current.close();
      }

      const socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      socket.onopen = () => {
        setWsConnected(true);
        setStreamMode('WEBSOCKET');
        addEvent({
          type: 'CONTEXT_SWITCH',
          taskId: 'CXX-CORE',
          taskName: 'daemon_bridge',
          threadId: 'TH-SCHED',
          coreId: -1,
          message: `Connected to native C++ Aegis telemetry stream at ${wsUrl}`,
        });
      };

      socket.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed && parsed.type) {
            addEvent(parsed);
          }
        } catch {
          // ignore malformed ws messages
        }
      };

      socket.onerror = () => {
        setWsConnected(false);
      };

      socket.onclose = () => {
        setWsConnected(false);
        setStreamMode('MOCK');
      };
    } catch {
      setWsConnected(false);
      setStreamMode('MOCK');
    }
  }, [wsUrl, addEvent]);

  // Synthetic Mock Event Generator
  const generateMockEvent = useCallback(() => {
    const poolCategory = EVENT_POOL[Math.floor(Math.random() * EVENT_POOL.length)];
    const template = poolCategory.templates[Math.floor(Math.random() * poolCategory.templates.length)];

    const newEvt = {
      type: poolCategory.type,
      taskId: template.taskId,
      taskName: template.name,
      threadId: template.thread,
      coreId: template.core,
      message: template.msg,
      metadata: {
        clockTick: simTimeMs,
        simulated: true,
      },
    };

    addEvent(newEvt);
    setSimTimeMs((t) => t + Math.floor(Math.random() * 40 + 10));
  }, [simTimeMs, addEvent]);

  // Timer loop for mock streaming
  useEffect(() => {
    if (isStreaming && streamMode === 'MOCK') {
      timerRef.current = setInterval(generateMockEvent, intervalMs);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isStreaming, streamMode, intervalMs, generateMockEvent]);

  const pauseStream = useCallback(() => setIsStreaming(false), []);
  const resumeStream = useCallback(() => setIsStreaming(true), []);
  const clearEvents = useCallback(() => setEvents([]), []);

  return {
    events,
    isStreaming,
    streamMode,
    wsConnected,
    simTimeMs,
    pauseStream,
    resumeStream,
    clearEvents,
    addEvent,
    connectWebSocket,
    setStreamMode,
  };
}

export default useLiveEventStream;

