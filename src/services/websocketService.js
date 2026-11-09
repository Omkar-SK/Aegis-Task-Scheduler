/**
 * Aegis WebSocket Service
 * 
 * Manages real-time bidirectional WebSocket communication for:
 * ws://localhost:8080/ws/scheduler
 * 
 * Handles:
 * - Real-time task execution events
 * - Scheduler state telemetry snapshots
 * - Adaptive priority recalculation streams
 * - Multi-core thread monitoring updates
 * - Automatic exponential backoff reconnection
 * - Seamless fallback to in-browser mock telemetry emitter when daemon is offline
 */

const DEFAULT_WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws/scheduler';

export const WS_STATUS = {
  CONNECTING: 'CONNECTING',
  OPEN: 'OPEN',
  CLOSING: 'CLOSING',
  CLOSED: 'CLOSED',
  DISCONNECTED: 'DISCONNECTED',
};

class WebSocketService {
  constructor() {
    this.url = localStorage.getItem('aegis_cxx_ws_url') || DEFAULT_WS_URL;
    this.socket = null;
    this.status = WS_STATUS.DISCONNECTED;
    this.listeners = new Map(); // topic -> Set<callback>
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectTimer = null;
    this.mockTimer = null;
    this.fallbackToMock = true;
    this.isMockActive = false;
  }

  setUrl(url) {
    this.url = url;
    localStorage.setItem('aegis_cxx_ws_url', url);
  }

  /**
   * Connect to C++ backend WebSocket endpoint
   */
  connect() {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this._updateStatus(WS_STATUS.CONNECTING);

    try {
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        this._updateStatus(WS_STATUS.OPEN);
        this.reconnectAttempts = 0;
        this._stopMockEmitter();
        this._emit('connection', { connected: true, status: WS_STATUS.OPEN, url: this.url });

        // Handshake subscription
        this.send({
          type: 'SUBSCRIBE',
          topics: ['events', 'state', 'priority', 'threads'],
          client: 'Aegis-Web-Client-v1',
        });
      };

      this.socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message && message.topic) {
            this._emit(message.topic, message.payload || message);
          } else if (message && message.type) {
            this._emit('event', message);
          }
        } catch (err) {
          console.warn('Failed to parse incoming WebSocket message:', err);
        }
      };

      this.socket.onerror = (error) => {
        console.warn('WebSocket connection error on', this.url);
      };

      this.socket.onclose = () => {
        this._updateStatus(WS_STATUS.CLOSED);
        this._emit('connection', { connected: false, status: WS_STATUS.CLOSED, url: this.url });
        this._scheduleReconnect();
      };
    } catch (err) {
      this._updateStatus(WS_STATUS.DISCONNECTED);
      this._emit('connection', { connected: false, status: WS_STATUS.DISCONNECTED, error: err.message });
      this._scheduleReconnect();
    }
  }

  /**
   * Disconnect and clear timers
   */
  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this._stopMockEmitter();

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this._updateStatus(WS_STATUS.DISCONNECTED);
    this._emit('connection', { connected: false, status: WS_STATUS.DISCONNECTED, url: this.url });
  }

  /**
   * Send JSON command to C++ daemon
   */
  send(data) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
      return true;
    }
    return false;
  }

  /**
   * Subscribe to topic events
   * @param {'event' | 'state' | 'priority' | 'threads' | 'connection'} topic
   * @param {Function} callback
   * @returns {Function} unsubscribe function
   */
  subscribe(topic, callback) {
    if (!this.listeners.has(topic)) {
      this.listeners.set(topic, new Set());
    }
    this.listeners.get(topic).add(callback);

    // If mock fallback is enabled and we are disconnected, start mock generator
    if (this.fallbackToMock && this.status !== WS_STATUS.OPEN && !this.isMockActive) {
      this._startMockEmitter();
    }

    return () => {
      const set = this.listeners.get(topic);
      if (set) {
        set.delete(callback);
        if (set.size === 0) this.listeners.delete(topic);
      }
    };
  }

  _emit(topic, payload) {
    const set = this.listeners.get(topic);
    if (set) {
      set.forEach((cb) => {
        try {
          cb(payload);
        } catch (e) {
          console.error(`Error in WebSocket subscriber for topic "${topic}":`, e);
        }
      });
    }
  }

  _updateStatus(status) {
    this.status = status;
  }

  _scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.info('Max C++ WebSocket reconnection attempts reached. Operating in simulated fallback mode.');
      if (this.fallbackToMock) {
        this._startMockEmitter();
      }
      return;
    }

    const backoffMs = Math.min(16000, 1000 * Math.pow(2, this.reconnectAttempts));
    this.reconnectAttempts += 1;

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, backoffMs);
  }

  _startMockEmitter() {
    if (this.isMockActive) return;
    this.isMockActive = true;

    this.mockTimer = setInterval(() => {
      // Emit synthetic execution events to subscribers
      const mockEvent = {
        eventId: `evt-mock-${Date.now()}`,
        type: 'PRIORITY_UPDATED',
        timestamp: new Date().toLocaleTimeString(),
        simTimeMs: Date.now() % 100000,
        taskId: 'T-1055',
        taskName: 'radix_tree_index_rebalance',
        threadId: 'TH-03',
        coreId: 3,
        message: 'Aegis adaptive priority aged: T-1055 boosted to 9.6',
        source: 'MOCK_EMITTER',
      };

      this._emit('event', mockEvent);
    }, 2500);
  }

  _stopMockEmitter() {
    if (this.mockTimer) {
      clearInterval(this.mockTimer);
      this.mockTimer = null;
    }
    this.isMockActive = false;
  }
}

export const websocketService = new WebSocketService();
export default websocketService;

