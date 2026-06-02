"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { motion } from "framer-motion";

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
  const [audioBlocked, setAudioBlocked] = useState(false);
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
      setIntroEnded(false);
      video.currentTime = 0;
      video.muted = false;
      video.volume = 1;

      try {
        await video.play();
      } catch {
        try {
          video.muted = true;
          video.volume = 0;
          setAudioBlocked(true);
          await video.play();
        } catch {
          setFailed(true);
          onDoorReveal();
          onIntroComplete();
        }
      }
    }

    void playIntro();
  }, [mounted, onDoorReveal, onIntroComplete, shouldPlay]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!audioBlocked) {
      return;
    }

    async function unlockAudio() {
      const video = videoRef.current;
      if (!video) {
        return;
      }

      video.muted = false;
      video.volume = 1;

      try {
        await video.play();
        setAudioBlocked(false);
      } catch {
        video.muted = true;
        video.volume = 0;
      }
    }

    document.addEventListener("pointerdown", unlockAudio, { once: true });
    document.addEventListener("keydown", unlockAudio, { once: true });

    return () => {
      document.removeEventListener("pointerdown", unlockAudio);
      document.removeEventListener("keydown", unlockAudio);
    };
  }, [audioBlocked]);

  function handleTimeUpdate() {
    const video = videoRef.current;
    if (!video || revealFiredRef.current) {
      return;
    }

    if (video.currentTime >= REVEAL_TIME_SECONDS) {
      revealFiredRef.current = true;
      onDoorReveal();
    }
  }

  function handleEnded() {
    videoRef.current?.pause();
    setIntroEnded(true);
    onIntroComplete();
  }

  function handleError() {
    setFailed(true);
    onDoorReveal();
    onIntroComplete();
  }

  return (
    <div
      className="absolute inset-0 overflow-hidden bg-pixa-black"
      aria-hidden
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
    </div>
  );
}
