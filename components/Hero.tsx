"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import About from "./About";

// Helper component for character-by-character text reveal in HTML
function AnimatedCharacters({ 
  text, 
  className = "", 
  startDelay = 0, 
  staggerDelay = 0.03,
  highlightWord,
  highlightClass = "text-primary"
}: {
  text: string;
  className?: string;
  startDelay?: number;
  staggerDelay?: number;
  highlightWord?: string;
  highlightClass?: string;
}) {
  const words = text.split(" ");
  let globalCharCount = 0;

  return (
    <span className={className}>
      {words.map((word, wordIdx) => {
        const isHighlighted = highlightWord && word.includes(highlightWord);
        const wordChars = word.split("");

        return (
          <span key={wordIdx} className="inline-block whitespace-nowrap">
            {wordChars.map((char, charIdx) => {
              const charDelay = startDelay + globalCharCount * staggerDelay;
              globalCharCount++;
              return (
                <motion.span
                  key={charIdx}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.15,
                    delay: charDelay,
                    ease: "easeOut"
                  }}
                  className={`inline-block ${isHighlighted ? highlightClass : ""}`}
                >
                  {char}
                </motion.span>
              );
            })}
            {wordIdx < words.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </span>
        );
      })}
    </span>
  );
}

// Helper component for SVG text character-by-character reveal
function AnimatedSvgText({
  text,
  x,
  y,
  startDelay = 0,
  staggerDelay = 0.025,
  fontSize = "17",
  fill = "var(--color-text)",
}: {
  text: string;
  x: number | string;
  y: number | string;
  startDelay?: number;
  staggerDelay?: number;
  fontSize?: string;
  fill?: string;
}) {
  return (
    <text
      x={x}
      y={y}
      fill={fill}
      fontSize={fontSize}
      fontWeight="400"
      style={{ fontFamily: "var(--font-commissioner), sans-serif" }}
    >
      {text.split("").map((char, index) => (
        <motion.tspan
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.08,
            delay: startDelay + index * staggerDelay,
          }}
        >
          {char}
        </motion.tspan>
      ))}
    </text>
  );
}

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
            {/* Base background */}
            <div className="absolute inset-0 bg-none z-0" />

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
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 1.2,
                  delay: 0.1,
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
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 1.2,
                  delay: 0.1,
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
                  animate={{ x: 0, opacity: 1 }}
                  transition={{
                    duration: 1.2,
                    delay: 1.3,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="absolute top-1/2 -translate-y-1/2 w-56 sm:w-72 aspect-[722/784] select-none"
                  style={{ left: '20vw' }}
                >
                  <div className="absolute inset-0 z-0">
                    <Image
                      src="/Images/Logo-red.svg"
                      alt="Junaith Logo"
                      fill
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
                  <h1 className="text-5xl pt-10 sm:text-5xl font-normal tracking-tight text-text select-none leading-tight">
                    <AnimatedCharacters 
                      text="Hi, I am Junaith" 
                      startDelay={1.3}
                      staggerDelay={0.04}
                    />
                  </h1>
                </div>

                {/* Stair-step Roles & Connecting Red Line */}
                <div className="select-none flex-1 flex flex-col justify-center">
                  <svg 
                    aria-label="Roles: Game Programmer, Software developer, Computer Science and Engineering Student"
                    role="img"
                    viewBox="0 0 550 200" 
                    className="w-full h-auto overflow-visible"
                    preserveAspectRatio="xMinYMin meet"
                  >
                    {/* Role 3 — bottom-left: Game Programmer */}
                    <AnimatedSvgText 
                      text="Game Programmer"
                      x="0"
                      y="165"
                      startDelay={2.7}
                      staggerDelay={0.025}
                      fontSize="15"
                      fill="var(--color-text)"
                    />

                    {/* Role 2 — middle: Software developer */}
                    <AnimatedSvgText 
                      text="Software developer"
                      x="120"
                      y="100"
                      startDelay={2.3}
                      staggerDelay={0.025}
                      fontSize="15"
                      fill="var(--color-text)"
                    />

                    {/* Role 1 — top-right: Computer Science and Engineering Student */}
                    <AnimatedSvgText 
                      text="Computer Science and Engineering Student"
                      x="215"
                      y="35"
                      startDelay={1.75}
                      staggerDelay={0.02}
                      fontSize="15"
                      fill="var(--color-text)"
                    />

                    {/* Red Animated Stair-Step Line */}
                    <motion.path 
                      aria-hidden="true"
                      d="M 0,185 L 150,185 L 195,120 L 265,120 L 315,55 L 570,55" 
                      stroke="var(--color-primary)" 
                      strokeWidth="1.5" 
                      fill="none" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{
                        duration: 1.6,
                        delay: 1.7,
                        ease: "easeInOut"
                      }}
                    />
                  </svg>
                </div>

                {/* Quote at the bottom */}
                <blockquote className="mt-auto pt-6 text-sm text-center sm:text-lg text-text font-normal select-none leading-relaxed" style={{ paddingBottom: '15%' }}>
                  <AnimatedCharacters 
                    text={"\u201CA journey of a thousand miles begins with a single step.\u201D"}
                    startDelay={3.0}
                    staggerDelay={0.02}
                    highlightWord="journey"
                    highlightClass="text-primary"
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

            {/* Fixed Left Logo Layer — Stays in fixed position in back layer (z-5) */}
            <motion.div 
              initial={{ x: 160, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                duration: 1.2,
                delay: 1.3,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="absolute top-1/2 -translate-y-1/2 z-5 w-64 sm:w-80 md:w-96 lg:w-[380px] xl:w-[420px] aspect-[722/784] select-none pointer-events-none"
              style={{ left: '10vw' }}
            >
              <div className="absolute inset-0 z-0">
                <Image
                  src="/Images/Logo-red.svg"
                  alt="Junaith Logo"
                  fill
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
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 1.2,
                    delay: 0.1,
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
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 1.2,
                    delay: 0.1,
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
                  <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight text-text select-none leading-tight">
                    <AnimatedCharacters 
                      text="Hi, I am Junaith" 
                      startDelay={1.3}
                      staggerDelay={0.04}
                    />
                  </h1>
                </div>
              </header>

              {/* Stair-step Roles & Connecting Red Line */}
              <div className="absolute z-20 select-none pointer-events-auto" style={{ bottom: '25%', right: '5%', width: '55%' }}>
                <svg 
                  aria-label="Roles: Computer Science and Engineering Student, Software developer, Game Programmer"
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
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 1.6,
                      delay: 1.7,
                      ease: "easeInOut"
                    }}
                  />

                  <AnimatedSvgText 
                    text="Computer Science and Engineering Student"
                    x="0"
                    y="160"
                    startDelay={1.75}
                    staggerDelay={0.02}
                  />

                  <AnimatedSvgText 
                    text="Software developer"
                    x="440"
                    y="95"
                    startDelay={2.3}
                    staggerDelay={0.025}
                  />

                  <AnimatedSvgText 
                    text="Game Programmer"
                    x="680"
                    y="30"
                    startDelay={2.7}
                    staggerDelay={0.025}
                  />
                </svg>
              </div>

              {/* Bottom Quote */}
              <blockquote 
                className="absolute -translate-x-1/2 z-20 text-base sm:text-lg md:text-xl lg:text-2xl text-text font-normal select-none text-center whitespace-nowrap pointer-events-auto"
                style={{ bottom: '10%', left:"53%" }}
              >
                <AnimatedCharacters 
                  text={"\u201CA journey of a thousand miles begins with a single step.\u201D"}
                  startDelay={3.0}
                  staggerDelay={0.02}
                  highlightWord="journey"
                  highlightClass="text-primary"
                />
              </blockquote>
            </motion.div>

            {/* About Section Layer — moves in from right on scroll, covering the logo (z-20) */}
            <motion.div 
              className="absolute inset-0 z-20 w-full h-full bg-bg"
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
