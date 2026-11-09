/**
 * CSV & Text Exporter for Aegis Reports
 * 
 * Supports exporting:
 * 1. Metrics summary CSV
 * 2. Task execution timeline trace CSV
 * 3. Individual task metrics CSV
 * 4. Detailed printable/downloadable text audit report
 */

// Helper to download content as a file
function downloadFile(content, fileName, mimeType = 'text/csv;charset=utf-8;') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 1. Export Metrics Summary CSV (Algorithm comparison across all metrics)
 */
export function exportMetricsSummaryCsv(allAlgorithmResults = [], workloadName = 'Balanced Workload') {
  if (!allAlgorithmResults || allAlgorithmResults.length === 0) {
    alert('No algorithm metrics available to export.');
    return;
  }

  const headers = [
    'Algorithm ID',
    'Algorithm Name',
    'Workload Name',
    'Avg Waiting Time (ms)',
    'Avg Turnaround Time (ms)',
    'Avg Response Time (ms)',
    'CPU Utilization (%)',
    'Throughput (tasks/sec)',
    'Context Switches',
    'Deadline Misses',
    'Makespan (ms)',
  ];

  const rows = allAlgorithmResults.map((r) => [
    `"${r.id}"`,
    `"${r.name}"`,
    `"${workloadName}"`,
    r.avgWaitTime ?? 0,
    r.avgTurnaroundTime ?? 0,
    r.avgResponseTime ?? 0,
    r.cpuUtilization ?? 0,
    r.throughput ?? 0,
    r.contextSwitches ?? 0,
    r.deadlineMisses ?? 0,
    r.totalExecutionTime ?? 0,
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
  downloadFile(csvContent, `aegis_metrics_summary_${Date.now()}.csv`);
}

/**
 * 2. Export Task Execution Timeline as CSV (Every single slice)
 */
export function exportExecutionTimelineCsv(timeline = [], algorithmName = 'Aegis Adaptive') {
  if (!timeline || timeline.length === 0) {
    alert('No timeline slices available to export.');
    return;
  }

  const headers = [
    'Slice Index',
    'Slice Type',
    'Start Time (ms)',
    'End Time (ms)',
    'Duration (ms)',
    'Task ID',
    'Task Name',
    'Algorithm',
  ];

  const rows = timeline.map((slice, index) => [
    index + 1,
    `"${slice.type}"`,
    slice.startTime ?? 0,
    slice.endTime ?? 0,
    slice.duration ?? 0,
    `"${slice.taskId || 'SYSTEM'}"`,
    `"${slice.taskName || (slice.type === 'CONTEXT_SWITCH' ? 'Context Switch Overhead' : 'Idle')}"`,
    `"${algorithmName}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
  downloadFile(csvContent, `aegis_timeline_slices_${Date.now()}.csv`);
}

/**
 * 3. Export Task Execution Trace CSV (Per-task metrics)
 */
export function exportExecutionTraceCsv(tasks = [], algorithmName = 'Aegis Adaptive') {
  if (!tasks || tasks.length === 0) {
    alert('No execution trace records available to export.');
    return;
  }

  const headers = [
    'Task ID',
    'Task Name',
    'Arrival Time (ms)',
    'Burst Time (ms)',
    'Finish Time (ms)',
    'Waiting Time (ms)',
    'Turnaround Time (ms)',
    'Penalty Ratio (TAT/Burst)',
    'Response Time (ms)',
    'Deadline (ms)',
    'Missed Deadline',
    'Lateness (ms)',
    'Base Priority',
    'Algorithm',
  ];

  const rows = tasks.map((t) => [
    `"${t.id}"`,
    `"${t.name || 'unnamed_task'}"`,
    t.arrivalTime ?? 0,
    t.burstTime ?? 0,
    t.finishTime ?? 0,
    t.waitingTime ?? 0,
    t.turnaroundTime ?? 0,
    t.penaltyRatio ?? (t.burstTime > 0 ? (t.turnaroundTime / t.burstTime).toFixed(2) : 1),
    t.responseTime ?? t.waitingTime ?? 0,
    t.deadline ?? 'None',
    t.missedDeadline ? 'TRUE' : 'FALSE',
    t.lateness ?? 0,
    t.priority ?? 5,
    `"${algorithmName}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
  downloadFile(csvContent, `aegis_task_trace_${Date.now()}.csv`);
}

/**
 * 4. Download Detailed Audit Report as a structured Text/Markdown document
 */
export function downloadDetailedTextReport(reportData) {
  if (!reportData) return;

  const { preset, selectedAlgorithm, allAlgorithmResults, summary, insights } = reportData;

  const textLines = [
    '================================================================================',
    '           AEGIS MULTITHREADED TASK SCHEDULER — LAB BENCHMARK REPORT             ',
    '================================================================================',
    `Report Generated: ${new Date().toISOString()}`,
    `Workload Name:    ${preset.name} (${preset.id})`,
    `Selected Policy:  ${selectedAlgorithm.name} (${selectedAlgorithm.id})`,
    `Evaluation Target: Operating Systems Course Project (CS3002)`,
    '--------------------------------------------------------------------------------',
    '',
    '1. OVERALL SIMULATION SUMMARY',
    '--------------------------------------------------------------------------------',
    `  Total Tasks Processed:       ${summary.totalTasks}`,
    `  Completed Tasks:             ${summary.completedTasks}`,
    `  Total Execution Time:        ${summary.totalExecutionTime} ms`,
    `  Throughput:                  ${summary.throughput} tasks/sec`,
    `  Mean Waiting Time:           ${summary.avgWaitTime} ms`,
    `  Mean Turnaround Time:        ${summary.avgTurnaroundTime} ms`,
    `  Total Context Switches:      ${summary.contextSwitchCount}`,
    `  Context Switch Overhead:     ${summary.totalCsDuration} ms (${summary.csOverheadPct}% of CPU time)`,
    `  Effective CPU Utilization:   ${summary.effectiveCpuUtilPct}%`,
    `  Idle CPU Time:               ${summary.idleTimeMs} ms (${summary.idlePct}%)`,
    `  Deadline Compliance:         ${summary.deadlineCompliancePct}% (${summary.deadlinesMet}/${summary.deadlineCount} Met, ${summary.deadlineMissesCount} Missed)`,
    `  Starvation Incidents:        ${summary.starvationIncidents} (Threshold: ${summary.starvationThresholdMs} ms)`,
    '',
    '2. ALGORITHM-WISE COMPARATIVE BENCHMARK',
    '--------------------------------------------------------------------------------',
    'Algo ID | Algorithm Name         | Avg Wait | Avg TAT | CPU Util | Throughput | CS  | Misses',
    '--------|------------------------|----------|---------|----------|------------|-----|-------',
    ...allAlgorithmResults.map(
      (r) =>
        `${r.id.padEnd(7)} | ${r.name.padEnd(22)} | ${(r.avgWaitTime + ' ms').padEnd(8)} | ${(r.avgTurnaroundTime + ' ms').padEnd(7)} | ${(r.cpuUtilization + '%').padEnd(8)} | ${(r.throughput + ' T/s').padEnd(10)} | ${String(r.contextSwitches).padEnd(3)} | ${r.deadlineMisses}`
    ),
    '',
    '3. DATA-SUPPORTED PERFORMANCE INSIGHTS',
    '--------------------------------------------------------------------------------',
    ...insights.map((ins, i) => `  [${i + 1}] [${ins.category}] ${ins.title}\n      ${ins.statement}\n`),
    '',
    '4. DETAILED TASK AUDIT TRACE',
    '--------------------------------------------------------------------------------',
    'PID     | Task Name               | Burst | Wait  | TAT   | Penalty | Deadline | Missed',
    '--------|-------------------------|-------|-------|-------|---------|----------|-------',
    ...reportData.taskList.map(
      (t) =>
        `${t.id.padEnd(7)} | ${t.name.padEnd(23)} | ${(t.burstTime + 'ms').padEnd(5)} | ${(t.waitingTime + 'ms').padEnd(5)} | ${(t.turnaroundTime + 'ms').padEnd(5)} | ${(t.penaltyRatio + 'x').padEnd(7)} | ${String(t.deadline).padEnd(8)} | ${t.missedDeadline ? 'YES' : 'NO'}`
    ),
    '',
    '================================================================================',
    '                            END OF AUDIT REPORT                                 ',
    '================================================================================',
  ];

  const content = textLines.join('\r\n');
  downloadFile(content, `aegis_audit_report_${preset.id}_${Date.now()}.txt`, 'text/plain;charset=utf-8;');
}
