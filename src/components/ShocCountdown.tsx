// app/components/ShocCountdown.tsx
"use client";
import { useEffect, useMemo, useState } from "react";

type CountdownProps = {
  /** ISO con zona horaria. Ej: "2025-09-21T08:00:00-03:00" */
  targetISO: string;
  /** (Opcional) callback al llegar a 0 */
  onFinish?: () => void;
  /** (Opcional) punto de inicio para calcular el % de progreso del tiempo */
  progressStartISO?: string; // Ej: "2025-09-07T00:00:00-03:00"
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function ShocCountdown({
  targetISO,
  onFinish,
  progressStartISO,
}: CountdownProps) {
  const target = useMemo(() => new Date(targetISO).getTime(), [targetISO]);
  const progressStart = useMemo(
    () => (progressStartISO ? new Date(progressStartISO).getTime() : null),
    [progressStartISO]
  );

  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const msLeft = Math.max(target - now, 0);
  const totalSec = Math.floor(msLeft / 1000);
  const days = Math.floor(totalSec / (3600 * 24));
  const hours = Math.floor((totalSec % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  useEffect(() => {
    if (msLeft === 0 && onFinish) onFinish();
  }, [msLeft, onFinish]);

  // Progreso del tiempo hacia el cierre (opcional)
  let timeProgressPct: number | null = null;
  if (progressStart) {
    const totalWindow = target - progressStart;
    const elapsed = Math.min(Math.max(now - progressStart, 0), totalWindow);
    timeProgressPct = totalWindow > 0 ? Math.round((elapsed / totalWindow) * 100) : 100;
  }

  return (
    <div className="max-w-4xl mx-auto text-center">
      {/* Etiqueta */}
      <div className="inline-flex items-center gap-2 rounded-full bg-yellow-500/15 text-yellow-300 px-3 py-1 text-xs font-medium mb-4">
        <span className="i-lucide:zap h-4 w-4" aria-hidden />
        Cierre: Dom 21/09 – 08:00
      </div>

      {/* Dígitos */}
      <div
        className="grid grid-cols-4 gap-3 md:gap-4 items-stretch justify-center mb-6"
        role="timer"
        aria-live="polite"
        aria-label="Cuenta regresiva al cierre de inscripciones"
      >
        <Digit label="Días" value={String(days)} />
        <Digit label="Horas" value={pad(hours)} />
        <Digit label="Min" value={pad(minutes)} />
        <Digit label="Seg" value={pad(seconds)} />
      </div>

      {/* Barra de progreso de tiempo (opcional si definís progressStartISO) */}
      {timeProgressPct !== null && (
        <div className="max-w-lg mx-auto">
          <div className="flex justify-between text-xs text-zinc-400 mb-1">
            <span>Tiempo hacia el cierre</span>
            <span>{timeProgressPct}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-[width] duration-500"
              style={{ width: `${timeProgressPct}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Digit({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 px-3 py-3 md:px-4 md:py-4 backdrop-blur-sm">
      <div className="font-mono text-2xl md:text-4xl lg:text-5xl font-semibold text-white tracking-wider tabular-nums">
        {value}
      </div>
      <div className="mt-1 text-[10px] md:text-xs uppercase tracking-wide text-zinc-400">
        {label}
      </div>
    </div>
  );
}
