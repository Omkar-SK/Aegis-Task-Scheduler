import React, { useState, useEffect } from 'react';
import {
  Server,
  Radio,
  Wifi,
  WifiOff,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import api from '../../services/api';
import websocketService, { WS_STATUS } from '../../services/websocketService';
import { cn } from '../../utils/classNames';

export function ConnectionStatusBar({ className = '' }) {
  const [backendHealth, setBackendHealth] = useState({ online: false, mode: 'MOCK', latencyMs: null });
  const [wsState, setWsState] = useState({ connected: false, status: WS_STATUS.DISCONNECTED });
  const [isPinging, setIsPinging] = useState(false);

  const checkConnection = async () => {
    setIsPinging(true);
    const health = await api.checkHealth();
    setBackendHealth(health);
    setIsPinging(false);
  };

  useEffect(() => {
    checkConnection();

    // Subscribe to websocket connection updates
    const unsubscribe = websocketService.subscribe('connection', (state) => {
      setWsState(state);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div
      className={cn(
        'px-3 py-1.5 rounded-xl bg-aegis-sidebar/90 border border-aegis-border flex items-center justify-between gap-3 text-xs font-terminal',
        className
      )}
    >
      {/* REST API Status */}
      <div className="flex items-center gap-2">
        <span className="text-aegis-muted text-[10px] uppercase">REST API:</span>
        {backendHealth.online ? (
          <span className="flex items-center gap-1 text-status-emerald font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-status-emerald" />
            <span>C++ Daemon ({backendHealth.latencyMs}ms)</span>
          </span>
        ) : (
          <span className="flex items-center gap-1 text-aegis-teal font-semibold">
            <Radio className="w-3 h-3 text-aegis-teal" />
            <span>Mock API Adapter</span>
          </span>
        )}
      </div>

      {/* WebSocket Status */}
      <div className="flex items-center gap-2 border-l border-aegis-border pl-3">
        <span className="text-aegis-muted text-[10px] uppercase">WS Stream:</span>
        {wsState.connected ? (
          <span className="flex items-center gap-1 text-status-emerald font-semibold">
            <Wifi className="w-3 h-3" />
            <span>Connected</span>
          </span>
        ) : (
          <span className="flex items-center gap-1 text-aegis-subtle font-medium">
            <WifiOff className="w-3 h-3" />
            <span>Simulated Emitter</span>
          </span>
        )}
      </div>

      {/* Ping Trigger */}
      <button
        onClick={checkConnection}
        disabled={isPinging}
        className="p-1 rounded-md text-aegis-muted hover:text-white hover:bg-aegis-card transition-colors disabled:opacity-50"
        title="Ping C++ Daemon"
      >
        <RefreshCw className={cn('w-3 h-3', isPinging && 'animate-spin text-aegis-teal')} />
      </button>
    </div>
  );
}

export default ConnectionStatusBar;

