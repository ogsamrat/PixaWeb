"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { motion } from "framer-motion";
import { ChevronsDown } from "lucide-react";

type HeroVideoProps = {
  shouldPlay: boolean;
  onDoorReveal: () => void;
  onIntroComplete: () => void;
};

const REVEAL_TIME_SECONDS = 7.5;

export function HeroVideo({
  shouldPlay,
  onDoorReveal,
  onIntroComplete,
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const revealFiredRef = useRef(false);
  const startedRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [introEnded, setIntroEnded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !mounted || !shouldPlay || startedRef.current) {
      return;
    }

    async function playIntro() {
      if (!video) {
        return;
      }

      startedRef.current = true;
      revealFiredRef.current = false;
      setFailed(false);
      setRevealed(false);
      setIntroEnded(false);
      video.currentTime = 0;
      video.muted = true;
      video.volume = 0;

      try {
        await video.play();
      } catch {
        setFailed(true);
        setRevealed(true);
        onDoorReveal();
        onIntroComplete();
      }
    }

    void playIntro();
  }, [mounted, onDoorReveal, onIntroComplete, shouldPlay]);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleTimeUpdate() {
    const video = videoRef.current;
    if (!video || revealFiredRef.current) {
      return;
    }

    if (video.currentTime >= REVEAL_TIME_SECONDS) {
      revealFiredRef.current = true;
      setRevealed(true);
      onDoorReveal();
    }
  }

  function handleEnded() {
    videoRef.current?.pause();
    setIntroEnded(true);
    onIntroComplete();
  }

  function handleSkip() {
    const video = videoRef.current;

    if (video) {
      video.pause();
    }

    revealFiredRef.current = true;
    setRevealed(true);
    setIntroEnded(true);
    onDoorReveal();
    onIntroComplete();
  }

  function handleError() {
    setFailed(true);
    setRevealed(true);
    onDoorReveal();
    onIntroComplete();
  }

  return (
    <div
      className="absolute inset-0 overflow-hidden bg-pixa-black"
      suppressHydrationWarning
    >
      <div
        className={clsx(
          "vault-fallback absolute inset-0 transition-opacity duration-1000",
          failed || !introEnded ? "opacity-100" : "opacity-0",
        )}
      />
      <Image
        src="/assets/pixa-bg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className={clsx(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000",
          introEnded && !failed ? "opacity-100" : "opacity-0",
        )}
      />
      {mounted ? (
        <video
          ref={videoRef}
          className={clsx(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000",
            failed || introEnded ? "opacity-0" : "opacity-100",
          )}
          preload="auto"
          playsInline
          muted
          aria-hidden
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onError={handleError}
        >
          <source src="/assets/pixa-intro.mp4" type="video/mp4" />
        </video>
      ) : null}

      {mounted ? (
        <motion.div
          className="absolute left-1/2 top-0 h-full w-px bg-white/50 shadow-[0_0_80px_rgba(255,255,255,0.42)]"
          initial={{ opacity: 0, scaleY: 0.2 }}
          animate={{
            opacity: shouldPlay ? [0, 0.15, 0.75, 0.16] : 0,
            scaleY: shouldPlay ? [0.2, 0.55, 1, 0.88] : 0.2,
          }}
          transition={{ duration: 7.7, ease: [0.16, 1, 0.3, 1] }}
        />
      ) : null}
      <div className="light-beam left-[10%] top-[28%]" />
      <div className="cinematic-vignette" />
      <div className="grain-overlay" />
      {mounted && shouldPlay && !revealed && !introEnded && !failed ? (
        <motion.button
          type="button"
          aria-label="Skip intro"
          onClick={handleSkip}
          className="absolute bottom-20 left-1/2 z-20 grid h-11 w-11 -translate-x-1/2 place-items-center rounded-full border border-white/15 bg-black/35 text-pixa-secondary shadow-silver backdrop-blur-md transition duration-500 ease-cinematic hover:border-white/35 hover:bg-white/[0.06] hover:text-pixa-white focus:outline-none focus:ring-2 focus:ring-white/35 sm:bottom-6 sm:h-10 sm:w-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <ChevronsDown className="h-4 w-4" aria-hidden />
        </motion.button>
      ) : null}
    </div>
  );
}
