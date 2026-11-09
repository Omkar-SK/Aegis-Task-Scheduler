# Aegis — Adaptive Multithreaded Task Scheduler

[![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4.17-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-2.15.0-22c55e)](https://recharts.org/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

> An advanced CPU scheduling simulation, comparative benchmarking, and native C++ POSIX thread monitoring platform built for modern operating systems engineering and real-time task orchestration.

---

## 📌 Overview

**Aegis** is an industrial-grade operating systems simulator and performance analysis suite. It provides a visual and analytical window into CPU scheduling algorithms, multi-core SMP thread states, starvation mechanics, and adaptive priority escalation.

Beyond classical algorithms (FCFS, Non-preemptive/Preemptive SJF, Round Robin), Aegis introduces the **Aegis Adaptive Scheduling Algorithm**—a dynamic multi-factor priority policy designed to balance deadline adherence, starvation prevention, and burst-time fairness.

---

## 🚀 Key Modules & Capabilities

### 1. 📊 Scheduling Overview Dashboard
- High-level telemetry of system health, active algorithm, and execution status.
- Reusable glassmorphism metric cards: **Total Tasks**, **Completed Tasks**, **Average Waiting Time**, **CPU Utilization**, **Deadline Miss Rate**, and **Context Switches**.
- Real-time Recharts visualizations: CPU utilization timelines, task status distribution donut charts, and comparative waiting vs. turnaround time grouped bars.
- Live recent activity and currently running thread badges.

### 2. 📋 Interactive Task Manager
- Complete CRUD capabilities for task definitions with live schema validation.
- Parameters: `Task ID`, `Name`, `Arrival Time`, `Burst Time`, `Deadline`, `Base Priority`, and `Status`.
- One-click workload presets:
  - **Balanced Workload**: Standard mix of short, medium, and long tasks.
  - **CPU-Intensive Workload**: High burst-time computational batch jobs.
  - **Deadline-Intensive Workload**: Tight real-time deadlines requiring rapid dispatch.
  - **Starvation Demonstration Workload**: Low-priority long tasks competing with high-frequency short jobs.
- Full JSON workload import and export with clipboard inspection.

### 3. ⏱️ Cycle-Accurate Gantt Timeline Simulator
- Horizontal timeline displaying scheduled blocks, per-task color accents, and execution start/end stamps.
- Context-switch overhead indicators and CPU idle-block representation.
- Playback controls: **Start**, **Pause**, **Resume**, **Step Forward**, and **Reset**.
- Variable clock speeds: `0.5x`, `1x`, `2x`, and `4x`.
- Live Execution Panel displaying the Ready Queue, Running Task, Completed Tasks list, and Remaining Workload.

### 4. 🎯 Aegis Adaptive Priority Inspector
- Deep-dive visualization of the custom Aegis dynamic priority equation:
  $$\text{Priority} = w_{\text{deadline}} \cdot \text{Urgency} + w_{\text{wait}} \cdot \text{WaitingScore} + w_{\text{cpu}} \cdot (1 - \text{CPUScore})$$
- Real-time normalization of configurable factor weights ($w_1 + w_2 + w_3 = 1.0$).
- Dynamic starvation alerts when tasks wait beyond configurable thresholds ($T_{\text{wait}} \ge 12$).
- Deadline proximity warnings with countdown timers.

### 5. ⚖️ Multi-Algorithm Comparative Benchmark
- Direct side-by-side execution of **FCFS**, **SJF**, **Round Robin (configurable quantum)**, and **Aegis Adaptive** under identical input workloads.
- Evaluates 7 core metrics:
  - Average Waiting Time ($W_{\text{avg}}$)
  - Average Turnaround Time ($T_{\text{avg}}$)
  - Average Response Time ($R_{\text{avg}}$)
  - CPU Utilization ($\%$)
  - Throughput (tasks/sec)
  - Context Switch Count ($CS$)
  - Deadline Miss Rate ($\%$)
- Grouped charts and automated "Best Algorithm" badges for each metric.

### 6. 🧵 SMP Multi-Core & Thread Monitor
- Visualizes 4 Symmetric Multiprocessing (SMP) CPU Cores (`Core 0` – `Core 3`).
- Chase-Lev work-stealing ready deques with per-thread capacity indicators.
- Thread state taxonomy: `RUNNING`, `READY`, `BLOCKED`, `IDLE`.
- Distinguishes simulated front-end states from native C++ `pthread_t` worker pools.
- Live stream of kernel-level scheduling events (Dispatch, Preempt, Complete, Priority Boost).

### 7. 📑 Analytical Reports & OS Lab Audits
- 8 automated diagnostic sections: Overall Summary, Waiting Time Analysis, Turnaround Analysis, Deadline Miss Analysis, CPU Utilization, Context-Switch Overhead, and Starvation Detection.
- Rule-based **Performance Insights Engine** generating empirical observations directly from execution data.
- One-click exports:
  - Performance Metrics (`CSV`)
  - Execution Timeline & Schedule (`CSV`)
  - Full Diagnostic Report (`TXT`)
  - Printable OS Lab Audit Report Modal

### 8. 🔌 Backend Architecture & WebSocket Service Layer
- Clean API service abstraction layer in `src/services/`:
  - `contracts.js`: JSDoc type contracts for Task, ExecutionEvent, SchedulerState, GanttTimeline, ComparisonResult, PriorityUpdate, and ThreadInfo.
  - `mockApiAdapter.js`: Full asynchronous mock implementation with realistic network latencies.
  - `api.js`: Environment-aware REST dispatch (supports native C++ daemon `http://localhost:8080`).
  - `websocketService.js`: Resilient WebSocket client (`ws://localhost:8080/ws/scheduler`) with automatic reconnect, ping-pong heartbeat, and mock fallback event stream.

---

## 🛠️ Tech Stack

- **Framework**: React 18 (ESM)
- **Bundler**: Vite 6
- **Styling**: Tailwind CSS, PostCSS, Lucide Icons
- **Data Visualization**: Recharts (LineChart, BarChart, PieChart/Donut, ResponsiveContainer)
- **Routing**: React Router DOM v6
- **Architecture**: Modular service-oriented architecture with decoupled presentation and scheduling logic

---

## 📁 Project Structure

```
aegis-task-scheduler/
├── public/
│   ├── favicon.svg             # Application logo
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── common/             # Reusable UI (MetricCard, Modal, StateDisplay, Badges)
│   │   ├── layout/             # Sidebar, Navbar, PageLayout, Shell
│   │   ├── simulator/          # GanttChart, PriorityInspector, LiveExecutionPanel
│   │   ├── tasks/              # TaskModal, TaskTable, TaskFilters, WorkloadPresets
│   │   ├── comparison/         # AlgorithmComparisonTable, MetricBarCharts
│   │   └── monitoring/         # ThreadCard, CoreTopologyVisualizer, EventLogTable
│   ├── data/
│   │   ├── mockTasks.js        # Default task sets and workload presets
│   │   └── mockSimulationData.js # Deterministic fallback execution events
│   ├── pages/
│   │   ├── OverviewPage.jsx    # System overview & telemetry
│   │   ├── TaskManagerPage.jsx # Task CRUD & preset manager
│   │   ├── SimulatorPage.jsx   # Interactive execution Gantt timeline
│   │   ├── ComparisonPage.jsx  # 4-algorithm benchmark engine
│   │   ├── MonitoringPage.jsx  # SMP core & POSIX thread telemetry
│   │   ├── ReportsPage.jsx     # Lab analytics & CSV export
│   │   └── SettingsPage.jsx    # C++ native daemon bridge configuration
│   ├── services/
│   │   ├── contracts.js        # JSDoc TypeScript-style JSON schema definitions
│   │   ├── mockApiAdapter.js   # Client-side mock REST simulation adapter
│   │   ├── api.js              # Centralized REST API routing layer
│   │   ├── taskService.js      # Task CRUD service
│   │   ├── schedulerService.js # Scheduler run, pause, reset, compare service
│   │   └── websocketService.js # WebSocket event stream client
│   ├── utils/
│   │   └── schedulerEngine.js  # Deterministic FCFS, SJF, RR, Aegis simulation engine
│   ├── App.jsx                 # Application routes & layout wrapper
│   ├── main.jsx                # React DOM entry point
│   └── index.css               # Dark theme developer dashboard tokens
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn`

### Installation
```bash
# Clone the repository
git clone https://github.com/Omkar-SK/Aegis-Task-Scheduler.git

# Navigate into the project directory
cd Aegis-Task-Scheduler

# Install dependencies
npm install
```

### Running Locally
```bash
# Start Vite development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production
```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

---

## 🔗 C++ Native Backend Integration (Roadmap)

Aegis is designed to bridge directly with a native C++20 scheduling daemon utilizing POSIX threads (`pthread`), condition variables, and real-time scheduling policies (`SCHED_FIFO` / `SCHED_RR`).

Proposed backend endpoints supported by `src/services/api.js`:
- `POST /api/tasks` — Register tasks in kernel queue
- `GET /api/tasks` — Fetch task set
- `POST /api/scheduler/run` — Spawn worker threads and dispatch
- `POST /api/scheduler/pause` — Signal mutex condition wait
- `POST /api/scheduler/resume` — Broadcast worker wake
- `POST /api/scheduler/reset` — Flush state and join threads
- `POST /api/scheduler/compare` — Benchmark all 4 algorithms concurrently
- `ws://localhost:8080/ws/scheduler` — Real-time execution event telemetry

---

## 👨‍💻 Author

**Omkar Katare**
- GitHub: [@Omkar-SK](https://github.com/Omkar-SK)
- Project: Operating Systems Course Project (VIT Pune)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
