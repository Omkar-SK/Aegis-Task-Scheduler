import React from 'react';
import { History, Activity } from 'lucide-react';
import Card from '../common/Card';

export function RecentActivityFeed({ activities = [] }) {
  return (
    <Card
      title="Recent Scheduler Activity"
      subtitle="Kernel preemption, work-stealing, and context switch audit log"
      icon={History}
      actions={
        <div className="flex items-center gap-1.5 text-xs font-terminal text-aegis-muted">
          <Activity className="w-3.5 h-3.5 text-aegis-teal" />
          <span>Real-time Event Stream</span>
        </div>
      }
    >
      <div className="space-y-3 font-terminal text-xs max-h-80 overflow-y-auto pr-1">
        {activities.length === 0 ? (
          <div className="py-6 text-center text-aegis-muted">No recent events logged.</div>
        ) : (
          activities.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-lg bg-aegis-sidebar/80 border border-aegis-border hover:border-aegis-border-light transition-all space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-semibold border ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                  <span className="font-semibold text-white">{item.title}</span>
                </div>
                <span className="text-[10px] text-aegis-subtle">{item.time}</span>
              </div>

              <p className="text-[11px] text-aegis-muted leading-relaxed font-sans">
                {item.detail}
              </p>

              <div className="flex items-center justify-between text-[10px] text-aegis-subtle pt-1 border-t border-aegis-border/40">
                <span>Origin: {item.core}</span>
                <span className="text-aegis-teal">ACK 0x0</span>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

export default RecentActivityFeed;

