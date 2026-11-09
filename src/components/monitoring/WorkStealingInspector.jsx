import React, { useState } from 'react';
import { Layers, ArrowRightLeft, ShieldAlert, Cpu, CheckCircle, RefreshCw, Terminal } from 'lucide-react';
import Card from '../common/Card';
import { cn } from '../../utils/classNames';

// Realistic mock thread deques
const INITIAL_WORKER_DEQUES = [
  { threadId: 'TH-00', coreId: 0, state: 'ACTIVE', tasks: ['T-1042', 'T-1065', 'T-1070'], stealsPerformed: 18, stealsSuffered: 4 },
  { threadId: 'TH-01', coreId: 1, state: 'ACTIVE', tasks: ['T-1049', 'T-1068'], stealsPerformed: 24, stealsSuffered: 9 },
  { threadId: 'TH-02', coreId: 2, state: 'ACTIVE', tasks: ['T-1053'], stealsPerformed: 12, stealsSuffered: 2 },
  { threadId: 'TH-03', coreId: 3, state: 'ACTIVE', tasks: ['T-1055', 'T-1071', 'T-1074', 'T-1078'], stealsPerformed: 31, stealsSuffered: 15 },
  { threadId: 'TH-04', coreId: 4, state: 'IDLE', tasks: [], stealsPerformed: 7, stealsSuffered: 0 },
  { threadId: 'TH-05', coreId: 5, state: 'STEALING', tasks: [], stealsPerformed: 9, stealsSuffered: 0 },
  { threadId: 'TH-06', coreId: 6, state: 'ACTIVE', tasks: ['T-1061', 'T-1077'], stealsPerformed: 14, stealsSuffered: 6 },
  { threadId: 'TH-07', coreId: 7, state: 'ACTIVE', tasks: ['T-1063'], stealsPerformed: 11, stealsSuffered: 3 },
];

const INITIAL_STEAL_LOGS = [
  { id: 1, time: '08:31:02', thief: 'TH-05', victim: 'TH-03', taskId: 'T-1074', status: 'SUCCESS' },
  { id: 2, time: '08:30:58', thief: 'TH-04', victim: 'TH-00', taskId: 'T-1070', status: 'SUCCESS' },
  { id: 3, time: '08:30:51', thief: 'TH-05', victim: 'TH-02', taskId: null, status: 'EMPTY_DEQUE' },
  { id: 4, time: '08:30:44', thief: 'TH-07', victim: 'TH-01', taskId: 'T-1068', status: 'SUCCESS' },
  { id: 5, time: '08:30:35', thief: 'TH-02', victim: 'TH-03', taskId: 'T-1071', status: 'SUCCESS' },
];

export function WorkStealingInspector() {
  const [deques, setDeques] = useState(INITIAL_WORKER_DEQUES);
  const [logs, setLogs] = useState(INITIAL_STEAL_LOGS);
  const [isSimulatingSteal, setIsSimulatingSteal] = useState(false);

  // Trigger simulated work-steal event
  const triggerStealEvent = () => {
    setIsSimulatingSteal(true);
    setTimeout(() => {
      // Find a thread with more than 1 task
      const victim = deques.find((d) => d.tasks.length > 1) || deques[0];
      const thief = deques.find((d) => d.tasks.length === 0) || deques[4];

      if (victim && thief && victim.tasks.length > 0) {
        const stolenTask = victim.tasks[victim.tasks.length - 1];
        
        setDeques((prev) =>
          prev.map((d) => {
            if (d.threadId === victim.threadId) {
              return {
                ...d,
                tasks: d.tasks.slice(0, -1),
                stealsSuffered: d.stealsSuffered + 1,
              };
            }
            if (d.threadId === thief.threadId) {
              return {
                ...d,
                state: 'ACTIVE',
                tasks: [stolenTask],
                stealsPerformed: d.stealsPerformed + 1,
              };
            }
            return d;
          })
        );

        const newLog = {
          id: Date.now(),
          time: new Date().toLocaleTimeString().split(' ')[0],
          thief: thief.threadId,
          victim: victim.threadId,
          taskId: stolenTask,
          status: 'SUCCESS',
        };

        setLogs((prev) => [newLog, ...prev.slice(0, 7)]);
      }
      setIsSimulatingSteal(false);
    }, 400);
  };

  const totalSteals = deques.reduce((acc, d) => acc + d.stealsPerformed, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 2-Columns: Work Stealing Thread Deques */}
      <div className="lg:col-span-2">
        <Card
          title="Chase-Lev Lock-Free Work-Stealing Deque Pool"
          subtitle="Dual-ended queues: threads pop LIFO from bottom, idle threads steal FIFO from top"
          icon={Layers}
          actions={
            <button
              onClick={triggerStealEvent}
              disabled={isSimulatingSteal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-aegis-teal/10 hover:bg-aegis-teal/20 text-aegis-teal border border-aegis-teal/30 text-xs font-terminal font-semibold transition-all active:scale-95 disabled:opacity-50"
            >
              <ArrowRightLeft className={cn('w-3.5 h-3.5', isSimulatingSteal && 'animate-spin')} />
              <span>Simulate Steal Probe</span>
            </button>
          }
        >
          {/* Summary KPIs */}
          <div className="grid grid-cols-4 gap-3 mb-4 p-3 rounded-xl bg-aegis-sidebar/80 border border-aegis-border text-xs font-terminal">
            <div>
              <span className="text-[10px] text-aegis-subtle block">TOTAL STEALS</span>
              <span className="text-white font-bold text-sm">{totalSteals}</span>
            </div>
            <div>
              <span className="text-[10px] text-aegis-subtle block">SUCCESS RATE</span>
              <span className="text-aegis-teal font-bold text-sm">94.8%</span>
            </div>
            <div>
              <span className="text-[10px] text-aegis-subtle block">CAS CONTENTION</span>
              <span className="text-aegis-indigo font-bold text-sm">0.32 μs</span>
            </div>
            <div>
              <span className="text-[10px] text-aegis-subtle block">DEQUE SLOTS</span>
              <span className="text-status-emerald font-bold text-sm">64 per Core</span>
            </div>
          </div>

          {/* 8 Worker Thread Deques */}
          <div className="space-y-2.5">
            {deques.map((deque) => {
              const hasTasks = deque.tasks.length > 0;
              const isStealing = deque.state === 'STEALING';

              return (
                <div
                  key={deque.threadId}
                  className="p-3 rounded-lg bg-aegis-sidebar border border-aegis-border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-terminal"
                >
                  {/* Left: Thread info */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-bold text-white px-2 py-0.5 rounded bg-aegis-card border border-aegis-border">
                      {deque.threadId}
                    </span>
                    <span className="text-aegis-muted text-[11px]">Core {deque.coreId}</span>

                    <span
                      className={cn(
                        'text-[10px] px-2 py-0.5 rounded font-semibold',
                        deque.state === 'ACTIVE'
                          ? 'bg-aegis-teal/10 text-aegis-teal border border-aegis-teal/30'
                          : isStealing
                          ? 'bg-status-amber/10 text-status-amber border border-status-amber/30 animate-pulse'
                          : 'bg-aegis-card text-aegis-subtle border border-aegis-border'
                      )}
                    >
                      {deque.state}
                    </span>
                  </div>

                  {/* Middle: Visual Deque Slots */}
                  <div className="flex-1 flex items-center gap-1.5 overflow-x-auto py-1">
                    <span className="text-[10px] text-aegis-subtle uppercase mr-1">TOP [FIFO] →</span>
                    {hasTasks ? (
                      deque.tasks.map((task, idx) => (
                        <div
                          key={task}
                          className="px-2 py-0.5 rounded bg-aegis-teal/15 text-aegis-teal border border-aegis-teal/40 text-[11px] font-semibold flex items-center gap-1 shadow-sm shrink-0"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-aegis-teal"></span>
                          <span>{task}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-aegis-subtle text-[11px] italic">Empty deque (searching victim...)</span>
                    )}
                    <span className="text-[10px] text-aegis-subtle uppercase ml-1">← BOTTOM [LIFO]</span>
                  </div>

                  {/* Right: Steal metrics */}
                  <div className="flex items-center gap-3 text-[11px] text-aegis-muted shrink-0">
                    <span>
                      Stole: <strong className="text-white">{deque.stealsPerformed}</strong>
                    </span>
                    <span>
                      Suffered: <strong className="text-white">{deque.stealsSuffered}</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* 1-Column: Live Steal Event Stream */}
      <div>
        <Card
          title="Live Work-Stealing Audit Feed"
          subtitle="Inter-thread task migrations & victim probe events"
          icon={Terminal}
        >
          <div className="space-y-2.5 font-terminal text-xs">
            {logs.map((log) => {
              const isSuccess = log.status === 'SUCCESS';
              return (
                <div
                  key={log.id}
                  className="p-3 rounded-lg bg-aegis-sidebar border border-aegis-border hover:border-aegis-border-light transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-aegis-subtle text-[10px]">{log.time}</span>
                    <span
                      className={cn(
                        'text-[10px] px-1.5 py-0.5 rounded font-semibold',
                        isSuccess
                          ? 'bg-status-emerald/10 text-status-emerald border border-status-emerald/30'
                          : 'bg-status-amber/10 text-status-amber border border-status-amber/30'
                      )}
                    >
                      {log.status}
                    </span>
                  </div>

                  <p className="text-xs text-white leading-relaxed">
                    <span className="text-aegis-teal font-semibold">{log.thief}</span>{' '}
                    {isSuccess ? (
                      <>
                        stole <span className="text-white font-bold px-1 rounded bg-aegis-card">{log.taskId}</span> from{' '}
                        <span className="text-aegis-indigo font-semibold">{log.victim}</span>
                      </>
                    ) : (
                      <>
                        probed <span className="text-aegis-indigo font-semibold">{log.victim}</span> (empty deque)
                      </>
                    )}
                  </p>

                  <div className="text-[10px] text-aegis-muted">
                    Overhead: <span className="text-aegis-teal">0.28 μs</span> atomic CAS
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default WorkStealingInspector;

