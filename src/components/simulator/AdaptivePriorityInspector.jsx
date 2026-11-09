import React, { useMemo } from 'react';
import { Sparkles, Shield, AlertTriangle, Scale } from 'lucide-react';
import PriorityWeightSliders from './PriorityWeightSliders';
import PriorityRankingList from './PriorityRankingList';
import PriorityHistoryChart from './PriorityHistoryChart';
import {
  calculateTaskPriority,
  generatePriorityHistory,
} from '../../utils/adaptivePriorityMath';

export function AdaptivePriorityInspector({
  tasks = [],
  currentTime = 0,
  weights,
  onWeightsChange,
  starvationThreshold,
  onStarvationThresholdChange,
}) {
  const options = useMemo(() => {
    return {
      starvationThreshold,
      deadlineWarningThreshold: 25,
      maxWaitReference: 80,
    };
  }, [starvationThreshold]);

  // Compute live deterministic priority metrics for each task
  const rankedTasks = useMemo(() => {
    const list = tasks.map((task) =>
      calculateTaskPriority(task, currentTime, weights, options)
    );

    // Sort descending by composite priority score
    list.sort((a, b) => b.compositePriority - a.compositePriority);
    return list;
  }, [tasks, currentTime, weights, options]);

  // Generate priority history points for Recharts
  const priorityHistoryData = useMemo(() => {
    return generatePriorityHistory(tasks, currentTime, weights, options);
  }, [tasks, currentTime, weights, options]);

  return (
    <div className="space-y-6 pt-2">
      {/* Formula & Weight Sliders Section */}
      <PriorityWeightSliders
        weights={weights}
        onWeightsChange={onWeightsChange}
        starvationThreshold={starvationThreshold}
        onStarvationThresholdChange={onStarvationThresholdChange}
      />

      {/* Leaderboard, Factor Breakdown & Warnings */}
      <PriorityRankingList
        rankedTasks={rankedTasks}
        weights={weights}
        currentTime={currentTime}
      />

      {/* Priority Evolution Over Simulation Time Chart */}
      <PriorityHistoryChart
        historyData={priorityHistoryData}
        tasks={tasks}
      />
    </div>
  );
}

export default AdaptivePriorityInspector;

