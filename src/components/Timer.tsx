import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function formatMs(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${pad(minutes)}:${pad(seconds)}`;
}

export const Timer: React.FC = () => {
  const [minutes, setMinutes] = useState(2);
  const [seconds, setSeconds] = useState(0);
  const [autoRepeat, setAutoRepeat] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [remainingMs, setRemainingMs] = useState(0);

  const targetRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const durationMs = useMemo(() => Math.max(1000, (minutes * 60 + seconds) * 1000), [minutes, seconds]);
  const progress = useMemo(() => 1 - Math.min(1, remainingMs / durationMs), [remainingMs, durationMs]);

  useEffect(() => {
    if (!isRunning) return;

    if (targetRef.current == null) {
      targetRef.current = performance.now() + durationMs;
      setRemainingMs(durationMs);
    }

    const tick = () => {
      const now = performance.now();
      const remaining = (targetRef.current ?? now) - now;
      setRemainingMs(Math.max(0, remaining));

      if (remaining <= 0) {
        // interval ended
        setCycles((c) => c + 1);
        pulseFeedback();
        if (autoRepeat) {
          targetRef.current = performance.now() + durationMs;
          setRemainingMs(durationMs);
        } else {
          setIsRunning(false);
          targetRef.current = null;
          return;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isRunning, durationMs, autoRepeat]);

  function start() {
    if (isRunning) return;
    targetRef.current = performance.now() + durationMs;
    setRemainingMs(durationMs);
    setIsRunning(true);
  }

  function pause() {
    if (!isRunning) return;
    setIsRunning(false);
    targetRef.current = null;
  }

  function reset() {
    setIsRunning(false);
    setCycles(0);
    targetRef.current = null;
    setRemainingMs(durationMs);
  }

  function pulseFeedback() {
    try {
      if (navigator?.vibrate) navigator.vibrate(150);
      // Simple beep
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = 880;
      o.connect(g);
      g.connect(ctx.destination);
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
      o.start();
      o.stop(ctx.currentTime + 0.22);
    } catch {}
  }

  // Progress ring geometry
  const radius = 96;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const dashOffset = circumference * (1 - progress);

  return (
    <Card className="max-w-xl mx-auto shadow-lg" style={{}}>
      <CardHeader>
        <CardTitle className="text-2xl">Interval Timer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="relative mx-auto">
            <div className="absolute inset-0 rounded-full blur-2xl opacity-30" style={{ background: "var(--gradient-hero)" }} />
            <svg height={(radius + stroke) * 2} width={(radius + stroke) * 2} className="relative">
              <circle
                stroke="hsl(var(--muted))"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius + stroke}
                cy={radius + stroke}
              />
              <circle
                stroke="hsl(var(--brand))"
                fill="transparent"
                strokeLinecap="round"
                strokeWidth={stroke}
                strokeDasharray={`${circumference} ${circumference}`}
                style={{ strokeDashoffset: dashOffset, transition: "stroke-dashoffset 200ms linear" }}
                r={normalizedRadius}
                cx={radius + stroke}
                cy={radius + stroke}
              />
              <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="fill-current" style={{ fontSize: 28 }}>
                {formatMs(remainingMs || durationMs)}
              </text>
            </svg>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minutes">Minutes</Label>
                <Input
                  id="minutes"
                  type="number"
                  min={0}
                  max={180}
                  value={minutes}
                  onChange={(e) => setMinutes(Math.max(0, Math.min(180, Number(e.target.value) || 0)))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seconds">Seconds</Label>
                <Input
                  id="seconds"
                  type="number"
                  min={0}
                  max={59}
                  value={seconds}
                  onChange={(e) => setSeconds(Math.max(0, Math.min(59, Number(e.target.value) || 0)))}
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-md border p-3">
              <div className="space-y-1">
                <Label className="text-sm">Auto-repeat</Label>
                <p className="text-xs text-muted-foreground">Restart interval automatically</p>
              </div>
              <Switch checked={autoRepeat} onCheckedChange={(v) => setAutoRepeat(v)} />
            </div>

            <div className="flex flex-wrap gap-3">
              {!isRunning ? (
                <Button variant="hero" onClick={start}>Start</Button>
              ) : (
                <Button variant="secondary" onClick={pause}>Pause</Button>
              )}
              <Button variant="outline" onClick={reset}>Reset</Button>
              <div className="ml-auto text-sm text-muted-foreground self-center">Cycles: <span className="font-medium text-foreground">{cycles}</span></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Timer;
