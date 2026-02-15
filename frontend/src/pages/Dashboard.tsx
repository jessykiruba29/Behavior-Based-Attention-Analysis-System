import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Activity,
  AlertCircle,
  Brain,
  BrainCircuit,
  Camera,
  CameraOff,
  Clock,
  Cpu,
  Download,
  Home,
  Layers,
  MousePointer2,
  Sparkles,
  Square,
  Target,
  Zap,
} from 'lucide-react';
import { AttentionOrb } from '../components/AttentionOrb';
import { MetricCard } from '../components/MetricsCard';
import { RecommendationPanel } from '../components/RecommendationPanel';
import { StatusIndicator } from '../components/StatusIndicator';
import { useAttentionTracker } from '../hooks/useAttentionTracker';

const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';

export default function Dashboard() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [showStoppedOverlay, setShowStoppedOverlay] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const {
    metrics,
    timeline,
    isConnected,
    isTracking,
    cameraEnabled,
    error,
    finalAnalysis,
    startTracking,
    stopTracking,
    enableCamera,
    disableCamera,
  } = useAttentionTracker(sessionId, { wsUrl: WS_BASE_URL, sendInterval: 500 });

  useEffect(() => {
    if (!sessionId) return;
    startTracking().catch((err) => console.error('startTracking failed', err));
  }, [sessionId, startTracking]);

  const attentionRatio = metrics.attentionScore / 100;
  const recommendation = useMemo(() => {
    if (metrics.attentionScore >= 75) return 'Maintain your current pace—focus is optimal.';
    if (metrics.attentionScore >= 55) return 'Slight variations detected. Consider a micro-break in 10 minutes.';
    if (metrics.cognitiveLoad >= 65) return 'Cognitive load rising. Reduce stimuli and refocus on a single objective.';
    return 'Attention drift detected. Re-center with breathing exercise and re-engage with the task.';
  }, [metrics.attentionScore, metrics.cognitiveLoad]);

  const timelinePreview = useMemo(() => timeline.slice(-6).reverse(), [timeline]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.max(0, Math.floor(seconds % 60));
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const handleStopRecording = useCallback(() => {
    setIsExiting(true);
    stopTracking()
      .catch((err) => console.error('stopTracking failed', err))
      .finally(() => setShowStoppedOverlay(true));
  }, [stopTracking]);

  const handleToggleCamera = useCallback(async () => {
    if (cameraEnabled) {
      disableCamera();
    } else {
      await enableCamera();
    }
  }, [cameraEnabled, disableCamera, enableCamera]);

  const handleGoHome = useCallback(() => navigate('/'), [navigate]);

  const handleExportData = useCallback(() => {
    if (!finalAnalysis) return;
    const blob = new Blob([JSON.stringify(finalAnalysis, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `session-${finalAnalysis.sessionId}.json`;
    link.click();
  }, [finalAnalysis]);

  const handleResume = useCallback(() => {
    setShowStoppedOverlay(false);
    setIsExiting(false);
    if (!sessionId) return;
    startTracking().catch((err) => console.error('resume startTracking failed', err));
  }, [sessionId, startTracking]);

  if (showStoppedOverlay) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-linear-to-br from-slate-950 via-black to-slate-900 relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-black to-gray-900 opacity-70" />
          <div className="absolute w-150 h-150 -top-32 -left-32 rounded-full bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.15),transparent_70%)] blur-3xl" />
        </div>

        <div className="consent-card text-center animate-scale-in max-w-xl w-full relative z-10 space-y-6">
          <div className="flex flex-col items-center gap-6">
            <div className="inline-flex items-center justify-center w-28 h-28 rounded-3xl bg-linear-to-br from-slate-950 to-slate-900 border border-slate-800 shadow-2xl">
              <Square className="w-14 h-14 text-yellow-400/70" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-yellow-300 via-yellow-200 to-amber-100">
                Session Complete
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Neural analytics stream safely terminated. Local buffers flushed.
              </p>
            </div>
          </div>

          {finalAnalysis ? (
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-left">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Target className="w-4 h-4 text-yellow-300" /> Peak Attention
                </div>
                <p className="mt-2 font-mono text-2xl">{finalAnalysis.peakAttention.toFixed(1)}%</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-left">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Cpu className="w-4 h-4 text-cyan-300" /> Avg Cognitive Load
                </div>
                <p className="mt-2 font-mono text-2xl">{finalAnalysis.averageCognitiveLoad.toFixed(1)}%</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-left">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Clock className="w-4 h-4 text-violet-300" /> Duration
                </div>
                <p className="mt-2 font-mono text-2xl">{formatTime(finalAnalysis.sessionDuration / 1000)}</p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-sm text-muted-foreground">
              Generating final analysis...
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={handleGoHome} className="btn-neon flex-1 gap-3 group">
              <Home className="w-5 h-5" />
              <span className="font-semibold">Return to Command</span>
            </button>
            <button onClick={handleExportData} className="btn-outline-neon flex-1 gap-3 border-slate-800 hover:border-yellow-300/40 group">
              <Download className="w-5 h-5" />
              <span className="font-medium">Export Session JSON</span>
            </button>
            <button onClick={handleResume} className="btn-outline-neon flex-1 gap-3 border-slate-800 hover:border-emerald-300/30 group">
              <Zap className="w-5 h-5" />
              <span className="font-medium">Resume Tracking</span>
            </button>
          </div>

          <p className="text-xs text-muted-foreground font-mono">
            Session ID: {sessionId?.slice(0, 12)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-foreground transition-all duration-500 ${isExiting ? 'opacity-0 scale-95' : 'opacity-100'}`}>
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Brain className="w-4 h-4 text-emerald-300" />
              Neural Attention Suite
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">Session {sessionId}</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
              <Activity className="w-4 h-4" /> Real-time attention telemetry
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <StatusIndicator isLive={isTracking} isConnected={isConnected} />
            <button
              onClick={handleToggleCamera}
              className="inline-flex items-center gap-2 rounded-full border border-slate-800 px-4 py-2 text-sm hover:border-slate-600 transition"
            >
              {cameraEnabled ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
              {cameraEnabled ? 'Disable Camera' : 'Enable Camera'}
            </button>
            <button
              onClick={handleStopRecording}
              className="inline-flex items-center gap-2 rounded-full bg-rose-600/80 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-900/40"
            >
              <Square className="w-4 h-4" /> Stop Session
            </button>
          </div>
        </header>

        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-100">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 shadow-2xl shadow-black/40 flex flex-col gap-8">
            <AttentionOrb value={attentionRatio} size={260} label="Attention" />
            <div className="grid gap-4 sm:grid-cols-2">
              <MetricCard
                icon={Target}
                label="Attention Score"
                value={metrics.attentionScore.toFixed(1)}
                unit="%"
                description="Weighted signal confidence"
              />
              <MetricCard
                icon={Layers}
                label="Cognitive Load"
                value={metrics.cognitiveLoad.toFixed(1)}
                unit="%"
                description="Blink + head movement model"
              />
            </div>
            <RecommendationPanel recommendation={recommendation} attention={attentionRatio} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <MetricCard
              icon={MousePointer2}
              label="Mouse Activity"
              value={metrics.mouseActivityRate.toFixed(0)}
              unit="%"
              description="5s activity window"
            />
            <MetricCard
              icon={Clock}
              label="Session Duration"
              value={formatTime(metrics.sessionDuration)}
              description="Live tracking"
            />
            <MetricCard
              icon={BrainCircuit}
              label="Blink Rate"
              value={metrics.blinkRate.toFixed(0)}
              unit="/ min"
              description="Smoothed last 60s"
            />
            <MetricCard
              icon={Sparkles}
              label="Head Movement"
              value={metrics.headMovement.toFixed(0)}
              unit="%"
              description="Movement vs baseline"
            />
            <MetricCard
              icon={AlertCircle}
              label="Tab Switches"
              value={metrics.tabSwitches}
              description="Since session start"
            />
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800/70 bg-slate-900/40 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Activity className="w-4 h-4" /> Telemetry Feed
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              Tab Switches: {metrics.tabSwitches}
            </div>
          </div>

          <div className="space-y-2">
            {timelinePreview.length ? (
              timelinePreview.map((entry) => (
                <div key={entry.timestamp} className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-950/30 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-400" />
                    <p className="font-mono text-xs text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex gap-6 text-sm font-mono">
                    <span>ATT {entry.attentionScore.toFixed(0)}%</span>
                    <span>COG {entry.cognitiveLoad.toFixed(0)}%</span>
                    <span>MSE {entry.mouseActivityRate.toFixed(0)}%</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Collecting baseline data...</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
