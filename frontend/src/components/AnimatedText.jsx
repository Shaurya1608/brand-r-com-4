"use client";

import { motion } from "framer-motion";

export default function AnimatedText({ 
  children, 
  className = "", 
  delay = 0, 
  direction = "up",
  duration = 0.6,
  once = true
}) {
  const directions = {
    up: { y: 30, x: 0 },
    down: { y: -30, x: 0 },
    left: { x: 30, y: 0 },
    right: { x: -30, y: 0 },
    none: { x: 0, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: once, margin: "-10%" }}
      transition={{ duration: duration, delay: delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
