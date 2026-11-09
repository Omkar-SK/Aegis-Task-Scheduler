import React, { useRef, useEffect, useState } from 'react';
import { Clock, ZoomIn, ZoomOut, Zap, Activity } from 'lucide-react';
import Card from '../common/Card';
import { formatDuration } from '../../utils/formatters';

export function GanttChart({
  timeline = [],
  currentTime = 0,
  totalExecutionTime = 100,
  runningTaskId = null,
}) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(4); // pixels per ms
  const [autoScroll, setAutoScroll] = useState(true);

  // Auto-scroll timeline to follow current playhead during simulation playback
  useEffect(() => {
    if (autoScroll && containerRef.current) {
      const playheadX = currentTime * scale;
      const containerWidth = containerRef.current.clientWidth;
      const currentScroll = containerRef.current.scrollLeft;

      if (playheadX > currentScroll + containerWidth - 100 || playheadX < currentScroll) {
        containerRef.current.scrollTo({
          left: Math.max(0, playheadX - 100),
          behavior: 'smooth',
        });
      }
    }
  }, [currentTime, scale, autoScroll]);

  // Generate tick markers for time axis (every 10ms or 20ms)
  const maxTime = Math.max(totalExecutionTime + 20, currentTime + 30, 100);
  const tickInterval = scale <= 2.5 ? 20 : 10;
  const ticks = [];
  for (let t = 0; t <= maxTime; t += tickInterval) {
    ticks.push(t);
  }

  const timelineWidth = Math.max(maxTime * scale, 800);

  return (
    <Card
      title="Horizontal CPU Execution Timeline (Gantt Chart)"
      subtitle="Visual cycle-accurate trace of scheduled time slices, context switches, and core execution"
      icon={Clock}
      actions={
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-aegis-sidebar border border-aegis-border rounded-lg p-0.5">
            <button
              onClick={() => setScale((s) => Math.max(2, s - 1))}
              className="p-1 text-aegis-muted hover:text-white rounded hover:bg-aegis-card"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-terminal text-aegis-muted px-1.5">{scale}x</span>
            <button
              onClick={() => setScale((s) => Math.min(8, s + 1))}
              className="p-1 text-aegis-muted hover:text-white rounded hover:bg-aegis-card"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Auto-scroll toggle */}
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`px-2 py-1 rounded-lg text-[10px] font-terminal border transition-colors ${
              autoScroll
                ? 'bg-aegis-teal/10 text-aegis-teal border-aegis-teal/40'
                : 'bg-aegis-sidebar text-aegis-muted border-aegis-border'
            }`}
          >
            Auto-Follow: {autoScroll ? 'ON' : 'OFF'}
          </button>
        </div>
      }
    >
      <div className="space-y-3 select-none">
        {/* Timeline Scroll Container */}
        <div
          ref={containerRef}
          className="relative overflow-x-auto rounded-lg border border-aegis-border bg-aegis-bg p-3 pt-6 pb-2"
          style={{ minHeight: '170px' }}
        >
          <div className="relative" style={{ width: `${timelineWidth}px`, height: '110px' }}>
            {/* Background Grid Ticks */}
            {ticks.map((t) => (
              <div
                key={`grid-${t}`}
                className="absolute top-0 bottom-6 border-l border-aegis-border/40 pointer-events-none"
                style={{ left: `${t * scale}px` }}
              />
            ))}

            {/* Execution Blocks */}
            <div className="absolute top-2 left-0 right-0 h-16 flex items-center">
              {timeline.map((slice) => {
                const left = slice.startTime * scale;
                const width = Math.max(4, slice.duration * scale);
                const isCurrentActive =
                  slice.type === 'EXECUTION' &&
                  currentTime >= slice.startTime &&
                  currentTime < slice.endTime;

                if (slice.type === 'CONTEXT_SWITCH') {
                  return (
                    <div
                      key={slice.id}
                      className="absolute top-2 h-12 flex flex-col items-center justify-center rounded border border-status-rose/40 bg-status-rose/10 z-10 overflow-hidden cursor-help group"
                      style={{
                        left: `${left}px`,
                        width: `${Math.max(12, width)}px`,
                      }}
                      title={`Context Switch Overhead: ${slice.duration}ms (Switch from ${slice.fromTaskId} to ${slice.toTaskId})`}
                    >
                      <Zap className="w-3 h-3 text-status-rose" />
                      <span className="text-[8px] font-terminal text-status-rose leading-none hidden group-hover:inline">
                        CS
                      </span>
                    </div>
                  );
                }

                if (slice.type === 'IDLE') {
                  return (
                    <div
                      key={slice.id}
                      className="absolute top-2 h-12 flex items-center justify-center rounded border border-dashed border-aegis-border bg-aegis-sidebar/40 text-[10px] font-terminal text-aegis-subtle"
                      style={{
                        left: `${left}px`,
                        width: `${width}px`,
                      }}
                    >
                      <span>IDLE</span>
                    </div>
                  );
                }

                // Normal Execution Block
                return (
                  <div
                    key={slice.id}
                    className={`absolute top-0 h-16 rounded-lg border flex flex-col justify-between p-1.5 transition-all cursor-pointer font-terminal text-xs shadow-sm overflow-hidden ${
                      isCurrentActive
                        ? 'ring-2 ring-aegis-teal shadow-glow-teal z-20 scale-[1.02]'
                        : 'opacity-90 hover:opacity-100'
                    }`}
                    style={{
                      left: `${left}px`,
                      width: `${width}px`,
                      backgroundColor: `${slice.color}22`,
                      borderColor: slice.color,
                    }}
                    title={`${slice.taskName} (${slice.taskId})\nStart: ${slice.startTime}ms, End: ${slice.endTime}ms\nDuration: ${slice.duration}ms`}
                  >
                    {/* Top: PID & Start Time */}
                    <div className="flex items-center justify-between text-[10px] leading-none">
                      <span className="font-bold text-white drop-shadow" style={{ color: slice.color }}>
                        {slice.taskId}
                      </span>
                      {width > 35 && (
                        <span className="text-[9px] text-aegis-subtle">
                          {slice.startTime}m
                        </span>
                      )}
                    </div>

                    {/* Middle: Task Name if space permits */}
                    {width > 60 && (
                      <div className="text-[10px] text-white truncate font-sans font-medium">
                        {slice.taskName}
                      </div>
                    )}

                    {/* Bottom: End Time & Duration */}
                    <div className="flex items-center justify-between text-[9px] text-aegis-muted leading-none">
                      <span>{slice.duration}ms</span>
                      {width > 40 && <span>{slice.endTime}m</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Current Simulation Clock Playhead Cursor */}
            <div
              className="absolute top-0 bottom-0 z-30 pointer-events-none transition-all duration-75"
              style={{ left: `${currentTime * scale}px` }}
            >
              <div className="w-0.5 h-full bg-aegis-teal shadow-glow-teal relative">
                {/* Playhead Marker Pin */}
                <div className="absolute -top-5 -left-8 px-1.5 py-0.5 rounded bg-aegis-teal text-aegis-bg text-[10px] font-bold font-terminal shadow-lg whitespace-nowrap">
                  {currentTime} ms
                </div>
              </div>
            </div>

            {/* Time Axis Bar with Markers */}
            <div className="absolute bottom-0 left-0 right-0 h-6 border-t border-aegis-border/80 flex items-center">
              {ticks.map((t) => (
                <div
                  key={`label-${t}`}
                  className="absolute text-[10px] font-terminal text-aegis-subtle -translate-x-1/2"
                  style={{ left: `${t * scale}px` }}
                >
                  {t}ms
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend / Key Footer */}
        <div className="pt-2 border-t border-aegis-border/60 flex flex-wrap items-center justify-between gap-3 text-xs font-terminal text-aegis-muted">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-aegis-teal/40 border border-aegis-teal" />
              <span>Active Execution Slice</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-status-rose/30 border border-status-rose/50" />
              <span>Context Switch (CS)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-aegis-sidebar border border-dashed border-aegis-border" />
              <span>CPU Idle</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span>Current Head:</span>
            <span className="text-white font-bold">{currentTime} ms</span>
            <span className="text-aegis-subtle">/</span>
            <span>Est Total: {totalExecutionTime} ms</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default GanttChart;

