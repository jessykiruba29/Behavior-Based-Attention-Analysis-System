import { useMemo } from 'react';

interface AttentionOrbProps {
  value: number; // 0 to 1
  size?: number;
  label?: string;
}

export function AttentionOrb({ value, size = 200, label = 'Attention' }: AttentionOrbProps) {
  const normalizedValue = Math.max(0, Math.min(1, value));
  const percentage = Math.round(normalizedValue * 100);

  // Determine color based on value
  const colorClass = useMemo(() => {
    if (normalizedValue >= 0.7) return 'stroke-success';
    if (normalizedValue >= 0.4) return 'stroke-primary';
    return 'stroke-warning';
  }, [normalizedValue]);

  const glowClass = useMemo(() => {
    if (normalizedValue >= 0.7) return 'glow-success';
    if (normalizedValue >= 0.4) return 'glow-primary';
    return 'glow-warning';
  }, [normalizedValue]);

  const circumference = 2 * Math.PI * 88; // radius = 88
  const strokeDashoffset = circumference * (1 - normalizedValue);

  return (
    <div className="relative flex flex-col items-center gap-4">
      <div 
        className={`attention-orb ${glowClass}`}
        style={{ width: size, height: size }}
      >
        {/* Pulse ring animation */}
        <div className="pulse-ring" />
        
        {/* SVG Progress Ring */}
        <svg
          width={size}
          height={size}
          viewBox="0 0 200 200"
          className="absolute inset-0"
        >
          {/* Background ring */}
          <circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="4"
            className="opacity-30"
          />
          
          {/* Progress ring */}
          <circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            className={`progress-ring transition-all duration-500 ease-out ${colorClass}`}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset,
            }}
          />
        </svg>

        {/* Center content */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          <span className="font-mono text-5xl font-semibold text-foreground">
            {percentage}
          </span>
          <span className="text-sm text-muted-foreground">%</span>
        </div>
      </div>

      {/* Label */}
      <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}
