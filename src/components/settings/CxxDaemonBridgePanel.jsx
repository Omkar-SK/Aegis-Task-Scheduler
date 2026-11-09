import React, { useState } from 'react';
import {
  Server,
  Radio,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Terminal,
  Cpu,
  ArrowRight,
  Zap,
} from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import apiClient from '../../services/apiClient';
import { cn } from '../../utils/classNames';

const IPC_PROTOCOLS = [
  { id: 'HTTP_REST', name: 'HTTP REST API (Crow / oatpp)', desc: 'Asynchronous JSON endpoints' },
  { id: 'WEBSOCKET', name: 'WebSocket Telemetry Stream', desc: 'Low-latency push stream (Boost.Beast)' },
  { id: 'SHARED_MEM', name: 'POSIX Shared Memory (/dev/shm)', desc: 'Zero-copy lock-free ringbuffer' },
  { id: 'UNIX_SOCKET', name: 'Unix Domain Sockets (AF_UNIX)', desc: 'High-throughput local IPC stream' },
];

export function CxxDaemonBridgePanel() {
  const [baseUrl, setBaseUrl] = useState(() => {
    return localStorage.getItem('aegis_cxx_backend_url') || 'http://localhost:8080/api';
  });
  const [wsUrl, setWsUrl] = useState(() => {
    return localStorage.getItem('aegis_cxx_ws_url') || 'ws://localhost:8080/ws/scheduler';
  });
  const [selectedIpc, setSelectedIpc] = useState('HTTP_REST');
  const [pingStatus, setPingStatus] = useState(null); // null | { state: 'testing' | 'online' | 'offline', latency?: number, message: string }

  const handleTestConnection = async () => {
    setPingStatus({ state: 'testing', message: 'Pinging C++ backend daemon...' });
    const startTime = performance.now();

    try {
      apiClient.setBaseUrl(baseUrl);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);

      const res = await fetch(`${baseUrl}/health`, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      clearTimeout(timeoutId);

      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);

      if (res.ok) {
        setPingStatus({
          state: 'online',
          latency,
          message: `Connected to C++ Aegis Daemon (v1.0.0-aegis) in ${latency} ms`,
        });
      } else {
        setPingStatus({
          state: 'offline',
          message: `HTTP ${res.status}: ${res.statusText}. Using fallback simulation engine.`,
        });
      }
    } catch (err) {
      setPingStatus({
        state: 'offline',
        message: 'C++ Daemon offline at target address. Aegis is operating in local deterministic simulation mode.',
      });
    }
  };

  const handleSaveEndpoints = () => {
    localStorage.setItem('aegis_cxx_backend_url', baseUrl);
    localStorage.setItem('aegis_cxx_ws_url', wsUrl);
    apiClient.setBaseUrl(baseUrl);
    alert('Backend endpoint URLs updated and cached.');
  };

  return (
    <Card
      title="C++ Native Daemon Bridge Configuration"
      subtitle="Connect the React dashboard to the POSIX multithreaded Aegis scheduling daemon"
      icon={Server}
      actions={
        <div className="flex items-center gap-2">
          {pingStatus?.state === 'online' ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-status-emerald/10 border border-status-emerald/30 text-status-emerald text-xs font-terminal font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Daemon Online ({pingStatus.latency}ms)</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-status-amber/10 border border-status-amber/30 text-status-amber text-xs font-terminal font-semibold">
              <Radio className="w-3.5 h-3.5" />
              <span>Simulation Mode Active</span>
            </span>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        {/* Endpoints Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5 font-terminal text-xs">
            <label className="text-white font-semibold flex items-center justify-between">
              <span>REST Daemon Base URL:</span>
              <span className="text-[10px] text-aegis-muted">e.g. Crow / oatpp HTTP</span>
            </label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="w-full px-3 py-2 bg-aegis-sidebar border border-aegis-border rounded-lg text-white font-terminal text-xs focus:outline-none focus:border-aegis-teal transition-colors"
            />
          </div>

          <div className="space-y-1.5 font-terminal text-xs">
            <label className="text-white font-semibold flex items-center justify-between">
              <span>WebSocket Telemetry Stream:</span>
              <span className="text-[10px] text-aegis-muted">e.g. Boost.Beast WS</span>
            </label>
            <input
              type="text"
              value={wsUrl}
              onChange={(e) => setWsUrl(e.target.value)}
              className="w-full px-3 py-2 bg-aegis-sidebar border border-aegis-border rounded-lg text-white font-terminal text-xs focus:outline-none focus:border-aegis-teal transition-colors"
            />
          </div>
        </div>

        {/* IPC Protocol Mode Selector */}
        <div className="space-y-2 font-terminal text-xs">
          <span className="text-white font-semibold block">Select IPC Communication Transport:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {IPC_PROTOCOLS.map((proto) => {
              const isSelected = selectedIpc === proto.id;
              return (
                <div
                  key={proto.id}
                  onClick={() => setSelectedIpc(proto.id)}
                  className={cn(
                    'p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3',
                    isSelected
                      ? 'bg-aegis-teal/10 border-aegis-teal/50 shadow-glow-teal'
                      : 'bg-aegis-sidebar border-aegis-border hover:border-aegis-border-light'
                  )}
                >
                  <div
                    className={cn(
                      'w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0',
                      isSelected ? 'border-aegis-teal bg-aegis-teal' : 'border-aegis-border'
                    )}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-aegis-bg" />}
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">{proto.name}</div>
                    <div className="text-[11px] text-aegis-muted mt-0.5">{proto.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Controls & Ping Response */}
        <div className="pt-2 border-t border-aegis-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-terminal text-xs">
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              icon={Zap}
              onClick={handleTestConnection}
              disabled={pingStatus?.state === 'testing'}
            >
              {pingStatus?.state === 'testing' ? 'Pinging Daemon...' : 'Test Daemon Ping'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleSaveEndpoints}>
              Save Endpoints
            </Button>
          </div>

          {pingStatus && (
            <div
              className={cn(
                'p-2.5 rounded-lg border flex items-center gap-2 text-xs',
                pingStatus.state === 'online'
                  ? 'bg-status-emerald/10 border-status-emerald/30 text-status-emerald'
                  : pingStatus.state === 'offline'
                  ? 'bg-status-amber/10 border-status-amber/30 text-status-amber'
                  : 'bg-aegis-sidebar border-aegis-border text-aegis-muted'
              )}
            >
              {pingStatus.state === 'online' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              )}
              <span className="truncate">{pingStatus.message}</span>
            </div>
          )}
        </div>

        {/* C++ Daemon Compilation & Launch Hint */}
        <div className="p-3.5 rounded-xl bg-aegis-sidebar/80 border border-aegis-border font-terminal text-xs space-y-2">
          <div className="flex items-center gap-2 text-white font-semibold">
            <Terminal className="w-3.5 h-3.5 text-aegis-teal" />
            <span>Launch C++ Backend Daemon:</span>
          </div>
          <p className="text-aegis-muted text-[11px]">
            When ready to bridge native POSIX thread telemetry, compile and start the Aegis daemon:
          </p>
          <div className="p-2.5 rounded-lg bg-aegis-card border border-aegis-border text-[11px] text-aegis-teal overflow-x-auto select-all">
            g++ -O3 -std=c++20 -pthread daemon/main.cpp -o build/aegis_daemon &amp;&amp; ./build/aegis_daemon --port 8080 --cores 8
          </div>
        </div>
      </div>
    </Card>
  );
}

export default CxxDaemonBridgePanel;

