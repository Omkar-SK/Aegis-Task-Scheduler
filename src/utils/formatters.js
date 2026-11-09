/**
 * OS & Performance Metric Formatters
 */

/**
 * Format CPU or Core utilization percentage
 * @param {number} val 
 * @param {number} decimals 
 * @returns {string}
 */
export function formatPercentage(val, decimals = 1) {
  if (val === undefined || val === null || isNaN(val)) return '0.0%';
  return `${Number(val).toFixed(decimals)}%`;
}

/**
 * Format time duration (ms, μs, s)
 * @param {number} ms - Milliseconds
 * @returns {string}
 */
export function formatDuration(ms) {
  if (ms === undefined || ms === null || isNaN(ms)) return '0 ms';
  if (ms < 1) {
    return `${Math.round(ms * 1000)} μs`;
  }
  if (ms >= 1000) {
    return `${(ms / 1000).toFixed(2)} s`;
  }
  return `${Number(ms).toFixed(1)} ms`;
}

/**
 * Format memory sizes (Bytes, KB, MB, GB)
 * @param {number} bytes 
 * @returns {string}
 */
export function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Format a Task or Thread identifier (e.g. PID / TID)
 * @param {number|string} id 
 * @param {string} prefix 
 * @returns {string}
 */
export function formatId(id, prefix = 'T') {
  if (!id) return `${prefix}-000`;
  const cleanId = String(id).replace(/^[A-Za-z]+[-_]?/, '');
  return `${prefix}-${cleanId.padStart(4, '0')}`;
}

/**
 * Format clock timestamps (HH:mm:ss.SSS)
 * @param {Date|number|string} date 
 * @returns {string}
 */
export function formatTimestamp(date = new Date()) {
  const d = new Date(date);
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  const s = String(d.getSeconds()).padStart(2, '0');
  const ms = String(d.getMilliseconds()).padStart(3, '0');
  return `${h}:${m}:${s}.${ms}`;
}

/**
 * Format frequency (Hz, kHz, MHz, GHz)
 * @param {number} hz 
 * @returns {string}
 */
export function formatFrequency(hz) {
  if (!hz) return '0 Hz';
  if (hz >= 1e9) return `${(hz / 1e9).toFixed(2)} GHz`;
  if (hz >= 1e6) return `${(hz / 1e6).toFixed(2)} MHz`;
  if (hz >= 1e3) return `${(hz / 1e3).toFixed(1)} kHz`;
  return `${hz} Hz`;
}

