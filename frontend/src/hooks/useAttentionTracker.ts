import { useCallback, useEffect, useRef, useState } from "react";

type TrackerOptions = {
  wsUrl: string;
  sendInterval?: number;
};

type AttentionMetrics = {
  attentionScore: number;
  cognitiveLoad: number;
  mouseActivityRate: number;
  tabSwitches: number;
  sessionDuration: number;
  blinkRate: number;
  headMovement: number;
  isFaceDetected: boolean;
  isEyesDetected: boolean;
};

type TimelineEntry = AttentionMetrics & {
  timestamp: number;
};

type FinalAnalysis = {
  sessionId: string;
  averageAttention: number;
  averageCognitiveLoad: number;
  peakAttention: number;
  sessionDuration: number;
};

declare global {
  interface Window {
    cv: any;
  }
}

const INITIAL_METRICS: AttentionMetrics = {
  attentionScore: 0,
  cognitiveLoad: 0,
  mouseActivityRate: 0,
  tabSwitches: 0,
  sessionDuration: 0,
  blinkRate: 0,
  headMovement: 0,
  isFaceDetected: false,
  isEyesDetected: false,
};

const FRAME_INTERVAL_MS = 100; // ~10 FPS
const EMA_ALPHA = 0.35;
const MOUSE_WINDOW_MS = 5000;
const BLINK_WINDOW_MS = 60000;
const TIMELINE_LIMIT = 240;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function useAttentionTracker(
  sessionId: string | undefined,
  { wsUrl, sendInterval = 500 }: TrackerOptions
) {
  const [metrics, setMetrics] = useState<AttentionMetrics>(INITIAL_METRICS);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [finalAnalysis, setFinalAnalysis] = useState<FinalAnalysis | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const rafRef = useRef<number | null>(null);
  const sendIntervalRef = useRef<number | null>(null);

  const faceClassifierRef = useRef<any>(null);
  const eyeClassifierRef = useRef<any>(null);
  const cascadesLoadedRef = useRef(false);

  const mouseEventsRef = useRef<number[]>([]);
  const blinkEventsRef = useRef<number[]>([]);
  const blinkStartRef = useRef<number | null>(null);
  const eyesOpenRef = useRef(true);
  const tabSwitchesRef = useRef(0);
  const lastFaceCenterRef = useRef<{ x: number; y: number } | null>(null);
  const sessionStartRef = useRef<number | null>(null);
  const isTrackingRef = useRef(false);
  const cameraEnabledRef = useRef(false);
  const lastFrameTimeRef = useRef(0);

  const metricsRef = useRef<AttentionMetrics>(INITIAL_METRICS);
  const timelineRef = useRef<TimelineEntry[]>([]);

  const waitForCvReady = useCallback(() => {
    return new Promise<void>((resolve) => {
      if (window.cv && window.cv.FS_createDataFile) {
        resolve();
        return;
      }
      window.cv = window.cv || {};
      const previous = window.cv.onRuntimeInitialized;
      window.cv.onRuntimeInitialized = () => {
        previous?.();
        resolve();
      };
    });
  }, []);

  const loadCascade = useCallback(async (url: string, filename: string) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Unable to load cascade ${filename}`);
    const data = new Uint8Array(await response.arrayBuffer());
    try {
      window.cv.FS_createDataFile("/", filename, data, true, false, false);
    } catch (_) {
      // ignore if file already exists
    }
  }, []);

  const initOpenCV = useCallback(async () => {
    if (cascadesLoadedRef.current) return;
    if (!window.cv) throw new Error("OpenCV.js not found. Ensure the script is loaded.");

    await waitForCvReady();
    await loadCascade("/cascades/haarcascade_frontalface_default.xml", "face.xml");
    await loadCascade("/cascades/haarcascade_eye.xml", "eye.xml");

    const faceClassifier = new window.cv.CascadeClassifier();
    faceClassifier.load("face.xml");
    faceClassifierRef.current = faceClassifier;

    const eyeClassifier = new window.cv.CascadeClassifier();
    eyeClassifier.load("eye.xml");
    eyeClassifierRef.current = eyeClassifier;

    cascadesLoadedRef.current = true;
  }, [loadCascade, waitForCvReady]);

  const ensureVideoElements = useCallback(async () => {
    if (cameraEnabledRef.current) return;
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });

    const video = document.createElement("video");
    video.autoplay = true;
    video.playsInline = true;
    video.muted = true;
    video.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0;pointer-events:none;";
    video.srcObject = stream;
    document.body.appendChild(video);

    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    canvas.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0;pointer-events:none;";
    document.body.appendChild(canvas);

    await video.play();

    videoRef.current = video;
    canvasRef.current = canvas;
    streamRef.current = stream;
    cameraEnabledRef.current = true;
    setCameraEnabled(true);
  }, []);

  const disableCamera = useCallback(() => {
    cameraEnabledRef.current = false;
    setCameraEnabled(false);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    videoRef.current?.remove();
    videoRef.current = null;
    canvasRef.current?.remove();
    canvasRef.current = null;
  }, []);

  const connectWS = useCallback(() => {
    if (!sessionId) return;
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    const ws = new WebSocket(`${wsUrl}/ws/attention/${sessionId}`);
    wsRef.current = ws;
    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => {
      if (wsRef.current === ws) {
        wsRef.current = null;
      }
      setIsConnected(false);
    };
    ws.onerror = () => setError("WebSocket error");
  }, [sessionId, wsUrl]);

  const disconnectWS = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const updateMetrics = useCallback((partial: Partial<AttentionMetrics>) => {
    setMetrics((prev) => {
      const next: AttentionMetrics = { ...prev };
      (Object.keys(partial) as (keyof AttentionMetrics)[]).forEach((key) => {
        const value = partial[key];
        if (value === undefined) return;

        if (key === "isFaceDetected" || key === "isEyesDetected") {
          next[key] = value as AttentionMetrics[typeof key];
          return;
        }

        if (key === "tabSwitches" || key === "sessionDuration") {
          next[key] = value as AttentionMetrics[typeof key];
          return;
        }

        const previous = prev[key] as number;
        const target = value as number;
        next[key] = (previous + EMA_ALPHA * (target - previous)) as AttentionMetrics[typeof key];
      });

      metricsRef.current = next;
      return next;
    });
  }, []);

  const recordSnapshot = useCallback(() => {
    if (!sessionId) return;
    const timestamp = Date.now();
    const snapshot: TimelineEntry = { ...metricsRef.current, timestamp };
    setTimeline((prev) => {
      const next = [...prev, snapshot];
      const trimmed = next.length > TIMELINE_LIMIT ? next.slice(next.length - TIMELINE_LIMIT) : next;
      timelineRef.current = trimmed;
      return trimmed;
    });

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ sessionId, ...snapshot }));
    }
  }, [sessionId]);

  const startMetricPump = useCallback(() => {
    if (sendIntervalRef.current) return;
    recordSnapshot();
    sendIntervalRef.current = window.setInterval(recordSnapshot, sendInterval);
  }, [recordSnapshot, sendInterval]);

  const stopMetricPump = useCallback(() => {
    if (sendIntervalRef.current) {
      clearInterval(sendIntervalRef.current);
      sendIntervalRef.current = null;
    }
  }, []);

  const processFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2 || !faceClassifierRef.current) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth || canvas.width;
    canvas.height = video.videoHeight || canvas.height;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const src = window.cv.imread(canvas);
    const gray = new window.cv.Mat();
    const faces = new window.cv.RectVector();
    const eyesVec = new window.cv.RectVector();

    try {
      window.cv.cvtColor(src, gray, window.cv.COLOR_RGBA2GRAY);
      faceClassifierRef.current.detectMultiScale(gray, faces, 1.15, 5, 0);

      let isFaceDetected = false;
      let isEyesDetected = false;
      let headMovementRaw = 0;

      if (faces.size() > 0) {
        isFaceDetected = true;
        const faceRect = faces.get(0);
        const center = {
          x: faceRect.x + faceRect.width / 2,
          y: faceRect.y + faceRect.height / 2,
        };

        if (lastFaceCenterRef.current) {
          const dx = center.x - lastFaceCenterRef.current.x;
          const dy = center.y - lastFaceCenterRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          headMovementRaw = dist / Math.max(faceRect.width, 1);
        }
        lastFaceCenterRef.current = center;

        if (eyeClassifierRef.current) {
          const roi = gray.roi(faceRect);
          eyeClassifierRef.current.detectMultiScale(roi, eyesVec, 1.1, 3, 0);
          isEyesDetected = eyesVec.size() >= 1;
          roi.delete();
        } else {
          isEyesDetected = true;
        }
      } else {
        lastFaceCenterRef.current = null;
      }

      const now = Date.now();

      if (eyesOpenRef.current && !isEyesDetected) {
        blinkStartRef.current = now;
      }
      if (!eyesOpenRef.current && isEyesDetected && blinkStartRef.current) {
        const duration = now - blinkStartRef.current;
        if (duration > 60 && duration < 800) {
          blinkEventsRef.current.push(now);
        }
        blinkStartRef.current = null;
      }
      eyesOpenRef.current = isEyesDetected;

      blinkEventsRef.current = blinkEventsRef.current.filter((ts) => now - ts <= BLINK_WINDOW_MS);
      mouseEventsRef.current = mouseEventsRef.current.filter((ts) => now - ts <= MOUSE_WINDOW_MS);

      const blinkRate = blinkEventsRef.current.length;
      const mouseMovesPerSecond = mouseEventsRef.current.length / (MOUSE_WINDOW_MS / 1000);
      const mouseActivityPercent = clamp((mouseMovesPerSecond / 8) * 100, 0, 100);
      const headMovementPercent = clamp(headMovementRaw * 200, 0, 100);

      const attentionScoreRaw = clamp(
        40 +
          (isFaceDetected ? 25 : -30) +
          (isEyesDetected ? 15 : -10) +
          (mouseActivityPercent - 50) * 0.2 -
          headMovementPercent * 0.3 -
          (document.hidden ? 20 : 0),
        0,
        100
      );

      const blinkDeviation = Math.abs(blinkRate - 15);
      const blinkStress = clamp(blinkDeviation / 15, 0, 1);
      const headStress = headMovementPercent / 100;
      const cognitiveLoadRaw = clamp(35 + blinkStress * 35 + headStress * 30, 5, 100);

      const sessionDuration = sessionStartRef.current
        ? (now - sessionStartRef.current) / 1000
        : 0;

      updateMetrics({
        attentionScore: attentionScoreRaw,
        cognitiveLoad: cognitiveLoadRaw,
        mouseActivityRate: mouseActivityPercent,
        blinkRate,
        headMovement: headMovementPercent,
        isFaceDetected,
        isEyesDetected,
        tabSwitches: tabSwitchesRef.current,
        sessionDuration,
      });
    } finally {
      src.delete();
      gray.delete();
      faces.delete();
      eyesVec.delete();
    }
  }, [updateMetrics]);

  const frameLoop = useCallback(
    (timestamp: number) => {
      if (!isTrackingRef.current) return;
      rafRef.current = requestAnimationFrame(frameLoop);
      if (timestamp - lastFrameTimeRef.current < FRAME_INTERVAL_MS) return;
      lastFrameTimeRef.current = timestamp;
      if (!cameraEnabledRef.current) return;
      processFrame();
    },
    [processFrame]
  );

  const startFrameLoop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    lastFrameTimeRef.current = 0;
    rafRef.current = requestAnimationFrame(frameLoop);
  }, [frameLoop]);

  const stopFrameLoop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const resetTrackingState = useCallback(() => {
    metricsRef.current = INITIAL_METRICS;
    setMetrics(INITIAL_METRICS);
    timelineRef.current = [];
    setTimeline([]);
    mouseEventsRef.current = [];
    blinkEventsRef.current = [];
    blinkStartRef.current = null;
    eyesOpenRef.current = true;
    tabSwitchesRef.current = 0;
    lastFaceCenterRef.current = null;
    setFinalAnalysis(null);
  }, []);

  const startTracking = useCallback(async () => {
    if (!sessionId) {
      setError("Missing session id");
      return;
    }
    if (isTrackingRef.current) return;

    setError(null);
    resetTrackingState();

    try {
      await initOpenCV();
      await ensureVideoElements();
      connectWS();
      sessionStartRef.current = Date.now();
      isTrackingRef.current = true;
      setIsTracking(true);
      startFrameLoop();
      startMetricPump();
    } catch (err) {
      isTrackingRef.current = false;
      setIsTracking(false);
      disableCamera();
      disconnectWS();
      throw err;
    }
  }, [connectWS, disableCamera, disconnectWS, ensureVideoElements, initOpenCV, resetTrackingState, sessionId, startFrameLoop, startMetricPump]);

  const stopTracking = useCallback(async () => {
    if (!isTrackingRef.current) return;
    isTrackingRef.current = false;
    setIsTracking(false);
    stopFrameLoop();
    stopMetricPump();
    disableCamera();
    disconnectWS();

    const timelineSnapshot = timelineRef.current;
    if (!timelineSnapshot.length || !sessionId) return;

    const duration = sessionStartRef.current
      ? Date.now() - sessionStartRef.current
      : 0;
    const attentionAvg =
      timelineSnapshot.reduce((sum, entry) => sum + entry.attentionScore, 0) /
      timelineSnapshot.length;
    const cognitiveAvg =
      timelineSnapshot.reduce((sum, entry) => sum + entry.cognitiveLoad, 0) /
      timelineSnapshot.length;
    const peakAttention = timelineSnapshot.reduce(
      (peak, entry) => Math.max(peak, entry.attentionScore),
      0
    );

    setFinalAnalysis({
      sessionId,
      averageAttention: attentionAvg,
      averageCognitiveLoad: cognitiveAvg,
      peakAttention,
      sessionDuration: duration,
    });
  }, [disconnectWS, disableCamera, sessionId, stopFrameLoop, stopMetricPump]);

  useEffect(() => {
    const handleMouseMove = () => {
      if (!isTrackingRef.current) return;
      mouseEventsRef.current.push(Date.now());
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && isTrackingRef.current) {
        tabSwitchesRef.current += 1;
        updateMetrics({ tabSwitches: tabSwitchesRef.current });
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [updateMetrics]);

  useEffect(() => {
    return () => {
      stopTracking().catch(() => undefined);
    };
  }, [stopTracking]);

  return {
    metrics,
    timeline,
    isConnected,
    isTracking,
    cameraEnabled,
    error,
    finalAnalysis,
    startTracking,
    stopTracking,
    enableCamera: ensureVideoElements,
    disableCamera,
  };
}
