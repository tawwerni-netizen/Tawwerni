"use client";

import { useState, useEffect, useRef } from "react";
import { useI18n } from "./LanguageContext";

type SoundType = "none" | "binaural" | "rain" | "whitenoise";

export default function FocusPlayer() {
  const { t, lang } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [activeSound, setActiveSound] = useState<SoundType>("none");

  // Web Audio Context for synthesized relaxing audio without external audio dependencies
  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundNodesRef = useRef<{ stop: () => void } | null>(null);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      // Play soft completion chime
      playCompletionChime();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsLeft]);

  function playCompletionChime() {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(528, ctx.currentTime); // 528Hz Solfeggio frequency (transformation and peace)
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    } catch {
      /* ignore audio error */
    }
  }

  function stopCurrentSound() {
    if (soundNodesRef.current) {
      soundNodesRef.current.stop();
      soundNodesRef.current = null;
    }
  }

  function startSound(type: SoundType) {
    stopCurrentSound();
    if (type === "none") {
      setActiveSound("none");
      return;
    }

    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      if (type === "binaural") {
        // Deep Alpha relaxation: 216Hz on Left, 226Hz on Right (10Hz Alpha difference)
        const oscL = ctx.createOscillator();
        const oscR = ctx.createOscillator();
        const merger = ctx.createChannelMerger(2);
        const masterGain = ctx.createGain();

        oscL.type = "sine";
        oscL.frequency.value = 216;
        oscR.type = "sine";
        oscR.frequency.value = 226;

        masterGain.gain.setValueAtTime(0.08, ctx.currentTime);

        oscL.connect(merger, 0, 0);
        oscR.connect(merger, 0, 1);
        merger.connect(masterGain);
        masterGain.connect(ctx.destination);

        oscL.start();
        oscR.start();

        soundNodesRef.current = {
          stop: () => {
            try {
              oscL.stop();
              oscR.stop();
            } catch {
              /* ignore */
            }
          },
        };
      } else if (type === "whitenoise" || type === "rain") {
        // Synthesize soft filtered noise
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          // Pink / Brown noise filter for soft calming sound
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = type === "rain" ? "bandpass" : "lowpass";
        filter.frequency.value = type === "rain" ? 800 : 400;

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.06, ctx.currentTime);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        noise.start();
        soundNodesRef.current = {
          stop: () => {
            try {
              noise.stop();
            } catch {
              /* ignore */
            }
          },
        };
      }

      setActiveSound(type);
    } catch {
      setActiveSound("none");
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCurrentSound();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <>
      {/* Floating launcher button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={t.focusMode}
        title={t.focusMode}
        className="fixed bottom-24 right-5 z-40 flex items-center gap-2 rounded-full border border-teal-500/30 bg-neutral-900/90 text-teal-300 px-3.5 py-2.5 text-xs font-bold shadow-xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 hover:border-teal-400"
      >
        <span className="text-base animate-pulse">🧘‍♂️</span>
        <span className="hidden sm:inline">{isRunning ? timeFormatted : t.focusMode}</span>
      </button>

      {/* Focus Modal / Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-teal-500/20 bg-neutral-950 p-6 text-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🧘‍♂️</span>
                <div>
                  <h3 className="text-base font-bold text-teal-400">{t.focusMode}</h3>
                  <p className="text-xs text-neutral-400">{t.pomodoro}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Big Timer Circle */}
            <div className="my-8 flex flex-col items-center justify-center">
              <div className="relative w-44 h-44 rounded-full border-4 border-teal-500/20 flex flex-col items-center justify-center bg-teal-950/20 shadow-inner">
                <span className="text-4xl font-extrabold tracking-wider font-mono text-teal-300">
                  {timeFormatted}
                </span>
                <span className="text-xs text-neutral-400 mt-1">
                  {isRunning ? (lang === "ar" ? "جلسة تركيز جارية" : "Deep Focus") : (lang === "ar" ? "مستعد للبدء؟" : "Ready to focus?")}
                </span>
              </div>

              {/* Controls */}
              <div className="mt-6 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsRunning(!isRunning)}
                  className={`px-6 py-2.5 rounded-full font-bold text-sm transition-transform active:scale-95 shadow-md ${
                    isRunning
                      ? "bg-amber-600 hover:bg-amber-500 text-white"
                      : "bg-teal-500 hover:bg-teal-400 text-neutral-950"
                  }`}
                >
                  {isRunning ? (lang === "ar" ? "إيقاف مؤقت ⏸" : "Pause ⏸") : (lang === "ar" ? "ابدأ التركيز ▶" : "Start ▶")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsRunning(false);
                    setSecondsLeft(25 * 60);
                  }}
                  className="px-4 py-2.5 rounded-full text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                >
                  {lang === "ar" ? "إعادة ضبط" : "Reset"}
                </button>
              </div>
            </div>

            {/* Ambient Sound Selection */}
            <div className="border-t border-neutral-800 pt-4">
              <div className="text-xs font-bold text-neutral-300 mb-3 flex items-center gap-1.5">
                <span>🎧</span>
                <span>{t.ambientSounds}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => startSound(activeSound === "binaural" ? "none" : "binaural")}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-colors ${
                    activeSound === "binaural"
                      ? "border-teal-500 bg-teal-950/60 text-teal-300 font-bold"
                      : "border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:bg-neutral-800"
                  }`}
                >
                  <span>🧠 {t.binauralWaves}</span>
                  {activeSound === "binaural" && <span className="text-teal-400 animate-pulse">●</span>}
                </button>

                <button
                  type="button"
                  onClick={() => startSound(activeSound === "rain" ? "none" : "rain")}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-colors ${
                    activeSound === "rain"
                      ? "border-teal-500 bg-teal-950/60 text-teal-300 font-bold"
                      : "border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:bg-neutral-800"
                  }`}
                >
                  <span>🌧️ {t.rainSound}</span>
                  {activeSound === "rain" && <span className="text-teal-400 animate-pulse">●</span>}
                </button>

                <button
                  type="button"
                  onClick={() => startSound(activeSound === "whitenoise" ? "none" : "whitenoise")}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-colors ${
                    activeSound === "whitenoise"
                      ? "border-teal-500 bg-teal-950/60 text-teal-300 font-bold"
                      : "border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:bg-neutral-800"
                  }`}
                >
                  <span>💨 {t.whiteNoise}</span>
                  {activeSound === "whitenoise" && <span className="text-teal-400 animate-pulse">●</span>}
                </button>

                <button
                  type="button"
                  onClick={() => startSound("none")}
                  className={`flex items-center justify-center p-2.5 rounded-xl border text-xs transition-colors ${
                    activeSound === "none"
                      ? "border-neutral-700 bg-neutral-800 text-neutral-200"
                      : "border-neutral-800 bg-neutral-900/40 text-neutral-500 hover:bg-neutral-800"
                  }`}
                >
                  <span>🔇 {t.soundOff}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
