/**
 * C++ Aegis Core Integration Bridge Contracts
 * 
 * This file specifies the expected schema and JSON memory layout for the C++
 * multithreaded scheduler engine.
 * 
 * Supported C++ Micro-frameworks:
 * - Crow (header-only C++ web framework)
 * - Boost.Beast (High-performance asynchronous networking)
 * - oatpp (Zero-dependency C++ web framework)
 * - cpp-httplib (Header-only cross-platform HTTP library)
 * 
 * Recommended C++ Struct Layouts:
 * 
 * struct TaskDescriptor {
 *     std::string id;            // e.g. "T-1042"
 *     std::string name;          // e.g. "matrix_multiply_avx2"
 *     int priority;              // 1 (lowest) to 10 (realtime)
 *     std::string type;          // "CPU-Bound" | "I/O-Bound" | "Mixed"
 *     std::string state;         // "ready" | "running" | "waiting" | "completed"
 *     int assigned_core;         // -1 if unassigned, else 0..N-1
 *     uint32_t burst_time_ms;
 *     uint32_t remaining_time_ms;
 *     uint32_t wait_time_ms;
 *     uint32_t memory_kb;
 *     double vruntime_ms;
 * };
 * 
 * struct CoreTelemetry {
 *     int core_id;
 *     float utilization;         // 0.0 to 100.0
 *     float frequency_ghz;
 *     int temperature_c;
 *     std::string active_task_id;
 *     uint64_t context_switches;
 * };
 * 
 * struct SchedulerSnapshot {
 *     std::string active_algorithm;
 *     bool is_running;
 *     uint64_t uptime_seconds;
 *     float overall_cpu_load;
 *     float throughput_tasks_sec;
 *     uint32_t context_switches_sec;
 *     std::vector<CoreTelemetry> cores;
 *     std::vector<TaskDescriptor> tasks;
 * };
 */

export const CXX_API_ENDPOINTS = {
  HEALTH: '/health',
  STATUS: '/status',
  CORES: '/cores',
  TASKS: '/tasks',
  SUBMIT_TASK: '/tasks',
  KILL_TASK: '/tasks/:id/kill',
  ALGORITHMS: '/algorithms',
  SET_ALGORITHM: '/algorithms/select',
  PAUSE: '/control/pause',
  RESUME: '/control/resume',
  STEP: '/control/step',
  QUANTUM: '/control/quantum',
  METRICS_STREAM_WS: 'ws://localhost:8080/ws/telemetry',
};

export const CXX_PROTOCOL_VERSION = '1.0.0-aegis';

