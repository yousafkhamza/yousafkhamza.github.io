import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * One line of a split-flap (Solari) board. When the text changes every cell
 * rattles through random characters and lands on its letter, left to right,
 * like the departures board in an old terminal. Respects reduced motion.
 */
const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const TICK = 55;

const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const pad = (t: string, len: number) => t.slice(0, len).padEnd(len, " ");

/** what a real board does with a long name: abbreviate, then drop whole words, never cut one in half */
const fit = (t: string, len: number) => {
  let s = t.toUpperCase().replace(/\s+/g, " ").trim();
  if (s.length > len) s = s.replace(/\bSENIOR\b/g, "SR").replace(/\bENGINEER(ING)?\b/g, "ENG").replace(/[()]/g, "");
  if (s.length > len) {
    const words = s.split(" ");
    while (words.length > 1 && words.join(" ").length > len) words.pop();
    s = words.join(" ");
  }
  return pad(s, len);
};

/* ---- optional clack, synthesised (no audio file), off until the visitor turns it on ---- */
let audio: AudioContext | null = null;
let noise: AudioBuffer | null = null;
let soundOn = false;
let lastClack = 0;

export const setFlapSound = (on: boolean) => {
  soundOn = on;
  if (!on) return;
  try {
    if (!audio) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audio = new Ctx();
      const len = Math.floor(audio.sampleRate * 0.014);
      noise = audio.createBuffer(1, len, audio.sampleRate);
      const d = noise.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    }
    void audio.resume();
  } catch {
    soundOn = false;
  }
};

const clack = () => {
  if (!soundOn || !audio || !noise) return;
  const now = audio.currentTime;
  if (now - lastClack < 0.03) return;
  lastClack = now;
  const src = audio.createBufferSource();
  src.buffer = noise;
  const band = audio.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 1800 + Math.random() * 1600;
  const gain = audio.createGain();
  gain.gain.value = 0.22;
  src.connect(band).connect(gain).connect(audio.destination);
  src.start();
};

interface FlapProps {
  text: string;
  len: number;
  /** ms before this line starts flipping: rows go one after another */
  delay?: number;
  className?: string;
}

const SplitFlap = ({ text, len, delay = 0, className }: FlapProps) => {
  const target = fit(text, len);
  const [shown, setShown] = useState(() => (prefersReduced() ? target : " ".repeat(len)));
  const [ver, setVer] = useState<number[]>(() => Array(len).fill(0));
  const shownRef = useRef(shown);
  shownRef.current = shown;

  useEffect(() => {
    if (prefersReduced()) {
      setShown(target);
      return;
    }
    const from = pad(shownRef.current, len);
    // how many random flips each cell makes before it lands: a left-to-right sweep with jitter
    const left = Array.from({ length: len }, (_, i) =>
      from[i] === target[i] ? 0 : 3 + Math.floor(Math.random() * 6) + Math.floor(i * 0.3)
    );
    let iv: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      iv = setInterval(() => {
        const cur = pad(shownRef.current, len).split("");
        const changed: number[] = [];
        for (let i = 0; i < len; i++) {
          if (left[i] > 0) {
            left[i]--;
            cur[i] = left[i] === 0 ? target[i] : CHARSET[Math.floor(Math.random() * CHARSET.length)];
            changed.push(i);
          }
        }
        if (!changed.length) {
          clearInterval(iv);
          return;
        }
        clack();
        const next = cur.join("");
        shownRef.current = next;
        setShown(next);
        setVer((v) => {
          const n = v.length === len ? [...v] : Array(len).fill(0);
          changed.forEach((i) => n[i]++);
          return n;
        });
      }, TICK);
    }, delay);
    return () => {
      clearTimeout(start);
      if (iv) clearInterval(iv);
    };
  }, [target, len, delay]);

  const cells = pad(shown, len).split("");
  return (
    <span className={cn("flap-line", className)} aria-hidden>
      {cells.map((ch, i) => (
        <span key={i} className="flap-cell">
          <span key={ver[i] ?? 0} className="flap-char">
            {ch === " " ? " " : ch}
          </span>
        </span>
      ))}
    </span>
  );
};

export default SplitFlap;
