"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import About from "./About";
import { AnimatedCharacters, AnimatedSvgText } from "./ui/AnimatedText";

const subscribeResize = (callback: () => void) => {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
};

const getIsMobileSnapshot = () => window.innerWidth < 768;
const getServerMobileSnapshot = () => false;

function useIsMobile() {
  return useSyncExternalStore(subscribeResize, getIsMobileSnapshot, getServerMobileSnapshot);
}

const subscribeMounted = () => () => {};
const getMountedSnapshot = () => true;
const getServerMountedSnapshot = () => false;

function useIsMounted() {
  return useSyncExternalStore(subscribeMounted, getMountedSnapshot, getServerMountedSnapshot);
}

export default function Hero() {
  const desktopContainerRef = useRef<HTMLDivElement>(null);
  const mounted = useIsMounted();
  const isMobile = useIsMobile();

  // Trigger animations only after loading screen has completely finished and unmounted
  const [isLoadedReady, setIsLoadedReady] = useState(() => {
    if (typeof window !== "undefined" && (window as any).__loadingComplete) {
      return true;
    }
    return false;
  });

  useEffect(() => {
    if (isLoadedReady) return;

    const handleLoadingComplete = () => {
      setIsLoadedReady(true);
    };

    window.addEventListener("loadingComplete", handleLoadingComplete);
    return () => window.removeEventListener("loadingComplete", handleLoadingComplete);
  }, [isLoadedReady]);

  const { scrollYProgress } = useScroll({
    target: desktopContainerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 22,
    restDelta: 0.001,
  });

  const heroX = useTransform(smoothProgress, [0, 1], ["0%", "-100%"]);
  const aboutX = useTransform(smoothProgress, [0, 1], ["100%", "0%"]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.4], [1, 0]);
  const aboutBgOpacity = useTransform(smoothProgress, [0.1, 0.6], [0, 1]);

  // Single-scroll snap trigger on desktop
  useEffect(() => {
    if (!mounted || isMobile) return;

    let isSnapping = false;

    const handleWheel = (e: WheelEvent) => {
      const container = desktopContainerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;
      const currentScrollY = window.scrollY;
      const containerTop = currentScrollY + rect.top;

      // If active inside the desktop hero sticky section
      if (rect.top <= 20 && rect.bottom >= window.innerHeight - 20) {
        const relativeScroll = currentScrollY - containerTop;
        const progress = relativeScroll / (scrollableDistance || 1);

        if (!isSnapping) {
          // Single scroll DOWN -> snap smoothly to About section
          if (e.deltaY > 0 && progress < 0.6) {
            e.preventDefault();
            isSnapping = true;
            window.scrollTo({
              top: containerTop + scrollableDistance,
              behavior: "smooth",
            });
            setTimeout(() => { isSnapping = false; }, 850);
          }
          // Single scroll UP -> snap smoothly back to Hero section
          else if (e.deltaY < 0 && progress > 0.4 && currentScrollY <= containerTop + scrollableDistance + 30) {
            e.preventDefault();
            isSnapping = true;
            window.scrollTo({
              top: containerTop,
              behavior: "smooth",
            });
            setTimeout(() => { isSnapping = false; }, 850);
          }
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [mounted, isMobile]);

  // Determine active layout based on viewport width (renders only what is actually needed)
  const renderMobile = mounted && isMobile;

  return (
    <section id="hero" aria-label="Hero Section" className="min-h-screen selection:bg-primary selection:text-text relative overflow-x-clip">
      
      {renderMobile ? (
        /* ==================== MOBILE LAYOUT (< md) ==================== */
        <div className="block md:hidden">
          {/* Mobile Hero Section */}
          <div className="min-h-screen relative overflow-hidden">
            {/* Base background image for top portion */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
              <Image
                src="/Images/backgroudn.png"
                alt="Hero Background"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 1px"
                className="object-cover object-center"
              />
            </div>

            {/* Red SVG border line — 5px thickness, animated from intersection corner outwards */}
            <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none z-15 overflow-visible">
              <motion.line 
                x1="50%" 
                y1="45%" 
                x2="0%" 
                y2="45%" 
                stroke="var(--color-primary)" 
                strokeWidth="5" 
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: isLoadedReady ? 1 : 0 }}
                transition={{
                  duration: 1.2,
                  delay: isLoadedReady ? 0.1 : 0,
                  ease: [0.16, 1, 0.3, 1]
                }}
              />
              <motion.line 
                x1="50%" 
                y1="45%" 
                x2="calc(45% + 26.98vh)" 
                y2="0%" 
                stroke="var(--color-primary)" 
                strokeWidth="5" 
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: isLoadedReady ? 1 : 0 }}
                transition={{
                  duration: 1.2,
                  delay: isLoadedReady ? 0.1 : 0,
                  ease: [0.16, 1, 0.3, 1]
                }}
              />
            </svg>

            {/* Black section overlay */}
            <div 
              className="absolute inset-0 z-10 overflow-hidden bg-bg"
              style={{
                clipPath: "polygon(0% 45%, 50% 45%, calc(45% + 26.98vh) 0%, 100% 0%, 100% 100%, 0% 100%)",
              }}
            />

            {/* Content layer */}
            <div className="relative z-20 min-h-screen flex flex-col">
              {/* Logo area — top portion */}
              <div className="relative select-none" style={{ height: '45vh' }}>
                <motion.div 
                  initial={{ x: 80, opacity: 0 }}
                  animate={isLoadedReady ? { x: 0, opacity: 1 } : { x: 80, opacity: 0 }}
                  transition={{
                    duration: 1.2,
                    delay: isLoadedReady ? 1.3 : 0,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="absolute top-1/2 -translate-y-1/2 w-72 sm:w-96 aspect-[722/784] select-none"
                  style={{ left: '10vw' }}
                >
                  <div className="absolute inset-0 z-0">
                    <Image
                      src="/Images/shinejlogoonly.avif"
                      alt="Junaith Logo"
                      fill
                      sizes="(max-width: 768px) 85vw, 500px"
                      className="object-contain"
                      priority
                    />
                  </div>
                </motion.div>
              </div>

              {/* Text content — bottom portion */}
              <header className="flex-1 flex flex-col px-6 pt-10 pb-12">
                
                {/* Main Greeting */}
                <div className="mb-8">
                  <h1 className="text-2xl sm:text-3xl font-hedvig font-normal tracking-tight text-text select-none leading-tight pt-4">
                    <AnimatedCharacters 
                      text="Hi, I am Junaith" 
                      startDelay={1.3}
                      staggerDelay={0.04}
                      className="font-hedvig"
                      animate={isLoadedReady}
                    />
                  </h1>
                </div>

                {/* Stair-step Roles & Connecting Red Line */}
                <div className="select-none flex-1 flex flex-col justify-center">
                  <div className="relative">
                    <svg 
                      aria-label="Roles: Game Programmer, Software developer, Computer Science and Engineering Student, About me"
                      role="img"
                      viewBox="0 0 550 230" 
                      className="w-full h-auto overflow-visible"
                      preserveAspectRatio="xMinYMin meet"
                    >
                      {/* Role 3 — bottom-left: Computer Science and Engineering Student */}
                      <AnimatedSvgText 
                        text="Game Programmer"
                        x="0"
                        y="165"
                        startDelay={1.75}
                        staggerDelay={0.02}
                        fontSize="14"
                        fill="var(--color-text)"
                        fontFamily="var(--font-instrument), Georgia, serif"
                        animate={isLoadedReady}
                      />

                      {/* Role 2 — middle: Software developer */}
                      <AnimatedSvgText 
                        text="Software developer"
                        x="170"
                        y="100"
                        startDelay={2.3}
                        staggerDelay={0.025}
                        fontSize="14"
                        fill="var(--color-text)"
                        fontFamily="var(--font-instrument), Georgia, serif"
                        animate={isLoadedReady}
                      />

                      {/* Role 1 — top-right: Game Programmer */}
                      <AnimatedSvgText 
                        text="Computer Science and Engineering Student"
                        x="260"
                        y="35"
                        startDelay={2.7}
                        staggerDelay={0.025}
                        fontSize="14"
                        fill="var(--color-text)"
                        fontFamily="var(--font-instrument), Georgia, serif"
                        animate={isLoadedReady}
                      />

                      {/* About me → link */}
                      <AnimatedSvgText 
                        text="About me →"
                        x="370"
                        y="130"
                        startDelay={3.0}
                        staggerDelay={0.03}
                        fontSize="14"
                        fill="var(--color-text)"
                        fontFamily="var(--font-instrument), Georgia, serif"
                        animate={isLoadedReady}
                      />

                      {/* Red Animated Stair-Step Line */}
                      <motion.path 
                        aria-hidden="true"
                        d="M 0,185 L 140,185 L 195,120 L 265,120 L 315,55 L 570,55" 
                        stroke="var(--color-primary)" 
                        strokeWidth="1.5" 
                        fill="none" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: isLoadedReady ? 1 : 0 }}
                        transition={{
                          duration: 1.6,
                          delay: isLoadedReady ? 1.7 : 0,
                          ease: "easeInOut"
                        }}
                      />
                    </svg>

                    <a
                      href="#about"
                      onClick={(e) => {
                        e.preventDefault();
                        const aboutEl = document.getElementById("about");
                        if (aboutEl) {
                          aboutEl.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className="absolute right-0 bottom-[15%] w-32 h-10 cursor-pointer z-30 focus:outline-none"
                      aria-label="Scroll to About section"
                    />
                  </div>
                </div>

                {/* Quote at the bottom */}
                <blockquote className="mt-auto pt-6 text-sm text-center sm:text-lg text-text font-instrument font-normal select-none leading-relaxed" style={{ paddingBottom: '15%' }}>
                  <AnimatedCharacters 
                    text={"\u201CA journey of a thousand miles begins with a single step.\u201D"}
                    startDelay={3.0}
                    staggerDelay={0.02}
                    highlightWord="journey"
                    highlightClass="text-primary"
                    className="font-instrument"
                    animate={isLoadedReady}
                  />
                </blockquote>
              </header>
            </div>
          </div>

          {/* Mobile About Section (Normal Vertical Scroll) */}
          <About />
        </div>
      ) : (
        /* ==================== DESKTOP SCROLL LAYOUT (>= md) ==================== */
        <div ref={desktopContainerRef} className="block relative h-[200vh]">
          {/* Scroll snap anchor 1 — Hero start */}
          <div className="absolute top-0 left-0 w-full h-screen snap-start snap-always pointer-events-none" />

          {/* Sticky Viewport */}
          <div className="sticky top-0 h-screen w-full overflow-hidden bg-none relative">

            {/* Fixed Background Image Layer — Left Hero texture (z-0) */}
            <motion.div 
              initial={{ x: 0, opacity: 0 }}
              animate={isLoadedReady ? { x: 0, opacity: 1 } : { x: 0, opacity: 0 }}
              transition={{
                duration: 1.2,
                delay: isLoadedReady ? 0.1 : 0,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="absolute inset-0 z-0 select-none pointer-events-none"
              style={{ opacity: heroOpacity }}
            >
              <Image
                src="/Images/backgroudn.png"
                alt="Hero Background"
                fill
                priority
                sizes="(max-width: 768px) 1px, 50vw"
                className="object-scale-down object-left"
              />
            </motion.div>

            {/* Fixed Right About Background Image Layer — Fades in on scroll to About (z-0) */}
            <motion.div 
              className="absolute inset-0 z-0 select-none pointer-events-none"
              style={{ opacity: aboutBgOpacity }}
            >
              <Image
                src="/Images/wideportrait.avif"
                alt="S Mohammed Junaith wide portrait"
                fill
                className="h-full w-auto max-w-none object-contain object-right ml-auto"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>

            {/* Fixed Left Logo Layer — Fades out on scroll to About (z-5) */}
            <motion.div 
              initial={{ x: "100%", opacity: 0 }}
              animate={isLoadedReady ? { x: 0, opacity: 1 } : { x: "100%", opacity: 0 }}
              transition={{
                duration: 1.2,
                delay: isLoadedReady ? 1.3 : 0,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="absolute top-1/2 -translate-y-1/2 z-5 w-70 sm:w-96 md:w-[460px] lg:w-[540px] xl:w-[620px] aspect-[722/784] select-none pointer-events-none"
              style={{ left: '3vw', opacity: heroOpacity }}
            >
              <div className="absolute inset-0 z-0">
                <Image
                  src="/Images/shinejlogoonly.avif"
                  alt="Junaith Logo"
                  fill
                  sizes="(max-width: 768px) 85vw, 620px"
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>

            {/* Hero Content Sliding Layer — moves left on scroll (z-10) */}
            <motion.div 
              className="absolute inset-0 z-10 w-full h-full flex items-center justify-center px-6 sm:px-12 md:px-16 lg:px-24 py-12 pointer-events-none"
              style={{ x: heroX }}
            >
              {/* Slanted Edge Red Accent Border — 5px SVG line animated from center outwards */}
              <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none z-15 overflow-visible">
                <motion.line 
                  x1="37%" 
                  y1="50%" 
                  x2="calc(37% + 26.98vh)" 
                  y2="0%" 
                  stroke="var(--color-primary)" 
                  strokeWidth="5" 
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: isLoadedReady ? 1 : 0 }}
                  transition={{
                    duration: 1.2,
                    delay: isLoadedReady ? 0.1 : 0,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                />
                <motion.line 
                  x1="37%" 
                  y1="50%" 
                  x2="calc(37% - 26.98vh)" 
                  y2="100%" 
                  stroke="var(--color-primary)" 
                  strokeWidth="5" 
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: isLoadedReady ? 1 : 0 }}
                  transition={{
                    duration: 1.2,
                    delay: isLoadedReady ? 0.1 : 0,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                />
              </svg>

              {/* Slanted Right Black Background Split */}
              <div 
                className="absolute inset-0 z-10 overflow-hidden bg-bg"
                style={{
                  clipPath: "polygon(calc(37% + 26.98vh) 0%, 100% 0%, 100% 100%, calc(37% - 26.98vh) 100%)",
                }}
              />

              {/* Hero Content Container */}
              <header className="relative w-full max-w-7xl mx-auto min-h-[75vh] pointer-events-auto">
                {/* Main Greeting — absolutely positioned */}
                <div className="absolute z-20" style={{ top: '15%', left: '50%' }}>
                  <h1 className="text-[5vw] xl:text-[4.5vw] font-hedvig font-normal tracking-tight text-text select-none leading-tight">
                    <AnimatedCharacters 
                      text="Hi, I am Junaith" 
                      startDelay={1.3}
                      staggerDelay={0.04}
                      className="font-hedvig"
                      animate={isLoadedReady}
                    />
                  </h1>
                </div>
              </header>

              {/* Stair-step Roles & Connecting Red Line */}
              <div className="absolute z-20 select-none pointer-events-auto" style={{ bottom: '25%', right: '5%', width: '55%' }}>
                <div className="relative">
                  <svg 
                    aria-label="Roles: Computer Science and Engineering Student, Software developer, Game Programmer, About me"
                    role="img"
                    viewBox="0 0 860 190" 
                    className="w-full h-auto overflow-visible"
                  >
                    <motion.path 
                      aria-hidden="true"
                      d="M 0,175 L 350,175 L 435,110 L 595,110 L 680,45 L 860,45" 
                      stroke="var(--color-primary)" 
                      strokeWidth="2" 
                      fill="none" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: isLoadedReady ? 1 : 0 }}
                      transition={{
                        duration: 1.6,
                        delay: isLoadedReady ? 1.7 : 0,
                        ease: "easeInOut"
                      }}
                    />

                    <AnimatedSvgText 
                      text="Computer Science and Engineering Student"
                      x="0"
                      y="160"
                      startDelay={1.75}
                      staggerDelay={0.02}
                      fontFamily="var(--font-instrument), Georgia, serif"
                      fontSize="16"
                      animate={isLoadedReady}
                    />

                    <AnimatedSvgText 
                      text="Software developer"
                      x="440"
                      y="95"
                      startDelay={2.3}
                      staggerDelay={0.025}
                      fontFamily="var(--font-instrument), Georgia, serif"
                      fontSize="16"
                      animate={isLoadedReady}
                    />

                    <AnimatedSvgText 
                      text="Game Programmer"
                      x="680"
                      y="30"
                      startDelay={2.7}
                      staggerDelay={0.025}
                      fontFamily="var(--font-instrument), Georgia, serif"
                      fontSize="16"
                      animate={isLoadedReady}
                    />

                    {/* About me → link */}
                    <AnimatedSvgText 
                      text="About me →"
                      x="740"
                      y="125"
                      startDelay={3.0}
                      staggerDelay={0.03}
                      fontFamily="var(--font-instrument), Georgia, serif"
                      fontSize="16"
                      fill="var(--color-text)"
                      animate={isLoadedReady}
                    />
                  </svg>

                  {/* Interactive Click Target for About me → */}
                  <a
                    href="#about"
                    onClick={(e) => {
                      e.preventDefault();
                      const container = desktopContainerRef.current;
                      if (container) {
                        const rect = container.getBoundingClientRect();
                        const scrollableDistance = rect.height - window.innerHeight;
                        window.scrollTo({
                          top: window.scrollY + rect.top + scrollableDistance,
                          behavior: "smooth",
                        });
                      }
                    }}
                    className="absolute right-0 bottom-[20%] w-36 h-10 cursor-pointer z-30 focus:outline-none focus:ring-0 outline-none"
                    aria-label="Scroll to About section"
                  />
                </div>
              </div>

              {/* Bottom Quote */}
              <blockquote 
                className="absolute -translate-x-1/2 z-20 text-base sm:text-lg md:text-xl lg:text-2xl text-text font-instrument font-normal select-none text-center whitespace-nowrap pointer-events-auto"
                style={{ bottom: '10%', left:"53%" }}
              >
                <AnimatedCharacters 
                  text={"\u201CA journey of a thousand miles begins with a single step.\u201D"}
                  startDelay={3.0}
                  staggerDelay={0.02}
                  highlightWord="journey"
                  highlightClass="text-primary"
                  className="font-instrument"
                  animate={isLoadedReady}
                />
              </blockquote>
            </motion.div>

            {/* About Section Layer — moves in from right on scroll */}
            <motion.div 
              className="absolute inset-0 z-20 w-full h-full bg-transparent"
              style={{ x: aboutX }}
            >
              <About />
            </motion.div>

          </div>

          {/* Scroll snap anchor 2 — About complete reveal at 100vh */}
          <div className="absolute top-[100vh] left-0 w-full h-screen snap-start snap-always pointer-events-none" />
        </div>
      )}

    </section>
  );
}
