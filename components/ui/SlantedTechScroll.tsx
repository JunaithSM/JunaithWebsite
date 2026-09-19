"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";

const TECH_STACK = [
  { name: "React", icon: "/techstack/react.svg" },
  { name: "TypeScript", icon: "/techstack/typescript.svg" },
  { name: "Next.js", icon: "/techstack/nextjs.svg" },
  { name: "Python", icon: "/techstack/python.svg" },
  { name: "C++", icon: "/techstack/cpp.svg" },
  { name: "C", icon: "/techstack/c.svg" },
  { name: "Java", icon: "/techstack/java.svg" },
  { name: "JavaScript", icon: "/techstack/javascript.svg" },
  { name: "Linux", icon: "/techstack/linux.svg" },
  { name: "Arch Linux", icon: "/techstack/archlinux.svg" },
  { name: "Kali Linux", icon: "/techstack/kalilinux.svg" },
  { name: "Docker", icon: "/techstack/docker.svg" },
  { name: "PostgreSQL", icon: "/techstack/postgresql.svg" },
  { name: "MongoDB", icon: "/techstack/mongodb.svg" },
  { name: "MySQL", icon: "/techstack/mysql.svg" },
  { name: "SQLite", icon: "/techstack/sqlite.svg" },
  { name: "Redis", icon: "/techstack/redis.svg" },
  { name: "Node.js", icon: "/techstack/nodejs.svg" },
  { name: "Express.js", icon: "/techstack/expressjs.svg" },
  { name: "FastAPI", icon: "/techstack/fastapi.svg" },
  { name: "Spring Boot", icon: "/techstack/springboot.svg" },
  { name: "Tailwind CSS", icon: "/techstack/tailwindcss.svg" },
  { name: "HTML5", icon: "/techstack/html5.svg" },
  { name: "CSS3", icon: "/techstack/css3.svg" },
  { name: "Bootstrap", icon: "/techstack/bootstrap.svg" },
  { name: "Framer Motion", icon: "/techstack/framer-motion.svg" },
  { name: "Git", icon: "/techstack/git.svg" },
  { name: "GitHub", icon: "/techstack/github.svg" },
  { name: "Neovim", icon: "/techstack/neovim.svg" },
  { name: "Bash", icon: "/techstack/bash.svg" },
  { name: "Lua", icon: "/techstack/lua.svg" },
  { name: "ESP32", icon: "/techstack/esp32-espressif.svg" },
  { name: "Arduino", icon: "/techstack/arduino.svg" },
  { name: "PlatformIO", icon: "/techstack/platformio.svg" },
  { name: "Unity", icon: "/techstack/unity.svg" },
  { name: "Unreal Engine", icon: "/techstack/unrealengine.svg" },
  { name: "Android Studio", icon: "/techstack/androidstudio.svg" },
  { name: "Figma", icon: "/techstack/figma.svg" },
  { name: "Supabase", icon: "/techstack/supabase.svg" },
  { name: "Socket.io", icon: "/techstack/socketio.svg" },
  { name: "Postman", icon: "/techstack/postman.svg" },
  { name: "Discord.js", icon: "/techstack/discordjs.svg" },
  { name: "Vercel", icon: "/techstack/vercel.svg" },
  { name: "Render", icon: "/techstack/render.svg" },
  { name: "VMware", icon: "/techstack/vmware.svg" },
  { name: "VirtualBox", icon: "/techstack/virtualbox.svg" },
  { name: "Wireshark", icon: "/techstack/wireshark.svg" },
  { name: "YAML", icon: "/techstack/yaml.svg" },
  { name: "PHP", icon: "/techstack/php.svg" },
];

export default function SlantedTechScroll() {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const y = useMotionValue(-3332);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0, time: 0 });

  // Physics Velocity in px/ms (Default auto-scroll speed = 0.045 px/ms)
  const BASE_SPEED = 0.045;
  const velocityRef = useRef(BASE_SPEED);

  // Single set height: 49 items * (48px height + 20px gap) = 3332px
  const SINGLE_SET_HEIGHT = 3332;

  // Keep hover ref in sync for animation frame without closures lag
  isHoveredRef.current = isHovered;

  useAnimationFrame((_, delta) => {
    // Cap dt to prevent massive physics jumps on lag spikes / tab switching
    const dt = Math.min(delta, 32);

    if (!isDraggingRef.current) {
      // Target velocity: 0 when hovered, BASE_SPEED (0.045 px/ms) when unhovered
      const targetVel = isHoveredRef.current ? 0 : BASE_SPEED;

      // Exponential friction decay towards target velocity (~0.92 decay factor per 16ms frame)
      const decayFactor = Math.pow(0.92, dt / 16);
      velocityRef.current = targetVel + (velocityRef.current - targetVel) * decayFactor;

      const currentY = y.get();
      const nextY = currentY + velocityRef.current * dt;

      // Continuous top-to-bottom infinite loop wrap
      let wrappedY = nextY;
      while (wrappedY >= 0) {
        wrappedY -= SINGLE_SET_HEIGHT;
      }
      while (wrappedY < -SINGLE_SET_HEIGHT) {
        wrappedY += SINGLE_SET_HEIGHT;
      }
      y.set(wrappedY);
    }
  });

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    lastPointerRef.current = { x: e.clientX, y: e.clientY, time: performance.now() };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const now = performance.now();
    const dt = Math.max(1, now - lastPointerRef.current.time);
    const dx = e.clientX - lastPointerRef.current.x;
    const dy = e.clientY - lastPointerRef.current.y;

    if (Math.hypot(dx, dy) > 2) {
      hasDraggedRef.current = true;
    }

    // Project displacement along the 25.641 degree slanted axis
    const rad = (25.641 * Math.PI) / 180;
    const dist = dx * Math.sin(rad) + dy * Math.cos(rad);

    // Calculate instantaneous velocity (px/ms) and smooth with low-pass filter
    const instantVel = dist / dt;
    velocityRef.current = velocityRef.current * 0.2 + instantVel * 0.8;
    // Clamp max drag velocity to prevent runaway speeds
    velocityRef.current = Math.max(-3.0, Math.min(3.0, velocityRef.current));

    lastPointerRef.current = { x: e.clientX, y: e.clientY, time: now };

    let nextY = y.get() + dist;
    // Infinite loop wrap during drag
    while (nextY >= 0) {
      nextY -= SINGLE_SET_HEIGHT;
    }
    while (nextY < -SINGLE_SET_HEIGHT) {
      nextY += SINGLE_SET_HEIGHT;
    }
    y.set(nextY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);

      if (!hasDraggedRef.current) {
        // Simple click without dragging -> set velocity to hover target
        velocityRef.current = isHoveredRef.current ? 0 : BASE_SPEED;
      }

      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    // Add scroll wheel impulse to velocity (negative deltaY = wheel up = scroll up)
    const impulse = -e.deltaY * 0.006;
    velocityRef.current = Math.max(-3.0, Math.min(3.0, velocityRef.current + impulse));
  };

  // Duplicate items array for seamless looping
  const duplicatedItems = [...TECH_STACK, ...TECH_STACK];

  return (
    <div className="relative w-full h-full pointer-events-none select-none overflow-hidden">
      {/* Top & bottom gradient fade mask */}
      <div 
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
        }}
      />

      {/* Slanted marquee track container */}
      <div 
        className={`absolute left-[calc(50%+50px)] top-1/2 w-[100px] h-[240vh] pointer-events-auto z-30 touch-none select-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{ transform: "translate(-50%, -50%) rotate(25.641deg)" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          if (!isDragging) {
            setIsHovered(false);
            setHoveredIndex(null);
          }
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
      >
        <motion.div
          className="flex flex-col items-center gap-5 py-6"
          style={{ y }}
        >
          {duplicatedItems.map((item, index) => {
            const isItemHovered = !isDragging && hoveredIndex === index;

            return (
              <div
                key={`${item.name}-${index}`}
                onMouseEnter={() => {
                  if (!isDragging) {
                    setIsHovered(true);
                    setHoveredIndex(index);
                  }
                }}
                onMouseLeave={() => {
                  if (!isDragging) {
                    setHoveredIndex(null);
                  }
                }}
                className="group relative flex items-center justify-center w-12 h-12 rounded-none  transition-colors duration-200 cursor-pointer"
              >
                {/* Icon image rotated in the direction of the flow */}
                <div className="relative w-6 h-6 flex items-center justify-center">
                  <Image
                    src={item.icon}
                    alt={item.name}
                    width={24}
                    height={24}
                    className="w-full h-full object-contain opacity-85 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                  />
                </div>

                {/* Sharp Tooltip with bottom border & slanted right border */}
                <div 
                  className={`absolute left-full ml-3 py-1.5 pl-5 pr-9 bg-[#14141400] text-xs font-sans font-medium text-text whitespace-nowrap transition-all duration-200 pointer-events-none z-50 flex items-center rounded-none ${
                    isItemHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                  }`}
                  style={{ 
                    transform: "rotate(-25.641deg)",
                    clipPath: "polygon(0 0, 100% 0, calc(100% - 24px) 100%, 0 100%)",
                  }}
                >
                  {/* Red bottom and slanted right border overlay */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                    {/* Bottom border */}
                    <line x1="0" y1="100%" x2="calc(100% - 24px)" y2="100%" stroke="var(--color-primary)" strokeWidth="2" />
                    {/* Slanted right border ( Top-Right to Bottom-Left ) */}
                    <line x1="100%" y1="0" x2="calc(100% - 24px)" y2="100%" stroke="var(--color-primary)" strokeWidth="2" />
                  </svg>
                  <span>{item.name}</span>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Top & bottom gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg pointer-events-none z-10 opacity-60" />
    </div>
  );
}
