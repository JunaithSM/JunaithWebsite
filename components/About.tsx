"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { AnimatedCharacters, AnimatedSvgText } from "./ui/AnimatedText";
import SlantedTechScroll from "./ui/SlantedTechScroll";

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const bioText = "I'm a third-year student who likes figuring out how things work by making them myself. Some days that's code, some days it's tinkering with hardware, some days it's just chasing an idea until it turns into something real. This site is a small window into that.";

  const handleProjectsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const projectsEl = document.getElementById("projects");
    if (projectsEl) {
      projectsEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section 
      ref={sectionRef}
      id="about" 
      className="relative min-h-screen w-full bg-transparent text-text select-none overflow-hidden flex items-center justify-between"
    >


      {/* Desktop Layout Split: Dark Background Polygon overlay on the left */}
      <div 
        className="absolute inset-0 z-10 hidden md:block bg-bg"
        style={{
          clipPath: "polygon(0 0, calc(50% + 24vh) 0%, calc(50% - 24vh) 100%, 0 100%)",
        }}
      />

      {/* Slanted Tech Stack Infinite Scroll in the gap between the two red parallel lines */}
      <div className="absolute inset-0 z-30 hidden md:block pointer-events-auto">
        <SlantedTechScroll />
      </div>

      {/* Desktop Red Slanted Lines SVG Overlay */}
      <svg 
        className="absolute inset-0 w-full h-full z-10 pointer-events-none hidden md:block"
        style={{ filter: "drop-shadow(0 0 6px rgba(232, 34, 46, 0.4))" }}
      >
        {/* Slanted Line 1 (Left line) */}
        <motion.line 
          x1="calc(50% + 24vh)" 
          y1="0%" 
          x2="calc(50% - 24vh)" 
          y2="100%" 
          stroke="var(--color-primary)" 
          strokeWidth="3.5" 
          strokeLinecap="square"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: isInView ? 1 : 0 }}
          transition={{
            duration: 1.2,
            delay: isInView ? 0.1 : 0,
            ease: [0.16, 1, 0.3, 1]
          }}
        />

        {/* Slanted Line 2 (Right line) */}
        <motion.line 
          x1="calc(50% + 24vh + 100px)" 
          y1="0%" 
          x2="calc(50% - 24vh + 100px)" 
          y2="100%" 
          stroke="var(--color-primary)" 
          strokeWidth="3.5" 
          strokeLinecap="square"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: isInView ? 1 : 0 }}
          transition={{
            duration: 1.2,
            delay: isInView ? 0.25 : 0,
            ease: [0.16, 1, 0.3, 1]
          }}
        />
      </svg>

      {/* Mobile Background Image (70% opacity with top and bottom fade) */}
      <div className="absolute inset-0 z-10 pointer-events-none md:hidden overflow-hidden bg-bg">
        <div className="relative w-full h-full opacity-70 [mask-image:linear-gradient(to_bottom,transparent_0%,black_20%,black_60%,transparent_100%)] [webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_20%,black_60%,transparent_100%)]">
          <Image 
            src="/Images/bakground.png" 
            alt="About section mobile background"
            fill
            className="object-cover object-center"
            priority
            sizes="(max-width: 768px) 100vw, 1px"
          />
        </div>
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-bg via-bg/80 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg via-bg/80 to-transparent pointer-events-none" />
      </div>

      {/* Content Container */}
      <div className="relative z-20 w-full px-8 sm:px-12 md:px-16 lg:px-24 py-12 flex flex-col justify-between min-h-screen pointer-events-auto">
        
        {/* Top spacer */}
        <div className="h-12 md:h-16" />

        {/* Main Text Content */}
        <div className="flex flex-col justify-center max-w-xl md:max-w-2xl lg:max-w-3xl my-auto space-y-6 md:space-y-10">
          
          {/* Mobile Portrait Image - Positioned on top of title and content */}
          <div className="md:hidden flex justify-start w-full mb-2 sm:mb-4">
            <motion.div 
              className="relative w-[90vw] max-w-md aspect-[2/3] [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)] [webkit-mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0.95, y: isInView ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image 
                src="/Images/portraitonly.png" 
                alt="S Mohammed Junaith portrait"
                fill
                className="object-contain object-left-bottom"
                priority
                sizes="90vw"
              />
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-bg via-bg/60 to-transparent pointer-events-none" />
            </motion.div>
          </div>

          {/* Main Heading: Hedvig Letters Serif */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-hedvig font-normal tracking-tight text-text leading-tight lg:whitespace-nowrap">
            <AnimatedCharacters 
              text="S Mohammed Junaith" 
              startDelay={0.2}
              staggerDelay={0.04}
              className="font-hedvig"
              animate={isInView}
            />
          </h2>

          {/* Paragraph Bio: Instrument Serif */}
          <p className="text-base sm:text-lg md:text-xl font-instrument text-text-secondary leading-relaxed md:leading-relaxed font-normal max-w-md md:max-w-[30vw]">
            <AnimatedCharacters 
              text={bioText} 
              startDelay={0.7}
              staggerDelay={0.012}
              className="font-instrument"
              animate={isInView}
            />
          </p>
        </div>

        {/* Bottom Section: Stair-step Red Line & Labels */}
        <div className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl pb-6">
          <div className="relative">
            <svg 
              viewBox="0 0 650 100" 
              className="w-full h-auto overflow-visible select-none"
            >
              {/* Stair-step Red Line */}
              <motion.path 
                d="M 0,85 L 220,85 L 255,45 L 340,45" 
                stroke="var(--color-primary)" 
                strokeWidth="2" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: isInView ? 1 : 0 }}
                transition={{
                  duration: 1.4,
                  delay: isInView ? 1.2 : 0,
                  ease: "easeInOut"
                }}
              />

              {/* Left Label: Engineer at Heart, Creative by Habit */}
              <AnimatedSvgText 
                text="Engineer at Heart, Creative by Habit"
                x="0"
                y="70"
                startDelay={1.4}
                staggerDelay={0.02}
                fontSize="17"
                fill="var(--color-text-secondary)"
                fontFamily="var(--font-instrument), Georgia, serif"
                animate={isInView}
              />

              {/* Right Link: Projects → */}
              <AnimatedSvgText 
                text="Projects →"
                x="260"
                y="30"
                startDelay={2.0}
                staggerDelay={0.03}
                fontSize="19"
                fill="var(--color-text)"
                fontFamily="var(--font-instrument), Georgia, serif"
                animate={isInView}
              />
            </svg>

            {/* Interactive Click Target for Projects Link */}
            <a
              href="#projects"
              onClick={handleProjectsClick}
              className="absolute right-0 top-0 w-36 h-12 cursor-pointer rounded z-30 focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label="Scroll to Projects section"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
