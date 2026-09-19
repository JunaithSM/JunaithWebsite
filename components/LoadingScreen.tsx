"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const IMAGES_TO_PRELOAD = [
  "/Images/backgroudn.png",
  "/Images/bakground.png",
  "/Images/shinejlogoonly.avif",
  "/Images/wideportrait.avif",
  "/Images/portraitonly.png",
  "/Images/shineJlogo.png",
  "/Images/fullname.png",
  "/Images/Logo.png",
];

const RANDOM_TEXTS = [
  "loading...",
  "wait for it...",
  "soon...",
  "almost there...",
  "brewing pixels...",
  "assembling bits...",
  "setting up...",
  "chasing ideas...",
  "preparing magic...",
];

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoPlayedFully, setIsVideoPlayedFully] = useState(false);
  const loadedCountRef = useRef(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Preload images and measure actual load progress
  useEffect(() => {
    document.body.style.overflow = "hidden";

    const total = IMAGES_TO_PRELOAD.length;
    if (total === 0) {
      setProgress(1);
      return;
    }

    const handleAssetLoad = () => {
      loadedCountRef.current += 1;
      const currentProgress = loadedCountRef.current / total;
      setProgress(currentProgress);
    };

    IMAGES_TO_PRELOAD.forEach((src) => {
      const img = new Image();
      img.src = src;

      if (img.complete) {
        handleAssetLoad();
      } else {
        img.onload = handleAssetLoad;
        img.onerror = handleAssetLoad;
      }
    });

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Cycle through random text phrases while loading
  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % RANDOM_TEXTS.length);
    }, 1600);

    return () => clearInterval(interval);
  }, [isLoading]);

  // Track video completion & continuous manual looping
  const handleVideoEnded = () => {
    setIsVideoPlayedFully(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    if (!isVideoPlayedFully && videoRef.current) {
      if (
        videoRef.current.duration &&
        videoRef.current.currentTime >= videoRef.current.duration - 0.25
      ) {
        setIsVideoPlayedFully(true);
      }
    }
  };

  const triggerLoadingComplete = () => {
    if (typeof window !== "undefined") {
      (window as any).__loadingComplete = true;
      window.dispatchEvent(new CustomEvent("loadingComplete"));
    }
  };

  // Only dismiss loading screen when BOTH conditions are met:
  // 1. All images are loaded (progress >= 1)
  // 2. Video has completed playing at least once (isVideoPlayedFully === true)
  useEffect(() => {
    if (progress >= 1 && isVideoPlayedFully) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        document.body.style.overflow = "";
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [progress, isVideoPlayedFully]);

  return (
    <AnimatePresence onExitComplete={triggerLoadingComplete}>
      {isLoading && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
          onAnimationComplete={(definition) => {
            // When exit animation finishes
            if (definition === "exit" || (typeof definition === "object" && (definition as any).opacity === 0)) {
              triggerLoadingComplete();
            }
          }}
          className="fixed inset-0 z-[9999] bg-[var(--color-bg)] flex flex-col items-center justify-center select-none px-4"
        >
          {/* Centered Loop Video Without Audio */}
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center">
            <video
              ref={videoRef}
              src="/Video/loading_transparent.webm"
              autoPlay
              muted
              playsInline
              onEnded={handleVideoEnded}
              onTimeUpdate={handleTimeUpdate}
              className="w-full h-full object-contain pointer-events-none"
            />
          </div>

          {/* Random Cycling Text */}
          <div className="h-8 mt-2 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentTextIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="text-sm sm:text-base font-instrument text-[var(--color-text-secondary)] tracking-wider text-center"
              >
                {RANDOM_TEXTS[currentTextIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Simple Linear Progress Bar (No Percentage) */}
          <div className="w-56 sm:w-72 h-1 bg-[var(--color-surface)] rounded-full overflow-hidden mt-4 relative">
            <motion.div
              className="h-full bg-[var(--color-primary)] rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${Math.min(progress * 100, 100)}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
