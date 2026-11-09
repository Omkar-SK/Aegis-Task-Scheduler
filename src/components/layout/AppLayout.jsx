import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import useScheduler from '../../hooks/useScheduler';

export function AppLayout() {
  const scheduler = useScheduler({ pollingIntervalMs: 1000, autoPoll: true });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-aegis-bg text-aegis-text">
      {/* Collapsible Left Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Execution Shell */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Responsive Content Area with Smooth Page Transition */}
        <main className="flex-1 overflow-y-auto bg-grid-subtle p-4 md:p-6 lg:p-8">
          <div className="animate-fade-in">
            <Outlet context={scheduler} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
