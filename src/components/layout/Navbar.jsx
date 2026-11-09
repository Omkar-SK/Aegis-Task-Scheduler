import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Menu,
  Bell,
  CheckCircle,
  Radio,
  ChevronRight,
  Shield,
  User,
  Sliders,
  AlertCircle,
  Info,
} from 'lucide-react';
import { cn } from '../../utils/classNames';

const ROUTE_TITLES = {
  '/': { title: 'Overview', breadcrumb: 'Overview' },
  '/tasks': { title: 'Task Manager', breadcrumb: 'Task Manager' },
  '/simulator': { title: 'Simulator', breadcrumb: 'Simulator' },
  '/comparison': { title: 'Algorithm Comparison', breadcrumb: 'Algorithm Comparison' },
  '/monitoring': { title: 'Live Monitoring', breadcrumb: 'Live Monitoring' },
  '/reports': { title: 'Reports', breadcrumb: 'Reports' },
  '/settings': { title: 'Settings', breadcrumb: 'Settings' },
};

export function Navbar({ onToggleSidebar, isSidebarOpen }) {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const routeInfo = ROUTE_TITLES[location.pathname] || {
    title: 'Aegis Platform',
    breadcrumb: 'Module',
  };

  const sampleNotifications = [
    {
      id: 1,
      title: 'MLFQ Dynamic Quantum Tuned',
      desc: 'Adaptive controller decreased Q0 to 10ms for low-latency bursts.',
      time: '2m ago',
      type: 'info',
    },
    {
      id: 2,
      title: 'Work Steal Event on Core #3',
      desc: 'Core #3 stole 2 tasks from Core #1 deque to balance load.',
      time: '6m ago',
      type: 'success',
    },
    {
      id: 3,
      title: 'Starvation Guard Active',
      desc: 'Priority aging boost applied to 4 waiting ready tasks.',
      time: '12m ago',
      type: 'warning',
    },
  ];

  return (
    <header className="h-16 px-4 md:px-6 bg-aegis-sidebar/90 backdrop-blur-md border-b border-aegis-border flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-aegis-muted hover:text-white hover:bg-aegis-card transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-terminal">
          <span className="text-aegis-muted hidden sm:inline">Aegis</span>
          <ChevronRight className="w-3.5 h-3.5 text-aegis-subtle hidden sm:inline" />
          <span className="text-white font-semibold text-sm md:text-base tracking-tight font-sans">
            {routeInfo.title}
          </span>
        </div>
      </div>

      {/* Right: Status Indicator, Notifications, Profile */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* System Status Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-aegis-card border border-aegis-border font-terminal text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-aegis-teal opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-aegis-teal" />
          </span>
          <span className="text-white font-medium">Kernel Online</span>
          <span className="text-aegis-subtle">|</span>
          <span className="text-aegis-teal font-semibold">1000 Hz</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-aegis-muted hover:text-white hover:bg-aegis-card border border-transparent hover:border-aegis-border transition-colors"
            title="System Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-aegis-teal shadow-glow-teal" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-aegis-card border border-aegis-border shadow-2xl overflow-hidden z-50 animate-fade-in">
              <div className="px-4 py-3 border-b border-aegis-border flex items-center justify-between">
                <span className="text-xs font-semibold text-white uppercase tracking-wider font-terminal">
                  Scheduler Telemetry Alerts
                </span>
                <span className="text-[10px] font-terminal px-1.5 py-0.5 rounded bg-aegis-teal/10 text-aegis-teal border border-aegis-teal/30">
                  3 New
                </span>
              </div>

              <div className="divide-y divide-aegis-border/60 max-h-72 overflow-y-auto">
                {sampleNotifications.map((notif) => (
                  <div key={notif.id} className="p-3 hover:bg-aegis-card-hover transition-colors">
                    <div className="flex items-start gap-2.5">
                      {notif.type === 'success' ? (
                        <CheckCircle className="w-4 h-4 text-aegis-teal shrink-0 mt-0.5" />
                      ) : notif.type === 'warning' ? (
                        <AlertCircle className="w-4 h-4 text-status-amber shrink-0 mt-0.5" />
                      ) : (
                        <Info className="w-4 h-4 text-aegis-indigo shrink-0 mt-0.5" />
                      )}
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white truncate">
                          {notif.title}
                        </div>
                        <div className="text-[11px] text-aegis-muted mt-0.5 leading-relaxed">
                          {notif.desc}
                        </div>
                        <div className="text-[10px] text-aegis-subtle font-terminal mt-1">
                          {notif.time}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2 border-t border-aegis-border bg-aegis-sidebar text-center">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] text-aegis-teal hover:underline font-terminal"
                >
                  Clear all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 pl-2 pr-1 py-1 rounded-lg hover:bg-aegis-card border border-transparent hover:border-aegis-border transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-aegis-indigo to-aegis-teal flex items-center justify-center text-aegis-bg font-bold text-xs ring-1 ring-aegis-border">
              AO
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-semibold text-white leading-tight">Admin Operator</div>
              <div className="text-[10px] text-aegis-muted font-terminal">Kernel Architect</div>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-aegis-card border border-aegis-border shadow-2xl p-2 z-50 animate-fade-in font-terminal text-xs">
              <div className="px-3 py-2 border-b border-aegis-border text-left">
                <div className="font-semibold text-white">OS Course Project</div>
                <div className="text-[11px] text-aegis-muted font-mono mt-0.5">
                  Aegis v1.0.0 (Adaptive)
                </div>
              </div>
              <div className="py-1">
                <div className="px-3 py-2 text-aegis-muted hover:text-white hover:bg-aegis-card-hover rounded cursor-pointer transition-colors flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-aegis-teal" />
                  <span>Security Profile: Root</span>
                </div>
                <div className="px-3 py-2 text-aegis-muted hover:text-white hover:bg-aegis-card-hover rounded cursor-pointer transition-colors flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-aegis-indigo" />
                  <span>Daemon Config</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;

