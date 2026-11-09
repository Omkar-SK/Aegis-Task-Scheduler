/**
 * Aegis Design System Tokens
 * Developer Dashboard Palette
 */

export const tokens = {
  colors: {
    bg: '#090E19',
    sidebar: '#0D1422',
    card: '#111B2B',
    cardHover: '#162338',
    border: '#202C40',
    borderLight: '#2D3E5B',
    primary: '#18C6A3',       // Teal / Cyan accent
    secondary: '#7C8CFF',     // Indigo accent
    text: {
      primary: '#F8FAFC',
      secondary: '#CBD5E1',
      muted: '#94A3B8',
      subtle: '#64748B',
    },
    status: {
      running: '#18C6A3',     // Teal
      ready: '#38BDF8',       // Sky
      waiting: '#F59E0B',     // Amber
      completed: '#10B981',   // Emerald
      preempted: '#F43F5E',   // Rose
      idle: '#64748B',        // Subtle gray
    },
    charts: {
      grid: '#182438',
      axis: '#64748B',
      series: ['#18C6A3', '#7C8CFF', '#38BDF8', '#F59E0B', '#10B981', '#F43F5E'],
    },
  },
  shadows: {
    card: '0 4px 20px -2px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(32, 44, 64, 0.8)',
    glowTeal: '0 0 20px -5px rgba(24, 198, 163, 0.25)',
    glowIndigo: '0 0 20px -5px rgba(124, 140, 255, 0.25)',
  },
  radii: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
};

export default tokens;
