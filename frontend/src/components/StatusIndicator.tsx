interface StatusIndicatorProps {
  isLive: boolean;
  isConnected: boolean;
}

export function StatusIndicator({ isLive, isConnected }: StatusIndicatorProps) {
  if (!isLive) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
        <span className="w-2 h-2 rounded-full bg-muted-foreground" />
        Stopped
      </div>
    );
  }

  return (
    <div className={`status-live ${!isConnected ? 'opacity-70' : ''}`}>
      <span>{isConnected ? 'LIVE' : 'Connecting...'}</span>
    </div>
  );
}
