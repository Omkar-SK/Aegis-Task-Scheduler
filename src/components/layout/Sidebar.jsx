import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Cpu,
  GitCompare,
  Activity,
  FileBarChart2,
  Settings,
  Shield,
  X,
  Radio,
} from 'lucide-react';
import { cn } from '../../utils/classNames';

export const NAV_LINKS = [
  {
    to: '/',
    label: 'Overview',
    icon: LayoutDashboard,
  },
  {
    to: '/tasks',
    label: 'Task Manager',
    icon: Layers,
  },
  {
    to: '/simulator',
    label: 'Simulator',
    icon: Cpu,
  },
  {
    to: '/comparison',
    label: 'Algorithm Comparison',
    icon: GitCompare,
  },
  {
    to: '/monitoring',
    label: 'Live Monitoring',
    icon: Activity,
  },
  {
    to: '/reports',
    label: 'Reports',
    icon: FileBarChart2,
  },
];

export function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-aegis-sidebar border-r border-aegis-border flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto select-none',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Top: Logo & Main Navigation */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Header Brand */}
          <div className="h-16 px-5 border-b border-aegis-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-aegis-teal to-aegis-indigo flex items-center justify-center text-aegis-bg shadow-glow-teal font-black shrink-0">
                <Shield className="w-5 h-5 fill-current" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white tracking-wider text-base">AEGIS</span>
                  <span className="text-[10px] font-terminal px-1.5 py-0.5 bg-aegis-teal/10 text-aegis-teal border border-aegis-teal/30 rounded font-semibold">
                    PROFILER
                  </span>
                </div>
                <p className="text-[11px] text-aegis-muted truncate">OS Task Scheduler</p>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-aegis-muted hover:text-white rounded-lg hover:bg-aegis-border/50"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav List */}
          <nav className="p-3 space-y-1 mt-2">
            <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-aegis-subtle font-terminal">
              Core Modules
            </div>

            {NAV_LINKS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.to);

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => {
                    // Auto-close on mobile upon navigation
                    if (window.innerWidth < 1024 && onClose) onClose();
                  }}
                  className={({ isActive }) =>
                    cn(
                      'group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'bg-aegis-teal/10 text-aegis-teal font-semibold shadow-inner'
                        : 'text-aegis-muted hover:text-white hover:bg-aegis-card'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active indicator bar */}
                      {isActive && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-aegis-teal rounded-r-full shadow-glow-teal" />
                      )}
                      <Icon
                        className={cn(
                          'w-4 h-4 shrink-0 transition-colors',
                          isActive ? 'text-aegis-teal' : 'text-aegis-subtle group-hover:text-aegis-muted'
                        )}
                      />
                      <span className="truncate">{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Settings & System Engine */}
        <div className="p-3 border-t border-aegis-border space-y-2">
          {/* Settings link */}
          <NavLink
            to="/settings"
            onClick={() => {
              if (window.innerWidth < 1024 && onClose) onClose();
            }}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-aegis-teal/10 text-aegis-teal font-semibold'
                  : 'text-aegis-muted hover:text-white hover:bg-aegis-card'
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-aegis-teal rounded-r-full" />
                )}
                <Settings
                  className={cn(
                    'w-4 h-4 shrink-0 transition-colors',
                    isActive ? 'text-aegis-teal' : 'text-aegis-subtle group-hover:text-aegis-muted'
                  )}
                />
                <span className="truncate">Settings</span>
              </>
            )}
          </NavLink>

          {/* Hardware status badge */}
          <div className="p-3 rounded-lg bg-aegis-card border border-aegis-border text-xs font-terminal">
            <div className="flex items-center justify-between text-aegis-muted">
              <span className="flex items-center gap-1.5 text-white font-medium">
                <Radio className="w-3.5 h-3.5 text-aegis-teal animate-pulse" />
                Engine Active
              </span>
              <span className="text-[10px] text-aegis-indigo font-bold">C++20</span>
            </div>
            <div className="mt-1.5 text-[11px] text-aegis-subtle flex items-center justify-between">
              <span>Target: MLFQ Core</span>
              <span>1000 Hz</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
