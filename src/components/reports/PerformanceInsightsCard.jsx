import React from 'react';
import {
  Sparkles,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Info,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import Card from '../common/Card';
import { cn } from '../../utils/classNames';

export function PerformanceInsightsCard({ insights = [] }) {
  if (!insights || insights.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'SUCCESS':
        return <CheckCircle2 className="w-4 h-4 text-status-emerald shrink-0" />;
      case 'POSITIVE':
        return <TrendingDown className="w-4 h-4 text-aegis-teal shrink-0" />;
      case 'WARNING':
        return <TrendingUp className="w-4 h-4 text-status-amber shrink-0" />;
      case 'ALERT':
        return <AlertTriangle className="w-4 h-4 text-status-rose shrink-0" />;
      case 'INFO':
      default:
        return <Info className="w-4 h-4 text-aegis-indigo shrink-0" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'SUCCESS':
        return 'border-status-emerald/30 bg-status-emerald/5';
      case 'POSITIVE':
        return 'border-aegis-teal/30 bg-aegis-teal/5';
      case 'WARNING':
        return 'border-status-amber/30 bg-status-amber/5';
      case 'ALERT':
        return 'border-status-rose/30 bg-status-rose/5';
      case 'INFO':
      default:
        return 'border-aegis-indigo/30 bg-aegis-indigo/5';
    }
  };

  return (
    <Card
      title="Automated Scheduling Performance Insights"
      subtitle="Data-supported mathematical conclusions derived from comparative simulation runs"
      icon={Sparkles}
      actions={
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-aegis-teal/10 border border-aegis-teal/30 text-aegis-teal text-xs font-terminal font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Strictly Verified by Empirical Data</span>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 font-terminal text-xs">
        {insights.map((ins, idx) => (
          <div
            key={idx}
            className={cn(
              'p-3.5 rounded-xl border flex flex-col justify-between space-y-2.5 transition-all',
              getBorderColor(ins.type)
            )}
          >
            {/* Top Tag & Metric Badge */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] uppercase font-bold text-aegis-muted flex items-center gap-1">
                {getIcon(ins.type)}
                <span>{ins.category}</span>
              </span>

              {ins.metricBadge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-aegis-card border border-aegis-border text-white">
                  {ins.metricBadge}
                </span>
              )}
            </div>

            {/* Title & Statement */}
            <div className="space-y-1">
              <h4 className="font-bold text-white text-xs leading-snug">
                {ins.title}
              </h4>
              <p className="text-[11px] text-aegis-text-dim leading-relaxed">
                {ins.statement}
              </p>
            </div>

            {/* Algorithm Badge */}
            {ins.algorithm && (
              <div className="pt-2 border-t border-aegis-border/40 text-[10px] text-aegis-subtle flex items-center justify-between">
                <span>Associated Policy:</span>
                <strong className="text-aegis-teal">{ins.algorithm}</strong>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

export default PerformanceInsightsCard;

