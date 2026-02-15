import { Lightbulb, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface RecommendationPanelProps {
  recommendation: string | null;
  attention: number;
}

export function RecommendationPanel({ recommendation, attention }: RecommendationPanelProps) {
  const getIcon = () => {
    if (attention >= 0.7) return CheckCircle2;
    if (attention >= 0.4) return Lightbulb;
    return AlertTriangle;
  };

  const getStatusText = () => {
    if (attention >= 0.7) return 'Excellent Focus';
    if (attention >= 0.4) return 'Good Focus';
    return 'Attention Drift Detected';
  };

  const getStatusClass = () => {
    if (attention >= 0.7) return 'bg-success/10 border-success/30 text-success';
    if (attention >= 0.4) return 'bg-primary/10 border-primary/30 text-primary';
    return 'bg-warning/10 border-warning/30 text-warning';
  };

  const Icon = getIcon();

  return (
    <div className="metric-card">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${getStatusClass()}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">AI Recommendation</p>
          <p className="text-sm font-semibold text-foreground">{getStatusText()}</p>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
        <p className="text-sm text-foreground/90 leading-relaxed">
          {recommendation || 'Analyzing your activity patterns...'}
        </p>
      </div>
    </div>
  );
}
