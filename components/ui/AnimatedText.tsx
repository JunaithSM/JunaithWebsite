"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function AnimatedCharacters({ 
  text, 
  className = "", 
  startDelay = 0, 
  staggerDelay = 0.03,
  highlightWord,
  highlightClass = "text-primary",
  animate: forceAnimate,
}: {
  text: string;
  className?: string;
  startDelay?: number;
  staggerDelay?: number;
  highlightWord?: string;
  highlightClass?: string;
  animate?: boolean;
}) {
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (forceAnimate) {
      setHasAnimated(true);
    }
  }, [forceAnimate]);

  const words = text.split(" ");
  let globalCharCount = 0;

  const isAnimated = forceAnimate !== undefined ? (forceAnimate || hasAnimated) : true;

  return (
    <span className={className}>
      {words.map((word, wordIdx) => {
        const isHighlighted = highlightWord && word.includes(highlightWord);
        const wordChars = word.split("");

        return (
          <span key={wordIdx} className="inline-block whitespace-nowrap">
            {wordChars.map((char, charIdx) => {
              const charDelay = hasAnimated ? 0 : startDelay + globalCharCount * staggerDelay;
              globalCharCount++;

              return (
                <motion.span
                  key={charIdx}
                  initial={{ opacity: 0, y: 4 }}
                  animate={forceAnimate !== undefined ? { opacity: isAnimated ? 1 : 0, y: isAnimated ? 0 : 4 } : undefined}
                  whileInView={forceAnimate === undefined ? { opacity: 1, y: 0 } : undefined}
                  viewport={forceAnimate === undefined ? { once: true, amount: 0.3 } : undefined}
                  transition={{
                    duration: hasAnimated ? 0 : 0.15,
                    delay: isAnimated ? charDelay : 0,
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

export function AnimatedSvgText({
  text,
  x,
  y,
  startDelay = 0,
  staggerDelay = 0.025,
  fontSize = "17",
  fill = "var(--color-text)",
  fontFamily = "var(--font-instrument), Georgia, serif",
  animate: forceAnimate,
}: {
  text: string;
  x: number | string;
  y: number | string;
  startDelay?: number;
  staggerDelay?: number;
  fontSize?: string;
  fill?: string;
  fontFamily?: string;
  animate?: boolean;
}) {
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (forceAnimate) {
      setHasAnimated(true);
    }
  }, [forceAnimate]);

  const isAnimated = forceAnimate !== undefined ? (forceAnimate || hasAnimated) : true;

  return (
    <text
      x={x}
      y={y}
      fill={fill}
      fontSize={fontSize}
      fontWeight="400"
      style={{ fontFamily }}
    >
      {text.split("").map((char, index) => {
        const charDelay = hasAnimated ? 0 : startDelay + index * staggerDelay;

        return (
          <motion.tspan
            key={index}
            initial={{ opacity: 0 }}
            animate={forceAnimate !== undefined ? { opacity: isAnimated ? 1 : 0 } : undefined}
            whileInView={forceAnimate === undefined ? { opacity: 1 } : undefined}
            viewport={forceAnimate === undefined ? { once: true, amount: 0.3 } : undefined}
            transition={{
              duration: hasAnimated ? 0 : 0.08,
              delay: isAnimated ? charDelay : 0,
            }}
          >
            {char}
          </motion.tspan>
        );
      })}
    </text>
  );
}
