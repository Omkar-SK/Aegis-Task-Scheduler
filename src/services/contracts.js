/**
 * Aegis Core Integration Contracts & JSON Schemas
 * 
 * Formal TypeScript-style JSDoc documentation defining the communication
 * contracts between the React frontend and the C++ multithreaded scheduler engine.
 * 
 * Supported Transport Protocols:
 * - REST HTTP (application/json)
 * - WebSocket Stream (ws://localhost:8080/ws/scheduler)
 */

// ============================================================================
// 1. TASK CREATION CONTRACT
// ============================================================================

/**
 * @typedef {Object} TaskCreationPayload
 * @property {string} name - Human-readable process/thread identifier (e.g., "matrix_multiply_avx2")
 * @property {number} arrivalTime - Logical arrival timestamp in milliseconds (>= 0)
 * @property {number} burstTime - Total CPU burst execution time in milliseconds (> 0)
 * @property {number} [deadline] - Hard/soft deadline timestamp in milliseconds (optional, default: arrival + 2*burst)
 * @property {number} [priority=5] - Base static priority tier (1 = lowest background, 10 = real-time critical)
 * @property {'CPU-Bound' | 'I/O-Bound' | 'Mixed'} [type='CPU-Bound'] - Microarchitectural workload classification
 * @property {number} [memoryKb=16384] - Peak virtual memory footprint in Kilobytes
 * @property {number} [affinityMask=0] - CPU core affinity bitmask (e.g., 0x01 = Core 0, 0 = any core)
 */

/**
 * @typedef {Object} TaskResponse
 * @property {string} id - Unique kernel task identifier (e.g., "T-1042")
 * @property {string} name - Task name
 * @property {number} arrivalTime - Arrival timestamp in ms
 * @property {number} burstTime - Total burst time in ms
 * @property {number} remainingTime - Remaining unfinished burst duration in ms
 * @property {number} deadline - Target SLA completion timestamp in ms
 * @property {number} priority - Base static priority (1-10)
 * @property {number} dynamicPriority - Runtime calculated Aegis priority score
 * @property {'ready' | 'running' | 'waiting' | 'completed' | 'preempted'} state - Current PCB execution state
 * @property {number|null} assignedCore - Index of executing CPU core (0..N-1), or null if in runqueue
 * @property {string|null} assignedThread - Worker thread ID (e.g., "TH-02"), or null
 * @property {number} waitTimeMs - Accumulated queue latency in ms
 * @property {number} turnaroundTimeMs - Completion latency (finish - arrival) in ms
 * @property {number} progress - Execution progress percentage (0 to 100)
 * @property {number} memoryKb - Resident memory in KB
 * @property {string} createdAt - ISO 8601 creation timestamp
 */

// ============================================================================
// 2. TASK EXECUTION EVENTS CONTRACT
// ============================================================================

/**
 * @typedef {'TASK_STARTED' | 'TASK_COMPLETED' | 'TASK_PREEMPTED' | 'CONTEXT_SWITCH' | 'PRIORITY_UPDATED' | 'DEADLINE_MISSED' | 'STARVATION_ALERT'} ExecutionEventType
 */

/**
 * @typedef {Object} TaskExecutionEvent
 * @property {string} eventId - Unique sequential event identifier (e.g., "evt-10492")
 * @property {ExecutionEventType} type - Execution event classification
 * @property {string} timestamp - High-resolution timestamp string (e.g., "11:58:02.124")
 * @property {number} simTimeMs - Monotonic logical simulation clock in ms
 * @property {string} taskId - Associated task identifier (e.g., "T-1042")
 * @property {string} taskName - Associated task name
 * @property {string} threadId - Worker thread executing the action (e.g., "TH-00" or "TH-SCHED")
 * @property {number} coreId - CPU core index (-1 for master dispatcher, 0..N-1 for worker cores)
 * @property {string} message - Human-readable kernel trace explanation
 * @property {Object} [metadata] - Optional event-specific metadata
 * @property {number} [metadata.burstRemaining] - Remaining burst time in ms
 * @property {number} [metadata.priorityScore] - Composite priority score at event time
 * @property {number} [metadata.quantumUsed] - Time slice quantum consumed in ms
 * @property {number} [metadata.contextSwitchOverhead] - Overhead duration in ms (typically 1.0)
 * @property {number} [metadata.latenessMs] - SLA overshoot delay in ms if deadline missed
 */

// ============================================================================
// 3. SCHEDULER STATE CONTRACT
// ============================================================================

/**
 * @typedef {Object} SchedulerStateSnapshot
 * @property {boolean} isRunning - Whether the scheduler dispatch loop is actively ticking
 * @property {string} activeAlgorithm - Selected scheduling policy ('AEGIS_ADAPTIVE' | 'FCFS' | 'SJF' | 'ROUND_ROBIN')
 * @property {number} simTimeMs - Current logical simulation clock in milliseconds
 * @property {number} timeQuantumMs - Active Round Robin or adaptive time slice quantum in ms
 * @property {number} starvationThresholdMs - Waiting duration before priority boost aging triggers
 * @property {number} overallCpuLoad - System-wide CPU load percentage (0.0 to 100.0)
 * @property {number} userLoad - User space compute load percentage
 * @property {number} systemLoad - Kernel dispatch & context-switch overhead percentage
 * @property {number} throughput - Completed tasks per second
 * @property {number} activeCoresCount - Number of currently busy CPU cores
 * @property {number} totalCoresCount - Total available SMP cores
 * @property {number} readyQueueDepth - Count of tasks currently waiting in ready queues
 * @property {TaskResponse|null} runningTask - Primary executing task descriptor
 * @property {Array<TaskResponse>} tasks - Full array of active PCB descriptors
 * @property {'CXX_CORE' | 'MOCK_ADAPTER'} source - Telemetry origin flag
 * @property {string} protocolVersion - Communication contract version (e.g., "1.0.0-aegis")
 */

// ============================================================================
// 4. GANTT CHART TIMELINE CONTRACT
// ============================================================================

/**
 * @typedef {Object} GanttTimelineSlice
 * @property {number} sliceIndex - Sequential 0-based execution slice index
 * @property {'EXECUTION' | 'CONTEXT_SWITCH' | 'IDLE'} type - Timeline segment type
 * @property {string} taskId - Executed task ID, or 'SYSTEM' for overhead, or 'IDLE'
 * @property {string} taskName - Human-readable label
 * @property {number} startTime - Interval start logical clock timestamp in ms
 * @property {number} endTime - Interval end logical clock timestamp in ms
 * @property {number} duration - Slice duration in ms (endTime - startTime)
 * @property {number} coreId - Executing core index
 * @property {string} threadId - Executing worker thread identifier
 * @property {string} color - Assigned task hex color code (e.g., "#18C6A3")
 * @property {number} [priority] - Dynamic priority score at time of dispatch
 * @property {number} [remainingBurstAfter] - Burst remaining after slice execution
 */

// ============================================================================
// 5. ALGORITHM COMPARISON RESULTS CONTRACT
// ============================================================================

/**
 * @typedef {Object} AlgorithmResult
 * @property {string} id - Algorithm ID ('FCFS' | 'SJF' | 'ROUND_ROBIN' | 'AEGIS_ADAPTIVE')
 * @property {string} name - Full descriptive policy name
 * @property {string} shortName - Abbreviated label
 * @property {string} tag - Scheduling paradigm (e.g., "Preemptive SRTF", "Multi-Factor")
 * @property {number} totalExecutionTime - Total makespan in ms
 * @property {number} avgWaitTime - Mean waiting latency in ready queues (ms)
 * @property {number} avgTurnaroundTime - Mean turnaround latency from arrival to finish (ms)
 * @property {number} avgResponseTime - Mean initial response latency (ms)
 * @property {number} cpuUtilization - Total compute time / makespan percentage
 * @property {number} throughput - Tasks finished per second
 * @property {number} contextSwitches - Total preemption context switches executed
 * @property {number} deadlineMisses - Total tasks breaching SLA deadlines
 */

/**
 * @typedef {Object} AlgorithmComparisonReport
 * @property {string} runId - Unique benchmark run identifier (e.g., "run-balanced-173114")
 * @property {string} workloadName - Evaluated workload preset name
 * @property {number} taskCount - Number of identical input tasks evaluated
 * @property {Array<AlgorithmResult>} results - Comparative benchmark records for all 4 algorithms
 * @property {Object.<string, string>} bestPerformers - Map of metric keys to winning algorithm IDs
 * @property {string} timestamp - ISO timestamp of benchmark completion
 */

// ============================================================================
// 6. ADAPTIVE PRIORITY UPDATES CONTRACT
// ============================================================================

/**
 * @typedef {Object} PriorityFactors
 * @property {number} deadlineUrgency - Normalized slack urgency factor [0.0, 1.0]
 * @property {number} waitingScore - Normalized ready-queue aging factor [0.0, 1.0]
 * @property {number} cpuConsumption - Normalized historical CPU consumption factor [0.0, 1.0]
 */

/**
 * @typedef {Object} AdaptivePriorityUpdate
 * @property {string} taskId - Evaluated task identifier
 * @property {number} compositePriority - Calculated priority score [0.0, 1.0] (or 0-10 scaled)
 * @property {PriorityFactors} factors - Tri-factor normalized breakdown
 * @property {Object} weights - Coefficients applied: { deadline: 0.5, wait: 0.2, cpu: 0.3 }
 * @property {boolean} starvationAlert - True if waiting time exceeded starvation threshold
 * @property {boolean} deadlineAlert - True if remaining slack <= warning threshold
 * @property {string} dominantFactor - Primary driver ('Deadline Urgency' | 'Aging Starvation' | 'Low CPU')
 */

// ============================================================================
// 7. THREAD MONITORING INFORMATION CONTRACT
// ============================================================================

/**
 * @typedef {'RUNNING' | 'IDLE' | 'STEALING' | 'BLOCKED' | 'DISPATCHING'} ThreadExecutionState
 */

/**
 * @typedef {Object} ThreadTelemetry
 * @property {string} threadId - Logical worker thread identifier (e.g., "TH-00" .. "TH-07")
 * @property {string} pthreadId - Hex OS thread descriptor (e.g., "0x7FFF8901")
 * @property {number} coreId - Bound CPU core index (0..7)
 * @property {'Performance' | 'Efficiency'} coreType - Heterogeneous core classification (Golden Cove / Gracemont)
 * @property {ThreadExecutionState} status - Runtime thread status
 * @property {string|null} activeTaskId - Currently executing task ID, or null
 * @property {string} taskName - Active workload label
 * @property {number} contextSwitches - Total context switches performed by this thread
 * @property {number} dequeDepth - Number of queued tasks in this thread's Chase-Lev deque
 * @property {number} stealsPerformed - Work-stealing steals executed
 * @property {number} stealsSuffered - Tasks stolen by other threads
 * @property {number} frequencyGhz - Operating clock frequency in GHz
 * @property {number} temperatureC - Temperature in Celsius
 */

/**
 * @typedef {Object} ThreadMonitoringSnapshot
 * @property {ThreadTelemetry} masterSchedulerThread - Dispatch loop coordinator thread (TH-SCHED)
 * @property {Array<ThreadTelemetry>} workerThreads - Array of 8 worker threads
 * @property {number} activeWorkersCount - Count of currently busy or stealing threads
 * @property {number} idleWorkersCount - Count of sleeping threads
 * @property {'POSIX_PTHREAD' | 'SIMULATED_LOGICAL'} threadModel - Threading implementation mode
 */

export const CONTRACT_VERSION = '1.0.0-aegis';

