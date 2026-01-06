import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, AlertTriangle, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  stats: {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
    highPriority: number;
    completionRate: number;
  };
}

export function ProgressBar({ stats }: ProgressBarProps) {
  return (
    <div className="glass rounded-xl p-5 space-y-4">
      {/* Progress header */}
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm text-muted-foreground">Today's Progress</h3>
        <span className="text-2xl font-bold text-primary">{stats.completionRate}%</span>
      </div>

      {/* Progress bar */}
      <Progress 
        value={stats.completionRate} 
        className="h-3 bg-secondary"
      />

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-secondary/50">
            <Circle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-lg font-semibold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-success/10">
            <CheckCircle2 className="h-4 w-4 text-success" />
          </div>
          <div>
            <p className="text-lg font-semibold">{stats.completed}</p>
            <p className="text-xs text-muted-foreground">Done</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={cn(
            "p-2 rounded-lg",
            stats.overdue > 0 ? "bg-destructive/10" : "bg-secondary/50"
          )}>
            <AlertTriangle className={cn(
              "h-4 w-4",
              stats.overdue > 0 ? "text-destructive" : "text-muted-foreground"
            )} />
          </div>
          <div>
            <p className={cn(
              "text-lg font-semibold",
              stats.overdue > 0 && "text-destructive"
            )}>
              {stats.overdue}
            </p>
            <p className="text-xs text-muted-foreground">Overdue</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={cn(
            "p-2 rounded-lg",
            stats.highPriority > 0 ? "bg-priority-high/10" : "bg-secondary/50"
          )}>
            <Flame className={cn(
              "h-4 w-4",
              stats.highPriority > 0 ? "text-priority-high" : "text-muted-foreground"
            )} />
          </div>
          <div>
            <p className="text-lg font-semibold">{stats.highPriority}</p>
            <p className="text-xs text-muted-foreground">High Priority</p>
          </div>
        </div>
      </div>
    </div>
  );
}
