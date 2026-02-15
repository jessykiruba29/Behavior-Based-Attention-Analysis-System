import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
}

export function MetricCard({ 
  icon: Icon, 
  label, 
  value, 
  unit, 
  description 
}: MetricCardProps) {
  return (
    <div className="metric-card group">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="flex items-baseline gap-1">
          <span className="font-mono text-3xl font-semibold text-foreground">
            {value}
          </span>
          {unit && (
            <span className="text-sm text-muted-foreground">{unit}</span>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground/70 pt-1">{description}</p>
        )}
      </div>
    </div>
  );
}

interface MetricCardSkeletonProps {
  className?: string;
}

export function MetricCardSkeleton({ className }: MetricCardSkeletonProps) {
  return (
    <div className={`metric-card ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-muted animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="w-20 h-4 bg-muted rounded animate-pulse" />
        <div className="w-16 h-8 bg-muted rounded animate-pulse" />
      </div>
    </div>
  );
}
