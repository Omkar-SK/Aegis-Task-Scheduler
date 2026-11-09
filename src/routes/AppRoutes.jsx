import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import OverviewPage from '../pages/Overview/OverviewPage';
import TaskManagerPage from '../pages/TaskManager/TaskManagerPage';
import SimulatorPage from '../pages/Simulator/SimulatorPage';
import AlgorithmComparisonPage from '../pages/AlgorithmComparison/AlgorithmComparisonPage';
import LiveMonitoringPage from '../pages/LiveMonitoring/LiveMonitoringPage';
import ReportsPage from '../pages/Reports/ReportsPage';
import SettingsPage from '../pages/Settings/SettingsPage';
import NotFoundPage from '../pages/NotFoundPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<OverviewPage />} />
        <Route path="tasks" element={<TaskManagerPage />} />
        <Route path="simulator" element={<SimulatorPage />} />
        <Route path="comparison" element={<AlgorithmComparisonPage />} />
        <Route path="monitoring" element={<LiveMonitoringPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
